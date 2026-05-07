const test = require("node:test");
const assert = require("node:assert/strict");
const { rejectBodyWorkspaceId } = require("../guards");
const { createSeedStore } = require("../store");

test("PromptTemplate request accepts canonical template_variables and mirrors legacy variables", () => {
  const body = {
    template_name: "Canonical Variables Prompt",
    template_type: "caption",
    template_body: "Write about {{product}}.",
    template_variables: ["product"],
    version_number: 1
  };

  rejectBodyWorkspaceId(body, "workspace-a");

  assert.deepEqual(body.template_variables, ["product"]);
  assert.deepEqual(body.variables, ["product"]);
});

test("PromptTemplate request accepts equivalent variable lists regardless of order", () => {
  const body = {
    template_name: "Equivalent Variables Prompt",
    template_type: "caption",
    template_body: "Write about {{product}} for {{audience}}.",
    variables: ["audience", "product"],
    template_variables: ["product", "audience"],
    version_number: 1
  };

  rejectBodyWorkspaceId(body, "workspace-a");

  assert.deepEqual(body.variables, ["audience", "product"]);
  assert.deepEqual(body.template_variables, ["product", "audience"]);
});

test("PromptTemplate request accepts equivalent object variables regardless of key order", () => {
  const body = {
    template_name: "Equivalent Object Variables Prompt",
    template_type: "caption",
    template_body: "Write about {{product}}.",
    variables: { product: { required: true, type: "string" }, audience: { type: "string" } },
    template_variables: { audience: { type: "string" }, product: { type: "string", required: true } },
    version_number: 1
  };

  rejectBodyWorkspaceId(body, "workspace-a");

  assert.deepEqual(body.variables.product, { required: true, type: "string" });
});

test("PromptTemplate request rejects conflicting variables and template_variables", () => {
  const body = {
    template_name: "Conflicting Variables Prompt",
    template_type: "caption",
    template_body: "Write about {{product}}.",
    variables: ["product"],
    template_variables: ["service"],
    version_number: 1
  };

  assert.throws(
    () => rejectBodyWorkspaceId(body, "workspace-a"),
    (error) => error.code === "VALIDATION_FAILED"
  );
});

test("PromptTemplate request rejects invalid template_type", () => {
  const body = {
    template_name: "Invalid Type Prompt",
    template_type: "unsupported",
    template_body: "Write about {{product}}.",
    template_variables: ["product"],
    version_number: 1
  };

  assert.throws(
    () => rejectBodyWorkspaceId(body, "workspace-a"),
    (error) => error.code === "VALIDATION_FAILED"
  );
});

test("PromptTemplate serialization returns canonical template_variables and template_status", () => {
  const store = createSeedStore();
  const template = store.promptTemplates.find((item) => item.prompt_template_id === "prompt-template-a");
  const serialized = JSON.parse(JSON.stringify(template));

  assert.deepEqual(serialized.template_variables, ["product"]);
  assert.equal(serialized.template_status, "draft");
  assert.equal(Object.hasOwn(serialized, "variables"), false);
});

test("ReportTemplate request without report_type receives compatibility placeholder", () => {
  const body = {
    template_name: "Canonical Report",
    template_body: { sections: ["summary"] }
  };

  rejectBodyWorkspaceId(body, "workspace-a");

  assert.equal(body.report_type, "legacy_compatibility_input");
});

test("ReportTemplate serialization omits report_type and exposes template_status", () => {
  const store = createSeedStore();
  const template = store.reportTemplates.find((item) => item.report_template_id === "report-template-a");
  const serialized = JSON.parse(JSON.stringify(template));

  assert.equal(serialized.template_name, "Monthly Report");
  assert.equal(serialized.template_status, "draft");
  assert.equal(Object.hasOwn(serialized, "report_type"), false);
});

test("ReportTemplate duplicate template_name is rejected within the same workspace", () => {
  const store = createSeedStore();

  assert.throws(
    () => store.reportTemplates.push({
      report_template_id: "report-template-duplicate",
      workspace_id: "workspace-a",
      template_name: "Monthly Report",
      report_type: "monthly",
      template_body: { sections: ["summary"] }
    }),
    (error) => error.code === "DUPLICATE_REPORT_TEMPLATE"
  );
});

test("ReportTemplate duplicate template_name is rejected within the same push batch", () => {
  const store = createSeedStore();

  assert.throws(
    () => store.reportTemplates.push(
      {
        report_template_id: "report-template-batch-a",
        workspace_id: "workspace-a",
        template_name: "Batch Duplicate Report",
        report_type: "monthly",
        template_body: { sections: ["summary"] }
      },
      {
        report_template_id: "report-template-batch-b",
        workspace_id: "workspace-a",
        template_name: "Batch Duplicate Report",
        report_type: "monthly",
        template_body: { sections: ["details"] }
      }
    ),
    (error) => error.code === "DUPLICATE_REPORT_TEMPLATE"
  );
});

test("Template list serialization remains workspace-scoped and canonical", () => {
  const store = createSeedStore();
  const prompts = store.promptTemplates
    .filter((item) => item.workspace_id === "workspace-a")
    .map((item) => JSON.parse(JSON.stringify(item)));
  const reports = store.reportTemplates
    .filter((item) => item.workspace_id === "workspace-a")
    .map((item) => JSON.parse(JSON.stringify(item)));

  assert.equal(prompts.every((item) => item.workspace_id === "workspace-a"), true);
  assert.equal(reports.every((item) => item.workspace_id === "workspace-a"), true);
  assert.equal(prompts.some((item) => Object.hasOwn(item, "variables")), false);
  assert.equal(reports.some((item) => Object.hasOwn(item, "report_type")), false);
});
