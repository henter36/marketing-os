const assert = require("node:assert/strict");
const test = require("node:test");
const { implementedRoutes } = require("../../src/router");
const { createTestServer } = require("../helpers");

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

const identifierHash = "9".repeat(64);
const metricSnapshotBody = {
  snapshot_period_start: "2026-04-01T00:00:00.000Z",
  snapshot_period_end: "2026-05-01T00:00:00.000Z",
  snapshot_payload: { clicks: 42 },
  confidence_score: 0.75,
  confidence_reason: { source: "manual" }
};

function assertErrorModel(response) {
  assert.equal(typeof response.body.code, "string");
  assert.equal(typeof response.body.message, "string");
  assert.equal(typeof response.body.user_action, "string");
  assert.equal(typeof response.body.correlation_id, "string");
}

test("Patch 002 implemented routes stay inside the approved OpenAPI surface", () => {
  for (const route of patch002Routes) {
    assert.ok(implementedRoutes.includes(route), `${route} should be implemented`);
  }
});

test("Connector registry and accounts enforce tenant isolation and RBAC", async () => {
  const server = await createTestServer();
  try {
    const list = await server.request("GET", "/workspaces/workspace-a/connectors", { userId: "user-viewer-a" });
    assert.equal(list.status, 200);
    assert.ok(list.body.data.every((connector) => connector.workspace_id === "workspace-a"));
    assert.equal(list.body.data.some((connector) => connector.connector_id === "connector-b"), false);

    const reviewerDenied = await server.request("POST", "/workspaces/workspace-a/connectors", {
      userId: "user-reviewer-a",
      body: { connector_key: "reviewer-denied", connector_name: "Denied", connector_type: "generic" }
    });
    assert.equal(reviewerDenied.status, 403);
    assertErrorModel(reviewerDenied);

    const created = await server.request("POST", "/workspaces/workspace-a/connectors", {
      userId: "user-admin-a",
      body: { connector_key: "runtime-connector", connector_name: "Runtime Connector", connector_type: "generic" }
    });
    assert.equal(created.status, 201);
    assert.equal(created.body.data.workspace_id, "workspace-a");
    assert.equal(server.store.auditLogs.at(-1).action, "connector.created");

    const accounts = await server.request("GET", "/workspaces/workspace-a/connectors/connector-a/accounts", { userId: "user-viewer-a" });
    assert.equal(accounts.status, 200);
    assert.ok(accounts.body.data.every((account) => account.workspace_id === "workspace-a"));

    const accountDenied = await server.request("POST", "/workspaces/workspace-a/connectors/connector-a/accounts", {
      userId: "user-viewer-a",
      body: { account_label: "Denied" }
    });
    assert.equal(accountDenied.status, 403);

    const account = await server.request("POST", "/workspaces/workspace-a/connectors/connector-a/accounts", {
      userId: "user-admin-a",
      body: { account_label: "Runtime Account", external_account_ref: "runtime-account" }
    });
    assert.equal(account.status, 201);
    assert.equal(account.body.data.connector_id, "connector-a");
    assert.equal(server.store.auditLogs.at(-1).action, "connector_account.created");

    const crossWorkspaceConnector = await server.request("GET", "/workspaces/workspace-a/connectors/connector-b/accounts", { userId: "user-viewer-a" });
    assert.equal(crossWorkspaceConnector.status, 404);
    assert.equal(crossWorkspaceConnector.body.code, "CONNECTOR_NOT_FOUND");
  } finally {
    server.close();
  }
});

test("Connector credentials require secret rotation permission and never store or echo raw secrets", async () => {
  const server = await createTestServer();
  try {
    const denied = await server.request("POST", "/workspaces/workspace-a/connectors/connector-a/accounts/connector-account-a/credentials", {
      userId: "user-creator-a",
      body: { secret_ref: "secret://workspace-a/new" }
    });
    assert.equal(denied.status, 403);

    for (const field of ["raw_secret", "api_key", "token", "password", "refresh_token", "signing_secret"]) {
      const raw = await server.request("POST", "/workspaces/workspace-a/connectors/connector-a/accounts/connector-account-a/credentials", {
        userId: "user-admin-a",
        body: { secret_ref: "secret://workspace-a/new", [field]: "must-not-store" }
      });
      assert.equal(raw.status, 422);
      assert.equal(raw.body.code, "RAW_SECRET_NOT_ALLOWED");
    }

    const created = await server.request("POST", "/workspaces/workspace-a/connectors/connector-a/accounts/connector-account-a/credentials", {
      userId: "user-admin-a",
      body: { secret_ref: "secret://workspace-a/connector-account-a/rotated" }
    });
    assert.equal(created.status, 201);
    assert.equal(created.body.data.credential_status, "active");
    assert.equal(Object.hasOwn(created.body.data, "secret_ref"), false);
    assert.equal(Object.values(created.body.data).includes("secret://workspace-a/connector-account-a/rotated"), false);
    assert.ok(server.store.connector_credentials.some((credential) => credential.secret_ref === "secret://workspace-a/connector-account-a/rotated"));
    assert.equal(JSON.stringify(server.store.connector_credentials).includes("must-not-store"), false);
    assert.equal(server.store.auditLogs.at(-1).action, "connector_credential.created");

    const crossWorkspaceAccount = await server.request("POST", "/workspaces/workspace-a/connectors/connector-a/accounts/connector-account-b/credentials", {
      userId: "user-admin-a",
      body: { secret_ref: "secret://workspace-a/wrong" }
    });
    assert.equal(crossWorkspaceAccount.status, 404);
  } finally {
    server.close();
  }
});

test("Connector sync-runs are read-only metadata/history with tenant isolation", async () => {
  const server = await createTestServer();
  try {
    const list = await server.request("GET", "/workspaces/workspace-a/connectors/connector-a/sync-runs", { userId: "user-viewer-a" });
    assert.equal(list.status, 200);
    assert.ok(list.body.data.every((run) => run.workspace_id === "workspace-a"));
    assert.equal(list.body.data[0].sync_mode, "metadata_history_only");

    const reviewerDenied = await server.request("GET", "/workspaces/workspace-a/connectors/connector-a/sync-runs", { userId: "user-reviewer-a" });
    assert.equal(reviewerDenied.status, 403);

    const noExecutionRoute = await server.request("POST", "/workspaces/workspace-a/connectors/connector-a/sync-runs", {
      userId: "user-admin-a",
      body: { sync_now: true }
    });
    assert.equal(noExecutionRoute.status, 404);

    const crossTenant = await server.request("GET", "/workspaces/workspace-a/connectors/connector-b/sync-runs", { userId: "user-viewer-a" });
    assert.equal(crossTenant.status, 404);
  } finally {
    server.close();
  }
});

test("Webhook receive logs valid and invalid signatures without business-state mutation", async () => {
  const server = await createTestServer();
  try {
    const before = {
      contacts: server.store.contacts.length,
      performance: server.store.performance_events.length,
      notifications: server.store.notification_deliveries.length,
      accounts: server.store.connector_accounts.length
    };

    const valid = await server.request("POST", "/workspaces/workspace-a/webhooks/endpoint-a", {
      userId: "user-owner-a",
      headers: { "x-webhook-signature": "valid-signature" },
      body: { event: "ping" }
    });
    assert.equal(valid.status, 202);
    assert.equal(valid.body.data.signature_valid, true);

    const invalid = await server.request("POST", "/workspaces/workspace-a/webhooks/endpoint-a", {
      userId: "user-owner-a",
      headers: { "x-webhook-signature": "bad-signature" },
      body: { event: "mutate-attempt", contact_id: "contact-a" }
    });
    assert.equal(invalid.status, 202);
    assert.equal(invalid.body.data.signature_valid, false);
    assert.equal(invalid.body.data.processing_status, "rejected_invalid_signature");
    assert.equal(server.store.webhook_event_logs.length, 2);
    assert.equal(server.store.contacts.length, before.contacts);
    assert.equal(server.store.performance_events.length, before.performance);
    assert.equal(server.store.notification_deliveries.length, before.notifications);
    assert.equal(server.store.connector_accounts.length, before.accounts);
    assert.ok(server.store.auditLogs.some((log) => log.action === "webhook_event.received"));

    const denied = await server.request("POST", "/workspaces/workspace-a/webhooks/endpoint-a", {
      userId: "user-admin-a",
      headers: { "x-webhook-signature": "valid-signature" },
      body: { event: "denied" }
    });
    assert.equal(denied.status, 403);

    const crossTenant = await server.request("POST", "/workspaces/workspace-a/webhooks/endpoint-b", {
      userId: "user-owner-a",
      headers: { "x-webhook-signature": "valid-signature" },
      body: { event: "wrong-endpoint" }
    });
    assert.equal(crossTenant.status, 404);

    const patchLog = await server.request("PATCH", "/workspaces/workspace-a/webhooks/endpoint-a", {
      userId: "user-owner-a",
      body: { event: "mutate" }
    });
    assert.equal(patchLog.status, 404);
  } finally {
    server.close();
  }
});

test("Performance events and metric snapshots enforce tenant scope, append-only behavior, and bounds", async () => {
  const server = await createTestServer();
  try {
    const list = await server.request("GET", "/workspaces/workspace-a/campaigns/campaign-a/performance-events", { userId: "user-viewer-a" });
    assert.equal(list.status, 200);
    assert.ok(list.body.data.every((event) => event.workspace_id === "workspace-a"));

    const negative = await server.request("POST", "/workspaces/workspace-a/campaigns/campaign-a/performance-events", {
      userId: "user-creator-a",
      body: { metric_name: "clicks", metric_value: -1, event_source: "manual", observed_at: "2026-04-27T00:00:00.000Z" }
    });
    assert.equal(negative.status, 422);
    assert.equal(negative.body.code, "INVALID_METRIC_VALUE");

    const event = await server.request("POST", "/workspaces/workspace-a/campaigns/campaign-a/performance-events", {
      userId: "user-creator-a",
      body: { metric_name: "clicks", metric_value: 12, event_source: "manual", observed_at: "2026-04-27T00:00:00.000Z" }
    });
    assert.equal(event.status, 201);
    assert.equal(server.store.auditLogs.at(-1).action, "performance_event.created");

    const crossCampaign = await server.request("GET", "/workspaces/workspace-a/campaigns/campaign-b/performance-events", { userId: "user-viewer-a" });
    assert.equal(crossCampaign.status, 404);

    const badConfidence = await server.request("POST", "/workspaces/workspace-a/campaigns/campaign-a/metric-snapshots", {
      userId: "user-creator-a",
      body: { ...metricSnapshotBody, confidence_score: 1.5 }
    });
    assert.equal(badConfidence.status, 422);
    assert.equal(badConfidence.body.code, "INVALID_CONFIDENCE_SCORE");

    const snapshot = await server.request("POST", "/workspaces/workspace-a/campaigns/campaign-a/metric-snapshots", {
      userId: "user-creator-a",
      body: metricSnapshotBody
    });
    assert.equal(snapshot.status, 201);
    assert.equal(snapshot.body.data.metric_confidence_score.confidence_score, 0.75);
    assert.equal(server.store.auditLogs.at(-1).action, "campaign_metric_snapshot.created");

    const patchSnapshot = await server.request("PATCH", `/workspaces/workspace-a/campaigns/campaign-a/metric-snapshots/${snapshot.body.data.campaign_metric_snapshot_id}`, {
      userId: "user-creator-a",
      body: { snapshot_payload: { clicks: 99 } }
    });
    assert.equal(patchSnapshot.status, 404);

    const deleteSnapshot = await server.request("DELETE", `/workspaces/workspace-a/campaigns/campaign-a/metric-snapshots/${snapshot.body.data.campaign_metric_snapshot_id}`, {
      userId: "user-creator-a"
    });
    assert.equal(deleteSnapshot.status, 404);
  } finally {
    server.close();
  }
});

test("CRM-lite contacts, identifiers, consents, and lead captures enforce tenant boundaries", async () => {
  const server = await createTestServer();
  try {
    const contacts = await server.request("GET", "/workspaces/workspace-a/contacts", { userId: "user-viewer-a" });
    assert.equal(contacts.status, 200);
    assert.ok(contacts.body.data.every((contact) => contact.workspace_id === "workspace-a"));

    const created = await server.request("POST", "/workspaces/workspace-a/contacts", {
      userId: "user-creator-a",
      body: { display_name: "Runtime Contact", identifiers: [{ identifier_type: "email_hash", identifier_value_hash: identifierHash }] }
    });
    assert.equal(created.status, 201);
    assert.equal(server.store.auditLogs.at(-1).action, "contact.created");

    const duplicate = await server.request("POST", "/workspaces/workspace-a/contacts", {
      userId: "user-creator-a",
      body: { display_name: "Duplicate", identifiers: [{ identifier_type: "email_hash", identifier_value_hash: identifierHash }] }
    });
    assert.equal(duplicate.status, 409);
    assert.equal(duplicate.body.code, "CONTACT_IDENTIFIER_EXISTS");

    const duplicateOtherWorkspace = await server.request("POST", "/workspaces/workspace-b/contacts", {
      userId: "user-owner-a",
      body: { display_name: "Other Workspace", identifiers: [{ identifier_type: "email_hash", identifier_value_hash: identifierHash }] }
    });
    assert.equal(duplicateOtherWorkspace.status, 201);

    const consents = await server.request("GET", "/workspaces/workspace-a/contacts/contact-a/consents", { userId: "user-viewer-a" });
    assert.equal(consents.status, 200);
    const beforeConsentCount = consents.body.data.length;

    const consent = await server.request("POST", "/workspaces/workspace-a/contacts/contact-a/consents", {
      userId: "user-creator-a",
      body: { consent_type: "email_marketing", consent_status: "revoked", consent_source: "manual" }
    });
    assert.equal(consent.status, 201);
    assert.equal(server.store.auditLogs.at(-1).action, "contact_consent.appended");
    const afterConsents = await server.request("GET", "/workspaces/workspace-a/contacts/contact-a/consents", { userId: "user-viewer-a" });
    assert.equal(afterConsents.body.data.length, beforeConsentCount + 1);

    const patchConsent = await server.request("PATCH", `/workspaces/workspace-a/contacts/contact-a/consents/${consent.body.data.contact_consent_id}`, {
      userId: "user-creator-a",
      body: { consent_status: "granted" }
    });
    assert.equal(patchConsent.status, 404);

    const lead = await server.request("POST", "/workspaces/workspace-a/campaigns/campaign-a/lead-captures", {
      userId: "user-creator-a",
      body: { contact_id: "contact-a", captured_from: "form", source_payload: { form: "demo" }, attribution_confidence: 0.6 }
    });
    assert.equal(lead.status, 201);
    assert.equal(server.store.auditLogs.at(-1).action, "lead_capture.created");

    const crossWorkspaceCampaign = await server.request("POST", "/workspaces/workspace-a/campaigns/campaign-b/lead-captures", {
      userId: "user-creator-a",
      body: { captured_from: "form", source_payload: {} }
    });
    assert.equal(crossWorkspaceCampaign.status, 404);

    const crossWorkspaceContact = await server.request("POST", "/workspaces/workspace-a/campaigns/campaign-a/lead-captures", {
      userId: "user-creator-a",
      body: { contact_id: "contact-b", captured_from: "form", source_payload: {} }
    });
    assert.equal(crossWorkspaceContact.status, 404);
  } finally {
    server.close();
  }
});

test("Notification rules and deliveries are scoped metadata without provider execution", async () => {
  const server = await createTestServer();
  try {
    const rules = await server.request("GET", "/workspaces/workspace-a/notification-rules", { userId: "user-viewer-a" });
    assert.equal(rules.status, 200);
    assert.ok(rules.body.data.every((rule) => rule.workspace_id === "workspace-a"));
    assert.ok(rules.body.data.some((rule) => rule.rule_status === "disabled"));

    const denied = await server.request("POST", "/workspaces/workspace-a/notification-rules", {
      userId: "user-creator-a",
      body: { rule_name: "Denied", trigger_event: "contact.created", channel: "in_app" }
    });
    assert.equal(denied.status, 403);

    const beforeDeliveries = server.store.notification_deliveries.length;
    const rule = await server.request("POST", "/workspaces/workspace-a/notification-rules", {
      userId: "user-admin-a",
      body: { rule_name: "Runtime Rule", trigger_event: "contact.created", channel: "in_app" }
    });
    assert.equal(rule.status, 201);
    assert.equal(server.store.auditLogs.at(-1).action, "notification_rule.created");
    assert.equal(server.store.notification_deliveries.length, beforeDeliveries);

    const deliveries = await server.request("GET", "/workspaces/workspace-a/notification-deliveries", { userId: "user-viewer-a" });
    assert.equal(deliveries.status, 200);
    assert.ok(deliveries.body.data.every((delivery) => delivery.workspace_id === "workspace-a"));
    assert.ok(deliveries.body.data.some((delivery) => delivery.delivery_status === "failed"));

    const sourceLead = server.store.lead_captures.find((lead) => lead.lead_capture_id === "lead-capture-a");
    assert.equal(sourceLead.captured_from, "manual_seed");

    const noProviderExecution = await server.request("POST", "/workspaces/workspace-a/notification-deliveries", {
      userId: "user-admin-a",
      body: { provider: "email" }
    });
    assert.equal(noProviderExecution.status, 404);
  } finally {
    server.close();
  }
});

test("Patch 002 validation errors use ErrorModel and migration activation remains absent", async () => {
  const server = await createTestServer();
  try {
    const response = await server.request("POST", "/workspaces/workspace-a/campaigns/campaign-a/performance-events", {
      userId: "user-creator-a",
      body: {}
    });
    assert.equal(response.status, 422);
    assertErrorModel(response);
    assert.equal(Object.hasOwn(server.store, "billingProviders"), false);
    assert.equal(Object.hasOwn(server.store, "providerUsageLogs"), false);
  } finally {
    server.close();
  }
});
