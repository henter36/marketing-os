const base = require("./router_sprint3");
const { createHash } = require("crypto");
const { loadConfig } = require("./config");
const { createPool } = require("./db");
const { AppError, correlationId, errorBody, sendJson } = require("./error-model");
const { createRepositories } = require("./repositories");
const { createSeedStore } = require("./store");
const { authGuard, membershipCheck, permissionGuard, rejectBodyWorkspaceId, workspaceContextGuard } = require("./guards");

const safeModeStatuses = ["inactive", "active"];
const onboardingStatuses = ["not_started", "in_progress", "completed", "skipped"];
const connectorTypes = ["generic", "cms", "crm", "commerce", "analytics", "social", "notification", "storage", "webhook"];
const notificationChannels = ["in_app", "email", "webhook_reserved"];
const consentStatuses = ["granted", "denied", "revoked", "unknown"];
const rawSecretFields = ["raw_secret", "api_key", "token", "refresh_token", "password", "signing_secret"];
const sprint4Routes = [
  "GET /workspaces/{workspaceId}/campaigns/{campaignId}/client-report-snapshots",
  "POST /workspaces/{workspaceId}/campaigns/{campaignId}/client-report-snapshots",
  "GET /workspaces/{workspaceId}/audit-logs",
  "GET /workspaces/{workspaceId}/safe-mode",
  "POST /workspaces/{workspaceId}/safe-mode",
  "GET /workspaces/{workspaceId}/onboarding-progress",
  "PATCH /workspaces/{workspaceId}/onboarding-progress"
];
const patch002Routes = [
  "GET /workspaces/{workspaceId}/connectors",
  "POST /workspaces/{workspaceId}/connectors",
  "GET /workspaces/{workspaceId}/connectors/{connectorId}/accounts",
  "POST /workspaces/{workspaceId}/connectors/{connectorId}/accounts",
  "POST /workspaces/{workspaceId}/connectors/{connectorId}/accounts/{connectorAccountId}/credentials",
  "GET /workspaces/{workspaceId}/connectors/{connectorId}/sync-runs",
  "POST /workspaces/{workspaceId}/webhooks/{endpointKey}",
  "GET /workspaces/{workspaceId}/campaigns/{campaignId}/performance-events",
  "POST /workspaces/{workspaceId}/campaigns/{campaignId}/performance-events",
  "GET /workspaces/{workspaceId}/campaigns/{campaignId}/metric-snapshots",
  "POST /workspaces/{workspaceId}/campaigns/{campaignId}/metric-snapshots",
  "GET /workspaces/{workspaceId}/contacts",
  "POST /workspaces/{workspaceId}/contacts",
  "GET /workspaces/{workspaceId}/contacts/{contactId}/consents",
  "POST /workspaces/{workspaceId}/contacts/{contactId}/consents",
  "GET /workspaces/{workspaceId}/campaigns/{campaignId}/lead-captures",
  "POST /workspaces/{workspaceId}/campaigns/{campaignId}/lead-captures",
  "GET /workspaces/{workspaceId}/notification-rules",
  "POST /workspaces/{workspaceId}/notification-rules",
  "GET /workspaces/{workspaceId}/notification-deliveries"
];
const implementedRoutes = [...base.implementedRoutes, ...sprint4Routes, ...patch002Routes];

function createApp(options = {}) {
  const store = options.store || createSeedStore();
  const config = options.config || loadConfig(options.env || process.env);
  const brandRuntimeMode = options.brandRuntimeMode || config.brandRuntimeMode || "in_memory";
  const brandRepositories = brandRuntimeMode === "repository"
    ? options.repositories || createRepositories({ pool: options.pool || createPool({ env: options.env, requireDatabaseUrl: true }) })
    : null;
  const baseApp = base.createApp({ store });

  return async function app(req, res) {
    const url = new URL(req.url, "http://localhost");
    const path = url.pathname.replace(/^\/v1/, "");
    const shouldRouteBrandToRepository = brandRuntimeMode === "repository" && isBrandPath(path);

    if (!shouldRouteBrandToRepository && !isSprint4Path(path) && !isPatch002Path(path)) {
      return baseApp(req, res);
    }

    const id = correlationId(req);
    try {
      const body = await readBody(req);
      const result = shouldRouteBrandToRepository
        ? await routeBrandRepositories(req, path, body, store, brandRepositories)
        : isPatch002Path(path)
          ? routePatch002(req, path, body, store)
          : routeSprint4(req, path, body, store);
      sendJson(res, result.status || 200, result.body);
    } catch (error) {
      const appError = error instanceof AppError
        ? error
        : new AppError(500, "INTERNAL_ERROR", "Unexpected server error.", "Retry or contact support.");
      sendJson(res, appError.status, errorBody(appError, id));
    }
  };
}

async function routeBrandRepositories(req, path, body, store, repositories) {
  const workspaceMatch = path.match(/^\/workspaces\/([^/]+)\/(.*)$/);
  if (!workspaceMatch) throw notFound();

  const workspaceId = workspaceContextGuard({ workspaceId: workspaceMatch[1] });
  const user = authGuard(req, store);
  const membership = membershipCheck(user, workspaceId, store);
  const child = workspaceMatch[2];

  if (child === "brand-profiles") {
    if (req.method === "GET") {
      permissionGuard(membership, "brand.read");
      return ok(await repositories.brandProfiles.listByWorkspace({ workspaceId }));
    }

    if (req.method === "POST") {
      permissionGuard(membership, "brand.write");
      rejectBodyWorkspaceId(body, workspaceId);
      const brandProfile = await repositories.brandProfiles.create({ workspaceId, input: body, actorUserId: user.user_id });
      audit(store, workspaceId, user, "brand_profile.created", "BrandProfile", brandProfile.brand_profile_id, null, brandProfile);
      return created(brandProfile);
    }
  }

  const brandRules = child.match(/^brand-profiles\/([^/]+)\/rules$/);
  if (brandRules) {
    const brandProfileId = brandRules[1];

    if (req.method === "GET") {
      permissionGuard(membership, "brand.read");
      return ok(await repositories.brandVoiceRules.listByBrandProfile({ workspaceId, brandProfileId }));
    }

    if (req.method === "POST") {
      permissionGuard(membership, "brand.write");
      rejectBodyWorkspaceId(body, workspaceId);
      const rule = await repositories.brandVoiceRules.create({ workspaceId, brandProfileId, input: body });
      audit(store, workspaceId, user, "brand_voice_rule.created", "BrandVoiceRule", rule.brand_voice_rule_id, null, rule);
      return created(rule);
    }
  }

  throw notFound();
}

function routePatch002(req, path, body, store) {
  const workspaceMatch = path.match(/^\/workspaces\/([^/]+)\/(.*)$/);
  if (!workspaceMatch) throw notFound();

  const workspaceId = workspaceContextGuard({ workspaceId: workspaceMatch[1] });
  const user = authGuard(req, store);
  const membership = membershipCheck(user, workspaceId, store);
  const child = workspaceMatch[2];

  if (child === "connectors") {
    if (req.method === "GET") {
      permissionGuard(membership, "connector.read");
      return ok(store.connectors.filter((connector) => connector.workspace_id === workspaceId));
    }

    if (req.method === "POST") {
      permissionGuard(membership, "connector.write");
      rejectBodyWorkspaceId(body, workspaceId);
      requireFields(body, ["connector_key", "connector_name", "connector_type"]);
      requireOneOf(body.connector_type, connectorTypes, "VALIDATION_FAILED", "Connector type is invalid.");
      if (store.connectors.some((connector) => connector.workspace_id === workspaceId && connector.connector_key === body.connector_key)) {
        throw new AppError(409, "CONNECTOR_ALREADY_EXISTS", "Connector key already exists in this workspace.", "Use a unique connector_key.");
      }
      const connector = {
        connector_id: nextId("connector", store.connectors),
        workspace_id: workspaceId,
        connector_key: body.connector_key,
        connector_name: body.connector_name,
        connector_type: body.connector_type,
        connector_status: "draft",
        config_schema: clone(body.config_schema || {}),
        created_by_user_id: user.user_id,
        created_at: now(),
        updated_at: now()
      };
      store.connectors.push(connector);
      audit(store, workspaceId, user, "connector.created", "Connector", connector.connector_id, null, connector);
      return created(connector);
    }
  }

  const connectorAccounts = child.match(/^connectors\/([^/]+)\/accounts$/);
  if (connectorAccounts) {
    const connector = findConnector(store, workspaceId, connectorAccounts[1]);
    if (req.method === "GET") {
      permissionGuard(membership, "connector.read");
      return ok(store.connector_accounts.filter((account) => account.workspace_id === workspaceId && account.connector_id === connector.connector_id));
    }

    if (req.method === "POST") {
      permissionGuard(membership, "connector.write");
      rejectBodyWorkspaceId(body, workspaceId);
      requireFields(body, ["account_label"]);
      const account = {
        connector_account_id: nextId("connector-account", store.connector_accounts),
        workspace_id: workspaceId,
        connector_id: connector.connector_id,
        external_account_ref: body.external_account_ref || null,
        account_label: body.account_label,
        account_status: "active",
        created_at: now(),
        updated_at: now()
      };
      store.connector_accounts.push(account);
      audit(store, workspaceId, user, "connector_account.created", "ConnectorAccount", account.connector_account_id, null, account);
      return created(account);
    }
  }

  const connectorCredentials = child.match(/^connectors\/([^/]+)\/accounts\/([^/]+)\/credentials$/);
  if (connectorCredentials && req.method === "POST") {
    const connector = findConnector(store, workspaceId, connectorCredentials[1]);
    const account = findConnectorAccount(store, workspaceId, connector.connector_id, connectorCredentials[2]);
    permissionGuard(membership, "connector.rotate_secret");
    rejectBodyWorkspaceId(body, workspaceId);
    rejectRawSecretFields(body);
    requireOnlyFields(body, ["secret_ref"]);
    requireFields(body, ["secret_ref"]);
    const credential = {
      connector_credential_id: nextId("connector-credential", store.connector_credentials),
      workspace_id: workspaceId,
      connector_id: connector.connector_id,
      connector_account_id: account.connector_account_id,
      secret_ref: body.secret_ref,
      credential_status: "active",
      created_at: now()
    };
    store.connector_credentials.push(credential);
    audit(store, workspaceId, user, "connector_credential.created", "ConnectorCredential", credential.connector_credential_id, null, credential);
    return created(redactCredential(credential));
  }

  const connectorSyncRuns = child.match(/^connectors\/([^/]+)\/sync-runs$/);
  if (connectorSyncRuns && req.method === "GET") {
    const connector = findConnector(store, workspaceId, connectorSyncRuns[1]);
    permissionGuard(membership, "connector.read");
    return ok(store.connector_sync_runs.filter((run) => run.workspace_id === workspaceId && run.connector_id === connector.connector_id));
  }

  const webhook = child.match(/^webhooks\/([^/]+)$/);
  if (webhook && req.method === "POST") {
    permissionGuard(membership, "webhook.receive");
    const endpoint = findWebhookEndpoint(store, workspaceId, webhook[1]);
    const signatureValid = getHeader(req, "x-webhook-signature") === "valid-signature";
    const eventLog = {
      webhook_event_log_id: nextId("webhook-event-log", store.webhook_event_logs),
      workspace_id: workspaceId,
      webhook_endpoint_id: endpoint.webhook_endpoint_id,
      endpoint_key: endpoint.endpoint_key,
      signature_valid: signatureValid,
      processing_status: signatureValid ? "accepted" : "rejected_invalid_signature",
      event_payload: clone(body),
      received_at: now()
    };
    store.webhook_event_logs.push(eventLog);
    audit(store, workspaceId, user, "webhook_event.received", "WebhookEventLog", eventLog.webhook_event_log_id, null, eventLog);
    return accepted({
      webhook_event_log_id: eventLog.webhook_event_log_id,
      signature_valid: eventLog.signature_valid,
      processing_status: eventLog.processing_status,
      received_at: eventLog.received_at
    });
  }

  const performanceEvents = child.match(/^campaigns\/([^/]+)\/performance-events$/);
  if (performanceEvents) {
    const campaign = findCampaign(store, workspaceId, performanceEvents[1]);
    if (req.method === "GET") {
      permissionGuard(membership, "performance.read");
      return ok(store.performance_events.filter((event) => event.workspace_id === workspaceId && event.campaign_id === campaign.campaign_id));
    }

    if (req.method === "POST") {
      permissionGuard(membership, "performance.event_create");
      rejectBodyWorkspaceId(body, workspaceId);
      requireFields(body, ["metric_name", "metric_value", "event_source", "observed_at"]);
      requireNonNegative(body.metric_value, "INVALID_METRIC_VALUE", "metric_value cannot be negative.");
      const event = {
        performance_event_id: nextId("performance-event", store.performance_events),
        workspace_id: workspaceId,
        campaign_id: campaign.campaign_id,
        publish_job_id: body.publish_job_id || null,
        tracked_link_id: body.tracked_link_id || null,
        media_asset_version_id: body.media_asset_version_id || null,
        metric_name: body.metric_name,
        metric_value: body.metric_value,
        event_source: body.event_source,
        source_ref: body.source_ref || null,
        observed_at: body.observed_at,
        ingested_at: now()
      };
      store.performance_events.push(event);
      audit(store, workspaceId, user, "performance_event.created", "PerformanceEvent", event.performance_event_id, null, event);
      return created(event);
    }
  }

  const metricSnapshots = child.match(/^campaigns\/([^/]+)\/metric-snapshots$/);
  if (metricSnapshots) {
    const campaign = findCampaign(store, workspaceId, metricSnapshots[1]);
    if (req.method === "GET") {
      permissionGuard(membership, "performance.read");
      const snapshots = store.campaign_metric_snapshots
        .filter((snapshot) => snapshot.workspace_id === workspaceId && snapshot.campaign_id === campaign.campaign_id)
        .map((snapshot) => attachConfidence(store, workspaceId, snapshot));
      return ok(snapshots);
    }

    if (req.method === "POST") {
      permissionGuard(membership, "performance.snapshot_create");
      rejectBodyWorkspaceId(body, workspaceId);
      requireFields(body, ["snapshot_period_start", "snapshot_period_end", "snapshot_payload", "confidence_score", "confidence_reason"]);
      requireConfidenceScore(body.confidence_score);
      validateReportPeriod(body.snapshot_period_start, body.snapshot_period_end);
      const snapshot = {
        campaign_metric_snapshot_id: nextId("metric-snapshot", store.campaign_metric_snapshots),
        workspace_id: workspaceId,
        campaign_id: campaign.campaign_id,
        snapshot_period_start: body.snapshot_period_start,
        snapshot_period_end: body.snapshot_period_end,
        snapshot_payload: clone(body.snapshot_payload),
        created_at: now()
      };
      const confidence = {
        metric_confidence_score_id: nextId("metric-confidence", store.metric_confidence_scores),
        workspace_id: workspaceId,
        campaign_metric_snapshot_id: snapshot.campaign_metric_snapshot_id,
        confidence_score: body.confidence_score,
        confidence_reason: clone(body.confidence_reason),
        created_at: now()
      };
      store.campaign_metric_snapshots.push(snapshot);
      store.metric_confidence_scores.push(confidence);
      audit(store, workspaceId, user, "campaign_metric_snapshot.created", "CampaignMetricSnapshot", snapshot.campaign_metric_snapshot_id, null, attachConfidence(store, workspaceId, snapshot));
      return created(attachConfidence(store, workspaceId, snapshot));
    }
  }

  if (child === "contacts") {
    if (req.method === "GET") {
      permissionGuard(membership, "contact.read");
      return ok(store.contacts.filter((contact) => contact.workspace_id === workspaceId));
    }

    if (req.method === "POST") {
      permissionGuard(membership, "contact.create");
      rejectBodyWorkspaceId(body, workspaceId);
      const identifiers = body.identifiers || [];
      if (!Array.isArray(identifiers)) {
        throw new AppError(422, "VALIDATION_FAILED", "identifiers must be an array.", "Send identifiers as an array.");
      }
      validateContactIdentifiers(store, workspaceId, identifiers);
      const contact = {
        contact_id: nextId("contact", store.contacts),
        workspace_id: workspaceId,
        display_name: body.display_name || null,
        contact_status: "active",
        created_at: now(),
        updated_at: now()
      };
      store.contacts.push(contact);
      for (const identifier of identifiers) {
        store.contact_identifiers.push({
          contact_identifier_id: nextId("contact-identifier", store.contact_identifiers),
          workspace_id: workspaceId,
          contact_id: contact.contact_id,
          identifier_type: identifier.identifier_type,
          identifier_value_hash: identifier.identifier_value_hash,
          identifier_label: identifier.identifier_label || null,
          created_at: now()
        });
      }
      audit(store, workspaceId, user, "contact.created", "Contact", contact.contact_id, null, contact);
      return created(contact);
    }
  }

  const contactConsents = child.match(/^contacts\/([^/]+)\/consents$/);
  if (contactConsents) {
    const contact = findContact(store, workspaceId, contactConsents[1]);
    if (req.method === "GET") {
      permissionGuard(membership, "contact.read");
      return ok(store.contact_consents.filter((consent) => consent.workspace_id === workspaceId && consent.contact_id === contact.contact_id));
    }

    if (req.method === "POST") {
      permissionGuard(membership, "contact.consent_update");
      rejectBodyWorkspaceId(body, workspaceId);
      requireFields(body, ["consent_type", "consent_status", "consent_source"]);
      requireOneOf(body.consent_status, consentStatuses, "VALIDATION_FAILED", "Consent status is invalid.");
      const consent = {
        contact_consent_id: nextId("contact-consent", store.contact_consents),
        workspace_id: workspaceId,
        contact_id: contact.contact_id,
        consent_type: body.consent_type,
        consent_status: body.consent_status,
        consent_source: body.consent_source,
        consent_evidence_ref: body.consent_evidence_ref || null,
        created_at: now()
      };
      store.contact_consents.push(consent);
      audit(store, workspaceId, user, "contact_consent.appended", "ContactConsent", consent.contact_consent_id, null, consent);
      return created(consent);
    }
  }

  const leadCaptures = child.match(/^campaigns\/([^/]+)\/lead-captures$/);
  if (leadCaptures) {
    const campaign = findCampaign(store, workspaceId, leadCaptures[1]);
    if (req.method === "GET") {
      permissionGuard(membership, "lead_capture.read");
      return ok(store.lead_captures.filter((lead) => lead.workspace_id === workspaceId && lead.campaign_id === campaign.campaign_id));
    }

    if (req.method === "POST") {
      permissionGuard(membership, "lead_capture.create");
      rejectBodyWorkspaceId(body, workspaceId);
      requireFields(body, ["captured_from", "source_payload"]);
      if (body.contact_id !== undefined && body.contact_id !== null) {
        findContact(store, workspaceId, body.contact_id);
      }
      if (body.attribution_confidence !== undefined) {
        requireConfidenceScore(body.attribution_confidence);
      }
      const leadCapture = {
        lead_capture_id: nextId("lead-capture", store.lead_captures),
        workspace_id: workspaceId,
        campaign_id: campaign.campaign_id,
        contact_id: body.contact_id || null,
        captured_from: body.captured_from,
        source_payload: clone(body.source_payload),
        attribution_source: body.attribution_source || null,
        attribution_confidence: body.attribution_confidence ?? null,
        created_at: now()
      };
      store.lead_captures.push(leadCapture);
      audit(store, workspaceId, user, "lead_capture.created", "LeadCapture", leadCapture.lead_capture_id, null, leadCapture);
      return created(leadCapture);
    }
  }

  if (child === "notification-rules") {
    if (req.method === "GET") {
      permissionGuard(membership, "notification_rule.read");
      return ok(store.notification_rules.filter((rule) => rule.workspace_id === workspaceId));
    }

    if (req.method === "POST") {
      permissionGuard(membership, "notification_rule.write");
      rejectBodyWorkspaceId(body, workspaceId);
      requireFields(body, ["rule_name", "trigger_event", "channel"]);
      requireOneOf(body.channel, notificationChannels, "VALIDATION_FAILED", "Notification channel is invalid.");
      const rule = {
        notification_rule_id: nextId("notification-rule", store.notification_rules),
        workspace_id: workspaceId,
        rule_name: body.rule_name,
        trigger_event: body.trigger_event,
        channel: body.channel,
        rule_status: body.rule_status || "active",
        created_at: now(),
        updated_at: now()
      };
      store.notification_rules.push(rule);
      audit(store, workspaceId, user, "notification_rule.created", "NotificationRule", rule.notification_rule_id, null, rule);
      return created(rule);
    }
  }

  if (child === "notification-deliveries" && req.method === "GET") {
    permissionGuard(membership, "notification_delivery.read");
    return ok(store.notification_deliveries.filter((delivery) => delivery.workspace_id === workspaceId));
  }

  throw notFound();
}

function routeSprint4(req, path, body, store) {
  const workspaceMatch = path.match(/^\/workspaces\/([^/]+)\/(.*)$/);
  if (!workspaceMatch) throw notFound();

  const workspaceId = workspaceContextGuard({ workspaceId: workspaceMatch[1] });
  const user = authGuard(req, store);
  const membership = membershipCheck(user, workspaceId, store);
  const child = workspaceMatch[2];

  const reports = child.match(/^campaigns\/([^/]+)\/client-report-snapshots$/);
  if (reports) {
    const campaign = findCampaign(store, workspaceId, reports[1]);

    if (req.method === "GET") {
      permissionGuard(membership, "report.read");
      return ok(store.clientReportSnapshots.filter((snapshot) => snapshot.workspace_id === workspaceId && snapshot.campaign_id === campaign.campaign_id));
    }

    if (req.method === "POST") {
      permissionGuard(membership, "report.generate");
      rejectBodyWorkspaceId(body, workspaceId);
      requireFields(body, ["report_template_id", "report_period_start", "report_period_end"]);
      validateReportPeriod(body.report_period_start, body.report_period_end);

      const reportTemplate = findReportTemplate(store, workspaceId, body.report_template_id);
      const workspace = findWorkspace(store, workspaceId);
      const generatedAt = now();
      const evidenceSnapshot = snapshotCampaignEvidence(store, workspaceId, campaign.campaign_id);
      const reportPayload = {
        campaign: clone(campaign),
        report_template: clone(reportTemplate),
        report_period_start: body.report_period_start,
        report_period_end: body.report_period_end,
        evidence_count: evidenceSnapshot.length,
        generated_at: generatedAt
      };
      const snapshot = {
        client_report_snapshot_id: nextId("client-report-snapshot", store.clientReportSnapshots),
        workspace_id: workspaceId,
        customer_account_id: workspace.customer_account_id,
        campaign_id: campaign.campaign_id,
        report_template_id: reportTemplate.report_template_id,
        report_period_start: body.report_period_start,
        report_period_end: body.report_period_end,
        report_snapshot_payload: clone(reportPayload),
        evidence_snapshot_payload: clone({ evidence: evidenceSnapshot }),
        generated_by_user_id: user.user_id,
        generated_at: generatedAt,
        content_hash: hash({ report_snapshot_payload: reportPayload, evidence_snapshot_payload: { evidence: evidenceSnapshot } })
      };

      store.clientReportSnapshots.push(snapshot);
      audit(store, workspaceId, user, "client_report_snapshot.generated", "ClientReportSnapshot", snapshot.client_report_snapshot_id, null, snapshot);
      return created(snapshot);
    }
  }

  if (child === "audit-logs" && req.method === "GET") {
    permissionGuard(membership, "audit.read");
    return ok(store.auditLogs.filter((log) => log.workspace_id === workspaceId));
  }

  if (child === "safe-mode") {
    if (req.method === "GET") {
      permissionGuard(membership, "operations.read");
      return okOne(getSafeModeState(store, workspaceId));
    }

    if (req.method === "POST") {
      permissionGuard(membership, "operations.safe_mode");
      rejectBodyWorkspaceId(body, workspaceId);
      requireFields(body, ["safe_mode_status"]);
      requireOneOf(body.safe_mode_status, safeModeStatuses, "INVALID_SAFE_MODE_STATE", "Safe mode state is invalid.");

      const state = getSafeModeState(store, workspaceId, true);
      const before = clone(state);
      state.safe_mode_status = body.safe_mode_status;
      state.reason = body.reason || null;
      if (body.safe_mode_status === "active") {
        state.activated_by_user_id = user.user_id;
        state.activated_at = now();
        state.deactivated_at = null;
      } else {
        state.deactivated_at = now();
      }
      state.updated_at = now();

      const action = body.safe_mode_status === "active" ? "safe_mode.activated" : "safe_mode.deactivated";
      audit(store, workspaceId, user, action, "SafeModeState", state.safe_mode_state_id, before, state);
      return okOne(state);
    }
  }

  if (child === "onboarding-progress") {
    if (req.method === "GET") {
      permissionGuard(membership, "onboarding.read");
      return okOne(getOnboardingProgress(store, workspaceId));
    }

    if (req.method === "PATCH") {
      permissionGuard(membership, "onboarding.write");
      rejectBodyWorkspaceId(body, workspaceId);
      if (body.onboarding_status !== undefined) {
        requireOneOf(body.onboarding_status, onboardingStatuses, "INVALID_ONBOARDING_STATE", "Onboarding status is invalid.");
      }

      const progress = getOnboardingProgress(store, workspaceId, true);
      const before = clone(progress);
      if (body.onboarding_status !== undefined) progress.onboarding_status = body.onboarding_status;
      if (body.current_step !== undefined) progress.current_step = body.current_step;
      if (body.progress_payload !== undefined) progress.progress_payload = clone(body.progress_payload);
      progress.completed_at = progress.onboarding_status === "completed" ? now() : null;
      progress.updated_at = now();

      audit(store, workspaceId, user, "onboarding.updated", "OnboardingProgress", progress.onboarding_progress_id, before, progress);
      return okOne(progress);
    }
  }

  throw notFound();
}

function isBrandPath(path) {
  return /^\/workspaces\/[^/]+\/brand-profiles(?:\/[^/]+\/rules)?$/.test(path);
}

function isSprint4Path(path) {
  return /^\/workspaces\/[^/]+\/(campaigns\/[^/]+\/client-report-snapshots|audit-logs|safe-mode|onboarding-progress)$/.test(path);
}

function isPatch002Path(path) {
  return /^\/workspaces\/[^/]+\/(connectors(?:\/[^/]+\/(?:accounts(?:\/[^/]+\/credentials)?|sync-runs))?|webhooks\/[^/]+|campaigns\/[^/]+\/(?:performance-events|metric-snapshots|lead-captures)|contacts(?:\/[^/]+\/consents)?|notification-rules|notification-deliveries)$/.test(path);
}

function snapshotCampaignEvidence(store, workspaceId, campaignId) {
  const publishJobIds = new Set(
    store.publishJobs
      .filter((job) => job.workspace_id === workspaceId && job.campaign_id === campaignId)
      .map((job) => job.publish_job_id)
  );
  return store.manualPublishEvidence
    .filter((evidence) => evidence.workspace_id === workspaceId && publishJobIds.has(evidence.publish_job_id))
    .map(clone);
}

function getSafeModeState(store, workspaceId, persist = false) {
  let state = store.safeModeStates.find((candidate) => candidate.workspace_id === workspaceId);
  if (!state) {
    state = {
      safe_mode_state_id: nextId("safe-mode", store.safeModeStates),
      workspace_id: workspaceId,
      safe_mode_status: "inactive",
      reason: null,
      activated_by_user_id: null,
      activated_at: null,
      deactivated_at: null,
      created_at: now(),
      updated_at: now()
    };
    if (persist) store.safeModeStates.push(state);
  }
  return state;
}

function getOnboardingProgress(store, workspaceId, persist = false) {
  const existing = store.onboardingProgress.filter((candidate) => candidate.workspace_id === workspaceId);
  if (existing.length > 1) {
    throw new AppError(409, "ONBOARDING_PROGRESS_CONFLICT", "Only one onboarding progress record is allowed per workspace.", "Resolve duplicate onboarding progress records.");
  }
  if (existing.length === 1) return existing[0];

  const progress = {
    onboarding_progress_id: nextId("onboarding-progress", store.onboardingProgress),
    workspace_id: workspaceId,
    onboarding_status: "not_started",
    current_step: "start",
    progress_payload: {},
    completed_at: null,
    updated_at: now()
  };
  if (persist) store.onboardingProgress.push(progress);
  return progress;
}

function findWorkspace(store, workspaceId) {
  const workspace = store.workspaces.find((candidate) => candidate.workspace_id === workspaceId);
  if (!workspace) throw new AppError(404, "NOT_FOUND", "Workspace was not found.", "Check the workspace ID.");
  return workspace;
}

function findCampaign(store, workspaceId, campaignId) {
  const campaign = store.campaigns.find((candidate) => candidate.workspace_id === workspaceId && candidate.campaign_id === campaignId);
  if (!campaign) throw new AppError(404, "CAMPAIGN_NOT_FOUND", "Campaign was not found in this workspace.", "Check the campaign and workspace IDs.");
  return campaign;
}

function findReportTemplate(store, workspaceId, reportTemplateId) {
  const template = store.reportTemplates.find((candidate) => candidate.workspace_id === workspaceId && candidate.report_template_id === reportTemplateId);
  if (!template) throw new AppError(404, "REPORT_TEMPLATE_NOT_FOUND", "ReportTemplate was not found in this workspace.", "Use a report template from the current workspace.");
  return template;
}

function findConnector(store, workspaceId, connectorId) {
  const connector = store.connectors.find((candidate) => candidate.workspace_id === workspaceId && candidate.connector_id === connectorId);
  if (!connector) throw new AppError(404, "CONNECTOR_NOT_FOUND", "Connector was not found in this workspace.", "Check the connector and workspace IDs.");
  return connector;
}

function findConnectorAccount(store, workspaceId, connectorId, connectorAccountId) {
  const account = store.connector_accounts.find(
    (candidate) => candidate.workspace_id === workspaceId && candidate.connector_id === connectorId && candidate.connector_account_id === connectorAccountId
  );
  if (!account) throw new AppError(404, "CONNECTOR_ACCOUNT_NOT_FOUND", "Connector account was not found in this workspace.", "Use a connector account from the current workspace.");
  return account;
}

function findWebhookEndpoint(store, workspaceId, endpointKey) {
  const endpoint = store.webhook_endpoints.find((candidate) => candidate.workspace_id === workspaceId && candidate.endpoint_key === endpointKey);
  if (!endpoint) throw new AppError(404, "WEBHOOK_ENDPOINT_NOT_FOUND", "Webhook endpoint was not found in this workspace.", "Use an endpoint key from the current workspace.");
  return endpoint;
}

function findContact(store, workspaceId, contactId) {
  const contact = store.contacts.find((candidate) => candidate.workspace_id === workspaceId && candidate.contact_id === contactId);
  if (!contact) throw new AppError(404, "CONTACT_NOT_FOUND", "Contact was not found in this workspace.", "Use a contact from the current workspace.");
  return contact;
}

function attachConfidence(store, workspaceId, snapshot) {
  const confidence = store.metric_confidence_scores.find(
    (score) => score.workspace_id === workspaceId && score.campaign_metric_snapshot_id === snapshot.campaign_metric_snapshot_id
  );
  return { ...clone(snapshot), metric_confidence_score: confidence ? clone(confidence) : null };
}

function validateContactIdentifiers(store, workspaceId, identifiers) {
  const seen = new Set();
  for (const identifier of identifiers) {
    requireFields(identifier, ["identifier_type", "identifier_value_hash"]);
    if (typeof identifier.identifier_value_hash !== "string" || identifier.identifier_value_hash.length !== 64) {
      throw new AppError(422, "VALIDATION_FAILED", "identifier_value_hash must be 64 characters.", "Send a hashed identifier value.");
    }
    const key = `${identifier.identifier_type}:${identifier.identifier_value_hash}`;
    if (seen.has(key) || store.contact_identifiers.some((candidate) => candidate.workspace_id === workspaceId && candidate.identifier_type === identifier.identifier_type && candidate.identifier_value_hash === identifier.identifier_value_hash)) {
      throw new AppError(409, "CONTACT_IDENTIFIER_EXISTS", "Contact identifier already exists in this workspace.", "Use a unique identifier hash in this workspace.");
    }
    seen.add(key);
  }
}

function rejectRawSecretFields(body) {
  const field = rawSecretFields.find((candidate) => Object.hasOwn(body, candidate));
  if (field) {
    throw new AppError(422, "RAW_SECRET_NOT_ALLOWED", `${field} is not accepted.`, "Send only secret_ref from an approved secret manager.");
  }
}

function requireOnlyFields(body, allowed) {
  const field = Object.keys(body).find((candidate) => !allowed.includes(candidate));
  if (field) {
    throw new AppError(422, "VALIDATION_FAILED", `${field} is not accepted for this request.`, "Use only fields approved by the OpenAPI contract.");
  }
}

function redactCredential(credential) {
  return {
    connector_credential_id: credential.connector_credential_id,
    credential_status: credential.credential_status
  };
}

function audit(store, workspaceId, user, action, entityType, entityId, before, after) {
  const workspace = findWorkspace(store, workspaceId);
  const isSprint4Action = action.startsWith("client_report") || action.startsWith("safe_mode") || action.startsWith("onboarding");
  const isBrandAction = action.startsWith("brand_");
  store.auditLogs.push({
    audit_log_id: nextId("audit", store.auditLogs),
    workspace_id: workspaceId,
    customer_account_id: workspace.customer_account_id,
    actor_user_id: user.user_id,
    action,
    entity_type: entityType,
    entity_id: entityId,
    before_snapshot: clone(before),
    after_snapshot: clone(after),
    metadata: { sprint: isSprint4Action ? 4 : isBrandAction ? "brand-slice-1-runtime-switch" : "patch-002" },
    correlation_id: isSprint4Action ? "sprint-4-placeholder" : isBrandAction ? "brand-slice-1-runtime-switch-placeholder" : "patch-002-placeholder",
    occurred_at: now()
  });
}

function validateReportPeriod(start, end) {
  const startTime = Date.parse(start);
  const endTime = Date.parse(end);
  if (!Number.isFinite(startTime) || !Number.isFinite(endTime) || endTime <= startTime) {
    throw new AppError(422, "INVALID_REPORT_PERIOD", "Report period end must be after report period start.", "Send a valid report period.");
  }
}

function requireFields(body, fields) {
  const missing = fields.filter((field) => body[field] === undefined || body[field] === null || body[field] === "");
  if (missing.length) throw new AppError(422, "VALIDATION_FAILED", `Missing required field(s): ${missing.join(", ")}.`, "Provide all required fields.");
}

function requireOneOf(value, allowed, code, message) {
  if (!allowed.includes(value)) throw new AppError(422, code, message, "Use an approved value.");
}

function requireNonNegative(value, code, message) {
  if (Number(value) < 0) throw new AppError(422, code, message, "Send a non-negative value.");
}

function requireConfidenceScore(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0 || number > 1) {
    throw new AppError(422, "INVALID_CONFIDENCE_SCORE", "Confidence score must be between 0 and 1.", "Send a confidence score in the 0..1 range.");
  }
}

function getHeader(req, name) {
  const lower = name.toLowerCase();
  const entry = Object.entries(req.headers).find(([key]) => key.toLowerCase() === lower);
  return entry ? entry[1] : undefined;
}

function ok(data) { return { body: { data } }; }
function okOne(data) { return { body: { data } }; }
function created(data) { return { status: 201, body: { data } }; }
function accepted(data) { return { status: 202, body: { data } }; }
function notFound() { return new AppError(404, "NOT_FOUND", "Route was not found.", "Use an endpoint from the OpenAPI contract."); }
function nextId(prefix, collection) { return `${prefix}-${collection.length + 1}`; }
function now() { return new Date().toISOString(); }
function clone(value) { return value === undefined ? undefined : JSON.parse(JSON.stringify(value)); }
function hash(value) { return createHash("sha256").update(stableStringify(value)).digest("hex"); }
function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  if (value && typeof value === "object") return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
  return JSON.stringify(value);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("error", reject);
    req.on("end", () => {
      const text = Buffer.concat(chunks).toString("utf8");
      if (!text) return resolve({});
      try { resolve(JSON.parse(text)); }
      catch { reject(new AppError(422, "VALIDATION_FAILED", "Request body must be valid JSON.", "Send a valid JSON body.")); }
    });
  });
}

module.exports = { createApp, implementedRoutes };
