(function () {
  "use strict";

  const governanceLabels = [
    "Readiness is advisory - not approval.",
    "Approval is separate from readiness.",
    "Evidence records proof only - it does not authorize publishing.",
    "Manual publishing remains external and user-operated.",
    "UTM Lite supports tracked links only - not attribution.",
    "Manual performance review is user-entered only - not analytics ingestion.",
    "AI assistant is advisory-only.",
    "NO-GO actions are blocked in Core V1."
  ];

  const statusCards = [
    {
      title: "Nashir Core V1 status",
      state: "Read-only shell",
      detail: "Manual/export/review/approval/evidence boundaries are visible without runtime behavior."
    },
    {
      title: "Readiness advisory status",
      state: "Advisory only",
      detail: "Readiness can explain gaps and blockers, but it cannot approve content or authorize publishing."
    },
    {
      title: "Intake / campaign planning status",
      state: "Planned manual intake",
      detail: "Campaign, object, destination, rights, and content inputs remain user-provided planning context."
    },
    {
      title: "Approval status",
      state: "Human-only approval",
      detail: "Approval is explicit, authorized, version-bound, and separate from readiness."
    },
    {
      title: "Reapproval-required status",
      state: "Material changes require review",
      detail: "Approved content with material changes must return to human review before manual publishing support continues."
    },
    {
      title: "Manual publishing checklist status",
      state: "External preparation only",
      detail: "Checklist support is for user-operated external publishing preparation and does not publish, schedule, spend, or connect accounts."
    },
    {
      title: "Manual publishing evidence status",
      state: "Proof record only",
      detail: "Evidence can describe user-provided proof after external manual publishing, but it does not authorize publishing."
    },
    {
      title: "UTM Lite status",
      state: "Tracked links only",
      detail: "UTM Lite supports structured tracked links only and must not become attribution, analytics ingestion, or platform reporting."
    },
    {
      title: "Manual performance review status",
      state: "User-entered observations",
      detail: "Manual performance review is user-entered only and does not import analytics, optimize campaigns, or attribute performance."
    }
  ];

  const boundaryCards = [
    {
      title: "Role/permission boundary status",
      state: "Protected actions absent",
      detail: "Viewer, editor, reviewer, evidence reviewer, admin, and owner authority remains planning-only; no protected action controls are rendered."
    },
    {
      title: "Tenant/workspace boundary status",
      state: "Route context remains authority",
      detail: "Future workspace-scoped behavior must use route-derived workspace context and must not trust body workspace identifiers."
    },
    {
      title: "AI advisory-only boundary",
      state: "No AI execution",
      detail: "AI assistant references are advisory-only; AI cannot approve, reject, accept evidence, publish, schedule, spend, ingest analytics, or change protected fields."
    }
  ];

  const blockedActions = [
    "publish",
    "schedule",
    "connect account",
    "launch ad",
    "spend budget",
    "pay",
    "ingest analytics",
    "attribute performance",
    "auto-optimize",
    "AI approval",
    "evidence authorization",
    "direct external integration",
    "social OAuth",
    "autonomous AI execution",
    "Post-V1 module implementation"
  ];

  function textElement(tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) {
      element.className = className;
    }
    element.textContent = text;
    return element;
  }

  function renderLabels() {
    const container = document.getElementById("governance-labels");
    if (!container) return;
    const fragment = document.createDocumentFragment();
    governanceLabels.forEach((label) => {
      fragment.appendChild(textElement("p", "label-card", label));
    });
    container.appendChild(fragment);
  }

  function renderCards(targetId, cards) {
    const container = document.getElementById(targetId);
    if (!container) return;
    const fragment = document.createDocumentFragment();
    cards.forEach((card) => {
      const article = document.createElement("article");
      article.className = "status-card";
      article.appendChild(textElement("p", "card-state", card.state));
      article.appendChild(textElement("h3", "", card.title));
      article.appendChild(textElement("p", "", card.detail));
      fragment.appendChild(article);
    });
    container.appendChild(fragment);
  }

  function renderBlockedActions() {
    const list = document.getElementById("blocked-actions");
    if (!list) return;
    const fragment = document.createDocumentFragment();
    blockedActions.forEach((action) => {
      const item = document.createElement("li");
      item.appendChild(textElement("span", "blocked-marker", "Blocked"));
      item.appendChild(textElement("span", "", action));
      fragment.appendChild(item);
    });
    list.appendChild(fragment);
  }

  renderLabels();
  renderCards("status-cards", statusCards);
  renderCards("boundary-cards", boundaryCards);
  renderBlockedActions();
})();
