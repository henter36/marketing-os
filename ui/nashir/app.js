(function () {
  "use strict";

  const API_PREFIX = "/v1";

  const state = {
    workspaceId: "",
    userId: "",
    campaigns: [],
    selectedCampaignId: "",
    evidence: [],
    selectedEvidenceId: ""
  };

  const elements = {
    contextForm: document.getElementById("context-form"),
    workspaceId: document.getElementById("workspace-id"),
    userId: document.getElementById("user-id"),
    notice: document.getElementById("notice"),
    refreshCampaigns: document.getElementById("refresh-campaigns"),
    campaignListState: document.getElementById("campaign-list-state"),
    campaignList: document.getElementById("campaign-list"),
    campaignCreateForm: document.getElementById("campaign-create-form"),
    campaignName: document.getElementById("campaign-name"),
    loadCampaignDetail: document.getElementById("load-campaign-detail"),
    campaignDetail: document.getElementById("campaign-detail"),
    refreshEvidence: document.getElementById("refresh-evidence"),
    evidenceListState: document.getElementById("evidence-list-state"),
    evidenceList: document.getElementById("evidence-list"),
    evidenceSubmitForm: document.getElementById("evidence-submit-form"),
    evidenceType: document.getElementById("evidence-type"),
    evidenceChannel: document.getElementById("evidence-channel"),
    evidenceUrl: document.getElementById("evidence-url"),
    evidenceExternalReference: document.getElementById("evidence-external-reference"),
    evidenceNotes: document.getElementById("evidence-notes"),
    evidencePublishedAt: document.getElementById("evidence-published-at"),
    loadEvidenceDetail: document.getElementById("load-evidence-detail"),
    evidenceDetail: document.getElementById("evidence-detail")
  };

  function setNotice(type, message) {
    elements.notice.hidden = false;
    elements.notice.className = `notice ${type}`;
    elements.notice.textContent = message;
  }

  function clearNotice() {
    elements.notice.hidden = true;
    elements.notice.textContent = "";
  }

  function readContext() {
    state.workspaceId = elements.workspaceId.value.trim();
    state.userId = elements.userId.value.trim();
    if (!state.workspaceId || !state.userId) {
      setNotice("validation", "Enter both workspace ID and user ID before calling Nashir routes.");
      return false;
    }
    return true;
  }

  function workspacePath(path) {
    const workspaceId = encodeURIComponent(state.workspaceId);
    return `${API_PREFIX}/workspaces/${workspaceId}${path}`;
  }

  function campaignPath(campaignId, suffix) {
    const encodedCampaignId = encodeURIComponent(campaignId);
    return workspacePath(`/nashir-campaigns/${encodedCampaignId}${suffix || ""}`);
  }

  function evidencePath(campaignId, evidenceId) {
    const encodedEvidenceId = encodeURIComponent(evidenceId);
    return campaignPath(campaignId, `/evidence/${encodedEvidenceId}`);
  }

  async function requestJson(path, options) {
    const requestOptions = options || {};
    const headers = {
      Accept: "application/json",
      "x-user-id": state.userId
    };
    if (requestOptions.body) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(path, {
      method: requestOptions.method || "GET",
      headers,
      body: requestOptions.body ? JSON.stringify(requestOptions.body) : undefined
    });

    let payload = null;
    try {
      payload = await response.json();
    } catch (error) {
      payload = null;
    }

    if (!response.ok) {
      const message = payload && payload.error && payload.error.message
        ? payload.error.message
        : `Request failed with status ${response.status}.`;
      const failure = new Error(message);
      failure.status = response.status;
      throw failure;
    }

    if (!payload || !Object.hasOwn(payload, "data")) {
      const failure = new Error("Response did not include the expected data envelope.");
      failure.status = 0;
      throw failure;
    }

    return payload.data;
  }

  function describeFailure(error) {
    if (error.status === 401) {
      return ["auth", "401 unauthenticated. Check the configured user ID."];
    }
    if (error.status === 403) {
      return ["forbidden", "403 forbidden. This user lacks the required Nashir permission."];
    }
    if (error.status === 404) {
      return ["missing", "404 not found. The backend intentionally does not disclose whether the workspace, membership, campaign, or evidence exists."];
    }
    if (error.status === 400) {
      return ["validation", error.message || "Validation error. Check the submitted fields."];
    }
    return ["failure", error.message || "Generic failure. Retry after checking the request context."];
  }

  function handleFailure(error) {
    const [type, message] = describeFailure(error);
    setNotice(type, message);
  }

  function setListState(element, mode, message) {
    element.className = `state-line ${mode || ""}`;
    element.textContent = message || "";
  }

  function textElement(tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) {
      element.className = className;
    }
    element.textContent = text == null || text === "" ? "Not provided" : String(text);
    return element;
  }

  function field(label, value) {
    const row = document.createElement("div");
    row.className = "detail-row";
    row.appendChild(textElement("dt", "", label));
    row.appendChild(textElement("dd", "", value));
    return row;
  }

  function renderDetail(container, record, fields) {
    container.className = "detail-block";
    container.textContent = "";
    if (!record) {
      container.className = "detail-block empty";
      container.textContent = "No record selected.";
      return;
    }
    const list = document.createElement("dl");
    fields.forEach(([label, key]) => {
      list.appendChild(field(label, record[key]));
    });
    container.appendChild(list);
  }

  function campaignTitle(campaign) {
    return campaign.campaign_name || campaign.nashir_campaign_id || "Untitled campaign";
  }

  function evidenceTitle(evidence) {
    return evidence.evidenceType || evidence.id || "Evidence";
  }

  function renderCampaignList() {
    elements.campaignList.textContent = "";
    if (!state.campaigns.length) {
      setListState(elements.campaignListState, "empty", "No campaigns returned for this workspace.");
      return;
    }
    setListState(elements.campaignListState, "success", `${state.campaigns.length} campaign record(s) loaded.`);
    const fragment = document.createDocumentFragment();
    state.campaigns.forEach((campaign) => {
      const item = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.className = campaign.nashir_campaign_id === state.selectedCampaignId ? "record-button selected" : "record-button";
      button.appendChild(textElement("span", "record-title", campaignTitle(campaign)));
      button.appendChild(textElement("span", "record-meta", campaign.campaign_status || "status unavailable"));
      button.addEventListener("click", () => selectCampaign(campaign.nashir_campaign_id));
      item.appendChild(button);
      fragment.appendChild(item);
    });
    elements.campaignList.appendChild(fragment);
  }

  function renderEvidenceList() {
    elements.evidenceList.textContent = "";
    if (!state.selectedCampaignId) {
      setListState(elements.evidenceListState, "empty", "Select a campaign before loading evidence.");
      return;
    }
    if (!state.evidence.length) {
      setListState(elements.evidenceListState, "empty", "No evidence returned for the selected campaign.");
      return;
    }
    setListState(elements.evidenceListState, "success", `${state.evidence.length} evidence record(s) loaded.`);
    const fragment = document.createDocumentFragment();
    state.evidence.forEach((evidence) => {
      const item = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.className = evidence.id === state.selectedEvidenceId ? "record-button selected" : "record-button";
      button.appendChild(textElement("span", "record-title", evidenceTitle(evidence)));
      button.appendChild(textElement("span", "record-meta", evidence.channel || "channel unavailable"));
      button.addEventListener("click", () => selectEvidence(evidence.id));
      item.appendChild(button);
      fragment.appendChild(item);
    });
    elements.evidenceList.appendChild(fragment);
  }

  async function loadCampaigns() {
    if (!readContext()) return;
    clearNotice();
    setListState(elements.campaignListState, "loading", "Loading campaigns...");
    try {
      state.campaigns = await requestJson(workspacePath("/nashir-campaigns"));
      if (!Array.isArray(state.campaigns)) {
        state.campaigns = [];
      }
      state.selectedCampaignId = "";
      state.evidence = [];
      state.selectedEvidenceId = "";
      renderCampaignList();
      renderCampaignDetail(null);
      renderEvidenceList();
      renderEvidenceDetail(null);
      setNotice("success", "Campaign list loaded.");
    } catch (error) {
      setListState(elements.campaignListState, "failure", "Campaign list could not be loaded.");
      handleFailure(error);
    }
  }

  async function createCampaign(event) {
    event.preventDefault();
    if (!readContext()) return;
    const campaignName = elements.campaignName.value.trim();
    if (!campaignName) {
      setNotice("validation", "Campaign name is required.");
      return;
    }
    clearNotice();
    try {
      const campaign = await requestJson(workspacePath("/nashir-campaigns"), {
        method: "POST",
        body: { campaign_name: campaignName }
      });
      elements.campaignCreateForm.reset();
      state.campaigns = [campaign].concat(state.campaigns);
      state.selectedCampaignId = campaign.nashir_campaign_id;
      state.evidence = [];
      state.selectedEvidenceId = "";
      renderCampaignList();
      renderCampaignDetail(campaign);
      renderEvidenceList();
      renderEvidenceDetail(null);
      setNotice("success", "Campaign created.");
    } catch (error) {
      handleFailure(error);
    }
  }

  async function selectCampaign(campaignId) {
    state.selectedCampaignId = campaignId;
    state.selectedEvidenceId = "";
    state.evidence = [];
    renderCampaignList();
    renderEvidenceList();
    renderEvidenceDetail(null);
    await loadCampaignDetail();
    await loadEvidence();
  }

  async function loadCampaignDetail() {
    if (!readContext()) return;
    if (!state.selectedCampaignId) {
      setNotice("validation", "Select a campaign before loading campaign detail.");
      return;
    }
    clearNotice();
    elements.campaignDetail.className = "detail-block loading";
    elements.campaignDetail.textContent = "Loading campaign detail...";
    try {
      const campaign = await requestJson(campaignPath(state.selectedCampaignId));
      renderCampaignDetail(campaign);
      setNotice("success", "Campaign detail loaded.");
    } catch (error) {
      elements.campaignDetail.className = "detail-block empty";
      elements.campaignDetail.textContent = "Campaign detail could not be loaded.";
      handleFailure(error);
    }
  }

  function renderCampaignDetail(campaign) {
    renderDetail(elements.campaignDetail, campaign, [
      ["Campaign ID", "nashir_campaign_id"],
      ["Workspace ID", "workspace_id"],
      ["Name", "campaign_name"],
      ["Status", "campaign_status"],
      ["Created at", "created_at"],
      ["Updated at", "updated_at"]
    ]);
  }

  async function loadEvidence() {
    if (!readContext()) return;
    if (!state.selectedCampaignId) {
      setNotice("validation", "Select a campaign before loading evidence.");
      return;
    }
    clearNotice();
    setListState(elements.evidenceListState, "loading", "Loading evidence...");
    try {
      state.evidence = await requestJson(campaignPath(state.selectedCampaignId, "/evidence"));
      if (!Array.isArray(state.evidence)) {
        state.evidence = [];
      }
      state.selectedEvidenceId = "";
      renderEvidenceList();
      renderEvidenceDetail(null);
      setNotice("success", "Evidence list loaded.");
    } catch (error) {
      setListState(elements.evidenceListState, "failure", "Evidence list could not be loaded.");
      handleFailure(error);
    }
  }

  function buildEvidenceBody() {
    const evidenceType = elements.evidenceType.value.trim();
    const channel = elements.evidenceChannel.value.trim();
    const url = elements.evidenceUrl.value.trim();
    const externalReference = elements.evidenceExternalReference.value.trim();
    const notes = elements.evidenceNotes.value.trim();
    const publishedAt = elements.evidencePublishedAt.value;

    if (!evidenceType || !channel) {
      setNotice("validation", "Evidence type and channel are required.");
      return null;
    }
    if (!url && !externalReference && !notes) {
      setNotice("validation", "Provide URL, external reference, or notes for evidence proof.");
      return null;
    }

    const body = { evidenceType, channel };
    if (url) body.url = url;
    if (externalReference) body.externalReference = externalReference;
    if (notes) body.notes = notes;
    if (publishedAt) body.publishedAt = new Date(publishedAt).toISOString();
    return body;
  }

  async function submitEvidence(event) {
    event.preventDefault();
    if (!readContext()) return;
    if (!state.selectedCampaignId) {
      setNotice("validation", "Select a campaign before submitting evidence.");
      return;
    }
    const body = buildEvidenceBody();
    if (!body) return;
    clearNotice();
    try {
      const evidence = await requestJson(campaignPath(state.selectedCampaignId, "/evidence"), {
        method: "POST",
        body
      });
      elements.evidenceSubmitForm.reset();
      state.evidence = [evidence].concat(state.evidence);
      state.selectedEvidenceId = evidence.id;
      renderEvidenceList();
      renderEvidenceDetail(evidence);
      setNotice("success", "Evidence submitted.");
    } catch (error) {
      handleFailure(error);
    }
  }

  async function selectEvidence(evidenceId) {
    state.selectedEvidenceId = evidenceId;
    renderEvidenceList();
    await loadEvidenceDetail();
  }

  async function loadEvidenceDetail() {
    if (!readContext()) return;
    if (!state.selectedCampaignId || !state.selectedEvidenceId) {
      setNotice("validation", "Select a campaign and evidence record before loading evidence detail.");
      return;
    }
    clearNotice();
    elements.evidenceDetail.className = "detail-block loading";
    elements.evidenceDetail.textContent = "Loading evidence detail...";
    try {
      const evidence = await requestJson(evidencePath(state.selectedCampaignId, state.selectedEvidenceId));
      renderEvidenceDetail(evidence);
      setNotice("success", "Evidence detail loaded.");
    } catch (error) {
      elements.evidenceDetail.className = "detail-block empty";
      elements.evidenceDetail.textContent = "Evidence detail could not be loaded.";
      handleFailure(error);
    }
  }

  function renderEvidenceDetail(evidence) {
    renderDetail(elements.evidenceDetail, evidence, [
      ["Evidence ID", "id"],
      ["Workspace ID", "workspaceId"],
      ["Campaign ID", "nashirCampaignId"],
      ["Evidence type", "evidenceType"],
      ["Channel", "channel"],
      ["Status", "status"],
      ["Submitted at", "submittedAt"],
      ["Submitted by", "submittedBy"],
      ["Published at", "publishedAt"],
      ["URL", "url"],
      ["External reference", "externalReference"],
      ["Notes", "notes"]
    ]);
  }

  elements.contextForm.addEventListener("submit", (event) => {
    event.preventDefault();
    loadCampaigns();
  });
  elements.refreshCampaigns.addEventListener("click", loadCampaigns);
  elements.campaignCreateForm.addEventListener("submit", createCampaign);
  elements.loadCampaignDetail.addEventListener("click", loadCampaignDetail);
  elements.refreshEvidence.addEventListener("click", loadEvidence);
  elements.evidenceSubmitForm.addEventListener("submit", submitEvidence);
  elements.loadEvidenceDetail.addEventListener("click", loadEvidenceDetail);

  setListState(elements.campaignListState, "empty", "Enter request context to load campaigns.");
  setListState(elements.evidenceListState, "empty", "Select a campaign to load evidence.");
})();
