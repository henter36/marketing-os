const test = require("node:test");
const assert = require("node:assert/strict");
const { createApp } = require("../router");

function invoke(app, { method = "GET", path, body, userId = "user-creator-a" }) {
  return new Promise((resolve) => {
    const chunks = [];
    const req = {
      method,
      url: `/v1${path}`,
      headers: {
        "x-user-id": userId,
        "x-correlation-id": "template-runtime-test"
      },
      on(event, handler) {
        if (event === "data" && body !== undefined) chunks.push(Buffer.from(JSON.stringify(body)));
        if (event === "end") process.nextTick(handler);
        return this;
      }
    };
    const res = {
      statusCode: null,
      headers: null,
      body: null,
      writeHead(status, headers) {
        this.statusCode = status;
        this.headers = headers;
      },
      end(payload) {
        this.body = payload ? JSON.parse(payload) : null;
        resolve({ status: this.statusCode, body: this.body });
      }
    };
    app(req, res);
  });
}

test("PromptTemplate create accepts canonical template_variables and returns canonical shape", async () => {
  const app = createApp();
  const response = await invoke(app, {
    method: "POST",
    path: "/workspaces/workspace-a/prompt-templates",
    body: {
      template_name: "Canonical Variables Prompt",
      template_type: "caption",
      template_body: "Write about {{product}}.",
      template_variables: ["product"],
      version_number: 1
    }
  });

  assert.equal(response.status, 201);
  assert.deepEqual(response.body.data.template_variables, ["product"]);
  assert.equal(response.body.data.template_status, "draft");
  assert.equal(Object.hasOwn(response.body.data, "variables"), false);
});

test("PromptTemplate create rejects conflicting variables and template_variables", async () => {
  const app = createApp();
  const response = await invoke(app, {
    method: "POST",
    path: "/workspaces/workspace-a/prompt-templates",
    body: {
      template_name: "Conflicting Variables Prompt",
      template_type: "caption",
      template_body: "Write about {{product}}.",
      variables: ["product"],
      template_variables: ["service"],
      version_number: 1
    }
  });

  assert.equal(response.status, 422);
  assert.equal(response.body.code, "VALIDATION_FAILED");
});

test("PromptTemplate create rejects invalid template_type before storage", async () => {
  const app = createApp();
  const response = await invoke(app, {
    method: "POST",
    path: "/workspaces/workspace-a/prompt-templates",
    body: {
      template_name: "Invalid Type Prompt",
      template_type: "unsupported",
      template_body: "Write about {{product}}.",
      template_variables: ["product"],
      version_number: 1
    }
  });

  assert.equal(response.status, 422);
  assert.equal(response.body.code, "VALIDATION_FAILED");
});

test("ReportTemplate create accepts compatibility report_type but does not return it as canonical response", async () => {
  const app = createApp();
  const response = await invoke(app, {
    method: "POST",
    path: "/workspaces/workspace-a/report-templates",
    body: {
      template_name: "Runtime Compatible Report",
      report_type: "monthly",
      template_body: { sections: ["summary"] }
    }
  });

  assert.equal(response.status, 201);
  assert.equal(response.body.data.template_name, "Runtime Compatible Report");
  assert.equal(response.body.data.template_status, "draft");
  assert.equal(Object.hasOwn(response.body.data, "report_type"), false);
});

test("ReportTemplate create accepts canonical request without report_type", async () => {
  const app = createApp();
  const response = await invoke(app, {
    method: "POST",
    path: "/workspaces/workspace-a/report-templates",
    body: {
      template_name: "Canonical Report",
      template_body: { sections: ["summary"] }
    }
  });

  assert.equal(response.status, 201);
  assert.equal(response.body.data.template_name, "Canonical Report");
  assert.equal(Object.hasOwn(response.body.data, "report_type"), false);
});

test("ReportTemplate create rejects duplicate template_name in the same workspace", async () => {
  const app = createApp();
  const response = await invoke(app, {
    method: "POST",
    path: "/workspaces/workspace-a/report-templates",
    body: {
      template_name: "Monthly Report",
      report_type: "monthly",
      template_body: { sections: ["summary"] }
    }
  });

  assert.equal(response.status, 409);
  assert.equal(response.body.code, "DUPLICATE_REPORT_TEMPLATE");
});

test("Template list responses remain workspace-scoped and canonical", async () => {
  const app = createApp();
  const promptResponse = await invoke(app, {
    method: "GET",
    path: "/workspaces/workspace-a/prompt-templates"
  });
  const reportResponse = await invoke(app, {
    method: "GET",
    path: "/workspaces/workspace-a/report-templates"
  });

  assert.equal(promptResponse.status, 200);
  assert.equal(reportResponse.status, 200);
  assert.equal(promptResponse.body.data.every((item) => item.workspace_id === "workspace-a"), true);
  assert.equal(reportResponse.body.data.every((item) => item.workspace_id === "workspace-a"), true);
  assert.equal(promptResponse.body.data.some((item) => Object.hasOwn(item, "variables")), false);
  assert.equal(reportResponse.body.data.some((item) => Object.hasOwn(item, "report_type")), false);
});
