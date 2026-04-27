const { AppError, correlationId, errorBody, sendJson } = require("./error-model");
const { createSeedStore } = require("./store");
const {
  authGuard,
  membershipCheck,
  permissionGuard,
  rejectBodyWorkspaceId,
  workspaceContextGuard
} = require("./guards");

function createApp(options = {}) {
  const store = options.store || createSeedStore();

  return async function app(req, res) {
    const id = correlationId(req);

    try {
      const body = await readBody(req);
      const result = route(req, body, store);
      sendJson(res, result.status || 200, result.body);
    } catch (error) {
      const appError = error instanceof AppError
        ? error
        : new AppError(500, "INTERNAL_ERROR", "Unexpected server error.", "Retry or contact support.");
      sendJson(res, appError.status, errorBody(appError, id));
    }
  };
}

function route(req, body, store) {
  const url = new URL(req.url, "http://localhost");
  const path = url.pathname.replace(/^\/v1/, "");

  if (req.method === "GET" && path === "/roles") {
    const user = authGuard(req, store);
    return { body: { data: store.roles, actor_user_id: user.user_id } };
  }

  if (req.method === "GET" && path === "/permissions") {
    const user = authGuard(req, store);
    return { body: { data: store.permissions, actor_user_id: user.user_id } };
  }

  if (req.method === "GET" && path === "/workspaces") {
    const user = authGuard(req, store);
    const memberships = store.memberships.filter((membership) => membership.user_id === user.user_id);
    const workspaceIds = new Set(memberships.map((membership) => membership.workspace_id));
    return { body: { data: store.workspaces.filter((workspace) => workspaceIds.has(workspace.workspace_id)) } };
  }

  const workspaceMatch = path.match(/^\/workspaces\/([^/]+)(?:\/(.*))?$/);
  if (workspaceMatch) {
    const workspaceId = workspaceContextGuard({ workspaceId: workspaceMatch[1] });
    const user = authGuard(req, store);
    const membership = membershipCheck(user, workspaceId, store);
    const child = workspaceMatch[2] || "";

    if (req.method === "GET" && child === "") {
      permissionGuard(membership, "workspace.read");
      const workspace = store.workspaces.find((candidate) => candidate.workspace_id === workspaceId);
      if (!workspace) {
        throw new AppError(404, "NOT_FOUND", "Workspace was not found.", "Check the workspace ID.");
      }
      return { body: { data: workspace } };
    }

    if (req.method === "GET" && child === "members") {
      permissionGuard(membership, "workspace.manage_members");
      return { body: { data: store.memberships.filter((candidate) => candidate.workspace_id === workspaceId) } };
    }

    if (req.method === "POST" && child === "campaigns") {
      permissionGuard(membership, "campaign.write");
      rejectBodyWorkspaceId(body, workspaceId);
      throw new AppError(501, "NOT_IMPLEMENTED", "Campaign creation is reserved for Sprint 1.", "Complete Sprint 0 gates before enabling this workflow.");
    }

    if (req.method === "PATCH" && child.match(/^campaigns\/[^/]+$/)) {
      permissionGuard(membership, "campaign.write");
      throw new AppError(501, "NOT_IMPLEMENTED", "Campaign updates are reserved for Sprint 1.", "Complete Sprint 0 gates before enabling this workflow.");
    }

    const campaignRead = child.match(/^campaigns\/([^/]+)$/);
    if (req.method === "GET" && campaignRead) {
      permissionGuard(membership, "campaign.read");
      const campaign = store.campaigns.find(
        (candidate) => candidate.campaign_id === campaignRead[1] && candidate.workspace_id === workspaceId
      );
      if (!campaign) {
        throw new AppError(404, "NOT_FOUND", "Campaign was not found in this workspace.", "Check the campaign and workspace IDs.");
      }
      return { body: { data: campaign } };
    }

    const assetVersionsRead = child.match(/^assets\/([^/]+)\/versions$/);
    if (req.method === "GET" && assetVersionsRead) {
      permissionGuard(membership, "media_asset.read");
      const asset = store.mediaAssets.find(
        (candidate) => candidate.media_asset_id === assetVersionsRead[1] && candidate.workspace_id === workspaceId
      );
      if (!asset) {
        throw new AppError(404, "NOT_FOUND", "Media asset was not found in this workspace.", "Check the asset and workspace IDs.");
      }
      return { body: { data: [] } };
    }
  }

  throw new AppError(404, "NOT_FOUND", "Route was not found.", "Use an endpoint from the OpenAPI contract.");
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("error", reject);
    req.on("end", () => {
      const text = Buffer.concat(chunks).toString("utf8");
      if (!text) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(text));
      } catch {
        reject(new AppError(422, "VALIDATION_FAILED", "Request body must be valid JSON.", "Send a valid JSON body."));
      }
    });
  });
}

module.exports = {
  createApp
};
