const permissionsByRole = {
  admin: ['*'],
  creator: ['workspace.read','campaign.read','campaign.write','brief.read','brief.write','media_job.read','media_job.create','media_asset.read','media_asset.create','media_asset.version_create','usage.read','cost.read'],
  reviewer: ['workspace.read','campaign.read','brief.read','media_job.read','media_asset.read','review.read','review.assign','approval.decide','audit.read'],
  publisher: ['workspace.read','campaign.read','brief.read','media_asset.read','approval.read','publish_job.create','manual_evidence.read','manual_evidence.submit','manual_evidence.invalidate','tracked_link.read','tracked_link.create','report.read','report.generate'],
  viewer: ['workspace.read','campaign.read','brief.read','media_job.read','media_asset.read','review.read','manual_evidence.read','report.read','usage.read','cost.read','audit.read']
};

const pages = [
  { id: 'dashboard', title: 'Dashboard', permission: 'workspace.read' },
  { id: 'workspaces', title: 'Workspaces', permission: 'workspace.read' },
  { id: 'members', title: 'Members & RBAC', permission: 'workspace.manage_members' },
  { id: 'campaigns', title: 'Campaigns', permission: 'campaign.read' },
  { id: 'briefs', title: 'Brief Versions', permission: 'brief.read' },
  { id: 'media-jobs', title: 'Media Jobs', permission: 'media_job.read' },
  { id: 'assets', title: 'Assets & Versions', permission: 'media_asset.read' },
  { id: 'review', title: 'Review Tasks', permission: 'review.read' },
  { id: 'approval', title: 'Approval Decisions', permission: 'approval.decide' },
  { id: 'publish', title: 'Publish Jobs', permission: 'publish_job.create' },
  { id: 'evidence', title: 'Manual Evidence', permission: 'manual_evidence.read' },
  { id: 'reports', title: 'Report Snapshots', permission: 'report.read' },
  { id: 'usage-cost', title: 'Usage & Cost', permission: 'usage.read' },
  { id: 'audit', title: 'Audit Log', permission: 'audit.read' },
  { id: 'operations', title: 'Safe Mode & Onboarding', permission: 'safe_mode.manage' }
];

let currentPage = 'dashboard';
let currentRole = 'admin';
let currentWorkspace = 'ws-alpha';

const data = {
  campaigns: [
    { id: 'cmp-101', name: 'Ramadan Acquisition Campaign', status: 'active', objective: 'Lead generation', owner: 'Creator' },
    { id: 'cmp-102', name: 'Retention Content Sprint', status: 'draft', objective: 'Retention', owner: 'Creator' }
  ],
  briefs: [
    { id: 'brf-v3', campaign: 'Ramadan Acquisition Campaign', version: 3, status: 'locked', hash: 'd4f9...a21c' },
    { id: 'brf-v1', campaign: 'Retention Content Sprint', version: 1, status: 'draft', hash: 'a81b...9c44' }
  ],
  mediaJobs: [
    { id: 'mj-3001', type: 'image', status: 'succeeded', cost: 'approved', output: 'usable_output_confirmed=true' },
    { id: 'mj-3002', type: 'video_script', status: 'failed', cost: 'approved', output: 'no commercial usage' }
  ],
  assets: [
    { id: 'asset-91', version: 'v2', status: 'in_review', hash: '8bc2...41de', type: 'image' },
    { id: 'asset-92', version: 'v1', status: 'approved', hash: 'fd13...81aa', type: 'text' }
  ],
  evidence: [
    { id: 'evd-700', status: 'valid', url: 'manual-post-url', hash: 'fd13...81aa' },
    { id: 'evd-699', status: 'superseded', url: 'old-manual-post-url', hash: 'fd13...81aa' }
  ]
};

function hasPermission(permission) {
  const allowed = permissionsByRole[currentRole] || [];
  return allowed.includes('*') || allowed.includes(permission);
}

function guardButton(label, permission, action, style = 'primary-btn') {
  const allowed = hasPermission(permission);
  return `<button class="${style} ${allowed ? '' : 'disabled'}" ${allowed ? `onclick="${action}"` : `onclick="showPermissionError('${permission}')"`}>${label}</button>`;
}

function pill(value) {
  const normalized = String(value).toLowerCase();
  let cls = 'neutral';
  if (['active','approved','succeeded','valid','locked'].includes(normalized)) cls = 'ok';
  if (['draft','queued','in_review','requires_review','superseded'].includes(normalized)) cls = 'warn';
  if (['failed','invalidated','rejected','blocked'].includes(normalized)) cls = 'danger';
  return `<span class="pill ${cls}">${value}</span>`;
}

function renderNav() {
  const nav = document.getElementById('nav');
  nav.innerHTML = pages.map(p => `<button class="nav-item ${p.id === currentPage ? 'active' : ''}" onclick="go('${p.id}')">${p.title}</button>`).join('');
}

function go(pageId) {
  currentPage = pageId;
  render();
}

function showAlert(title, message, type = '') {
  document.getElementById('alertHost').innerHTML = `<div class="alert ${type}"><strong>${title}</strong><div>${message}</div></div>`;
}

function clearAlert() { document.getElementById('alertHost').innerHTML = ''; }

function showPermissionError(permission) {
  showAlert('PERMISSION_DENIED', `Current role (${currentRole}) does not have required permission: ${permission}. user_action: request access or switch to an authorized role. correlation_id: proto-${Date.now()}`, 'danger');
}

function simulateError() {
  showAlert('TENANT_CONTEXT_MISMATCH', `The request attempted to access a record outside ${currentWorkspace}. user_action: reload workspace context and retry. correlation_id: proto-${Date.now()}`, 'danger');
}

function renderDashboard() {
  return `
    <div class="grid cols-3">
      <div class="card"><h3>Active Campaigns</h3><div class="metric">2</div><p class="muted">Workspace-scoped; no cross-tenant reads.</p></div>
      <div class="card"><h3>Pending Reviews</h3><div class="metric">4</div><p class="muted">ReviewTask before ApprovalDecision.</p></div>
      <div class="card"><h3>Manual Evidence</h3><div class="metric">7</div><p class="muted">No PATCH/DELETE; supersede or invalidate only.</p></div>
    </div>
    <div class="card">
      <h2>Core Phase 0/1 Flow</h2>
      <div class="workflow">
        <div class="step active"><strong>1. Campaign</strong><p>Create governed campaign.</p></div>
        <div class="step active"><strong>2. Brief Version</strong><p>Immutable version + content hash.</p></div>
        <div class="step active"><strong>3. Media Job</strong><p>Cost snapshot + idempotency.</p></div>
        <div class="step active"><strong>4. Review / Approval</strong><p>Hash-validated decision.</p></div>
        <div class="step blocked"><strong>5. Manual Publish</strong><p>No auto-publishing in Phase 0/1.</p></div>
      </div>
    </div>
  `;
}

function renderWorkspaces() {
  return `
    <div class="card">
      <h2>Workspace Context</h2>
      <p class="muted">The prototype intentionally models workspaceId as route/context. It must not be trusted from request body.</p>
      <div class="form-grid">
        <div class="field"><label>Workspace Name</label><input value="Acme Growth Workspace" /></div>
        <div class="field"><label>Timezone</label><input value="Asia/Riyadh" /></div>
      </div>
      <div class="action-row">${guardButton('Create Workspace', 'workspace.create', "showAlert('workspace.created','Workspace created and AuditLog recorded.')")}</div>
    </div>
  `;
}

function renderMembers() {
  return `
    <div class="card">
      <h2>Members & RBAC</h2>
      <div class="table-wrap"><table><thead><tr><th>User</th><th>Role</th><th>Status</th><th>Allowed Action</th></tr></thead><tbody>
        <tr><td>admin@example.com</td><td>Workspace Admin</td><td>${pill('active')}</td><td>Manage roles</td></tr>
        <tr><td>creator@example.com</td><td>Creator</td><td>${pill('active')}</td><td>Create campaigns and media jobs</td></tr>
        <tr><td>reviewer@example.com</td><td>Reviewer</td><td>${pill('active')}</td><td>Review and decide</td></tr>
      </tbody></table></div>
      <div class="action-row">${guardButton('Invite Member', 'workspace.manage_members', "showAlert('member.invited','Invitation created and member.invited audit event recorded.')")}</div>
    </div>
  `;
}

function renderCampaigns() {
  return `
    <div class="card">
      <h2>Campaigns</h2>
      <div class="table-wrap"><table><thead><tr><th>Name</th><th>Objective</th><th>Status</th><th>Owner</th></tr></thead><tbody>
        ${data.campaigns.map(c => `<tr><td>${c.name}</td><td>${c.objective}</td><td>${pill(c.status)}</td><td>${c.owner}</td></tr>`).join('')}
      </tbody></table></div>
      <div class="action-row">${guardButton('Create Campaign', 'campaign.write', "showAlert('campaign.created','Campaign created under workspace context only.')")}${guardButton('Change State', 'campaign.write', "showAlert('campaign.status_changed','CampaignStateTransition created; old state preserved.')", 'ghost-btn')}</div>
    </div>
  `;
}

function renderBriefs() {
  return `
    <div class="card">
      <h2>Brief Versions</h2>
      <p class="muted">Brief content is protected by versioning. Content changes create a new BriefVersion; historical content is not patched.</p>
      <div class="table-wrap"><table><thead><tr><th>ID</th><th>Campaign</th><th>Version</th><th>Status</th><th>Hash</th></tr></thead><tbody>
        ${data.briefs.map(b => `<tr><td>${b.id}</td><td>${b.campaign}</td><td>${b.version}</td><td>${pill(b.status)}</td><td>${b.hash}</td></tr>`).join('')}
      </tbody></table></div>
      <div class="action-row">${guardButton('Create Brief Version', 'brief.write', "showAlert('brief.version_created','New immutable BriefVersion created with server-side content_hash.')")}</div>
    </div>
  `;
}

function renderMediaJobs() {
  return `
    <div class="card">
      <h2>Media Jobs</h2>
      <p class="muted">MediaJob requires Idempotency-Key and approved MediaCostSnapshot before running or succeeding.</p>
      <div class="table-wrap"><table><thead><tr><th>ID</th><th>Type</th><th>Status</th><th>Cost Check</th><th>Usage Result</th></tr></thead><tbody>
        ${data.mediaJobs.map(j => `<tr><td>${j.id}</td><td>${j.type}</td><td>${pill(j.status)}</td><td>${pill(j.cost)}</td><td>${j.output}</td></tr>`).join('')}
      </tbody></table></div>
      <div class="action-row">${guardButton('Create Media Job', 'media_job.create', "showAlert('media_job.created','Accepted with approved cost snapshot and idempotency key.')")}${guardButton('Mark Failed', 'media_job.update_status', "showAlert('media_job.failed','Failed job recorded; no commercial UsageMeter entry created.')", 'ghost-btn')}</div>
    </div>
  `;
}

function renderAssets() {
  return `
    <div class="card">
      <h2>Assets & Versions</h2>
      <p class="muted">Approved MediaAssetVersion cannot be patched. Any content change must create a new version.</p>
      <div class="table-wrap"><table><thead><tr><th>Asset</th><th>Version</th><th>Type</th><th>Status</th><th>Content Hash</th></tr></thead><tbody>
        ${data.assets.map(a => `<tr><td>${a.id}</td><td>${a.version}</td><td>${a.type}</td><td>${pill(a.status)}</td><td>${a.hash}</td></tr>`).join('')}
      </tbody></table></div>
      <div class="action-row">${guardButton('Create Asset Version', 'media_asset.version_create', "showAlert('media_asset.version_created','New version created; previous approved version remains immutable.')")}${guardButton('Patch Approved Version', 'media_asset.version_create', "showAlert('IMMUTABLE_FIELD_UPDATE','Approved MediaAssetVersion cannot be patched; create a new version instead.','danger')", 'danger-btn')}</div>
    </div>
  `;
}

function renderReview() {
  return `
    <div class="grid cols-2">
      <div class="card"><h2>Review Task</h2><div class="form-grid"><div class="field"><label>Asset Version</label><input value="asset-91 / v2" /></div><div class="field"><label>Review Type</label><select><option>brand</option><option>legal</option><option>quality</option><option>final</option></select></div></div><div class="action-row">${guardButton('Assign Review', 'review.assign', "showAlert('review_task.created','ReviewTask created for exact MediaAssetVersion.')")}</div></div>
      <div class="card"><h2>Control Point</h2><p>ReviewTask.media_asset_version_id must match ApprovalDecision.media_asset_version_id. Mismatch must fail.</p><pre class="code">APPROVAL_HASH_MISMATCH\nASSET_VERSION_MISMATCH</pre></div>
    </div>
  `;
}

function renderApproval() {
  return `
    <div class="card">
      <h2>Approval Decision</h2>
      <p class="muted">ApprovalDecision is append-only. A valid approved decision updates MediaAssetVersion.status to approved through the DB trigger.</p>
      <div class="form-grid"><div class="field"><label>Decision</label><select><option>approved</option><option>rejected</option><option>changes_requested</option></select></div><div class="field"><label>approved_content_hash</label><input value="8bc2...41de" /></div><div class="field"><label>Decision Reason</label><textarea>Meets brand and quality requirements.</textarea></div></div>
      <div class="action-row">${guardButton('Create ApprovalDecision', 'approval.decide', "showAlert('approval_decision.created','Decision inserted; matching hash approves MediaAssetVersion through trigger.')")}${guardButton('Approve With Wrong Hash', 'approval.decide', "showAlert('APPROVAL_HASH_MISMATCH','approved_content_hash does not match MediaAssetVersion.content_hash.','danger')", 'danger-btn')}</div>
    </div>
  `;
}

function renderPublish() {
  return `
    <div class="card">
      <h2>Publish Jobs</h2>
      <p class="muted">Phase 0/1 creates governed PublishJob records only. It does not auto-publish to external channels.</p>
      <div class="workflow"><div class="step active">Approved Decision</div><div class="step active">Create PublishJob</div><div class="step blocked">Manual Channel Action</div><div class="step active">Submit Evidence</div><div class="step active">Report Snapshot</div></div>
      <div class="action-row">${guardButton('Create PublishJob', 'publish_job.create', "showAlert('publish_job.created','PublishJob created from approved ApprovalDecision with idempotency key.')")}${guardButton('Auto Publish', 'publish_job.create', "showAlert('SAFE_MODE_ACTIVE','Auto-publishing is forbidden in Phase 0/1.','danger')", 'danger-btn')}</div>
    </div>
  `;
}

function renderEvidence() {
  return `
    <div class="card">
      <h2>Manual Publish Evidence</h2>
      <p class="muted">Evidence proof fields are immutable. Supersede creates a new row; invalidate only changes evidence_status and invalidated_reason.</p>
      <div class="table-wrap"><table><thead><tr><th>ID</th><th>Status</th><th>Published URL</th><th>Content Hash</th></tr></thead><tbody>
        ${data.evidence.map(e => `<tr><td>${e.id}</td><td>${pill(e.status)}</td><td>${e.url}</td><td>${e.hash}</td></tr>`).join('')}
      </tbody></table></div>
      <div class="action-row">${guardButton('Submit Evidence', 'manual_evidence.submit', "showAlert('manual_publish_evidence.submitted','Evidence submitted; proof fields locked.')")}${guardButton('Supersede Evidence', 'manual_evidence.submit', "showAlert('manual_publish_evidence.superseded','New evidence row created with supersedes_evidence_id.')", 'ghost-btn')}${guardButton('Invalidate Evidence', 'manual_evidence.invalidate', "showAlert('manual_publish_evidence.invalidated','Only evidence_status and invalidated_reason changed.')", 'ghost-btn')}${guardButton('Patch Proof URL', 'manual_evidence.submit', "showAlert('EVIDENCE_APPEND_ONLY','PATCH/DELETE and proof-field mutation are forbidden.','danger')", 'danger-btn')}</div>
    </div>
  `;
}

function renderReports() {
  return `
    <div class="card">
      <h2>Client Report Snapshots</h2>
      <p class="muted">Report snapshots freeze report payload and evidence payload. Later evidence invalidation does not mutate historical reports.</p>
      <div class="grid cols-3"><div class="step active">Campaign Data</div><div class="step active">Evidence Snapshot</div><div class="step active">Frozen Report</div></div>
      <div class="action-row">${guardButton('Create Report Snapshot', 'report.generate', "showAlert('client_report_snapshot.generated','Frozen report_snapshot_payload and evidence_snapshot_payload created.')")}</div>
    </div>
  `;
}

function renderUsageCost() {
  return `
    <div class="grid cols-2">
      <div class="card"><h2>Usage Meter</h2><p>Commercial usage can be recorded only when usable_output_confirmed=true.</p><div class="action-row">${guardButton('Record Usage', 'usage.record', "showAlert('usage_meter.recorded','Usage recorded because usable_output_confirmed=true.')")}${guardButton('Record Failed Output Usage', 'usage.record', "showAlert('USAGE_OUTPUT_NOT_CONFIRMED','Failed or empty output must not create commercial usage.','danger')", 'danger-btn')}</div></div>
      <div class="card"><h2>Cost Events</h2><p>CostEvent tracks provider/internal cost. It is not invoice or customer billing source.</p><pre class="code">CostEvent != BillingProvider\nCostEvent != Invoice\nUsageMeter requires idempotency</pre></div>
    </div>
  `;
}

function renderAudit() {
  return `
    <div class="card">
      <h2>Audit Log</h2>
      <p class="muted">AuditLog is append-only and must not be used as business state.</p>
      <div class="table-wrap"><table><thead><tr><th>Event</th><th>Actor</th><th>Entity</th><th>Time</th></tr></thead><tbody>
        <tr><td>campaign.created</td><td>creator@example.com</td><td>cmp-101</td><td>10:22</td></tr>
        <tr><td>approval_decision.created</td><td>reviewer@example.com</td><td>asset-91/v2</td><td>10:46</td></tr>
        <tr><td>manual_publish_evidence.invalidated</td><td>publisher@example.com</td><td>evd-700</td><td>11:02</td></tr>
      </tbody></table></div>
    </div>
  `;
}

function renderOperations() {
  return `
    <div class="grid cols-2">
      <div class="card"><h2>Safe Mode</h2><p>Permission-gated operational control. Activation/deactivation must create AuditLog.</p><div class="action-row">${guardButton('Activate Safe Mode', 'safe_mode.manage', "showAlert('safe_mode.activated','Safe Mode activated and audited.')")}${guardButton('Deactivate Safe Mode', 'safe_mode.manage', "showAlert('safe_mode.deactivated','Safe Mode deactivated and audited.')", 'ghost-btn')}</div></div>
      <div class="card"><h2>Onboarding Progress</h2><div class="workflow"><div class="step active">Workspace</div><div class="step active">Brand</div><div class="step active">Templates</div><div class="step blocked">Pilot Gate</div><div class="step">Go Live</div></div></div>
    </div>
  `;
}

function renderPage() {
  const page = pages.find(p => p.id === currentPage);
  if (!hasPermission(page.permission)) {
    return `<div class="card"><h2>Permission Protected Screen</h2><p class="muted">Current role cannot access this screen.</p><pre class="code">code: PERMISSION_DENIED\nmessage: Missing ${page.permission}\nuser_action: request access or switch role\ncorrelation_id: proto-${Date.now()}</pre></div>`;
  }
  const map = {
    dashboard: renderDashboard,
    workspaces: renderWorkspaces,
    members: renderMembers,
    campaigns: renderCampaigns,
    briefs: renderBriefs,
    'media-jobs': renderMediaJobs,
    assets: renderAssets,
    review: renderReview,
    approval: renderApproval,
    publish: renderPublish,
    evidence: renderEvidence,
    reports: renderReports,
    'usage-cost': renderUsageCost,
    audit: renderAudit,
    operations: renderOperations
  };
  return map[currentPage]();
}

function render() {
  clearAlert();
  renderNav();
  const page = pages.find(p => p.id === currentPage);
  document.getElementById('pageTitle').textContent = page.title;
  document.getElementById('content').innerHTML = renderPage();
}

document.getElementById('roleSelect').addEventListener('change', e => { currentRole = e.target.value; render(); });
document.getElementById('workspaceSelect').addEventListener('change', e => { currentWorkspace = e.target.value; showAlert('Workspace context changed', `Now browsing ${currentWorkspace}. All reads/writes must remain workspace-scoped.`); });
document.getElementById('simulateErrorBtn').addEventListener('click', simulateError);

render();
