"use strict";

const assert = require("assert");
const { test } = require("node:test");
const fs = require("fs");
const path = require("path");

const {
  NashirSlice0Service,
  createNashirSlice0Service
} = require("../src/nashir/backend-slice0-service");

const {
  NashirSlice0Repository,
  createNashirSlice0Repository
} = require("../src/nashir/backend-slice0-repository");

test("backend-slice0-service module loads without error", () => {
  assert.ok(NashirSlice0Service !== undefined);
  assert.ok(createNashirSlice0Service !== undefined);
});

test("backend-slice0-repository module loads without error", () => {
  assert.ok(NashirSlice0Repository !== undefined);
  assert.ok(createNashirSlice0Repository !== undefined);
});

test("NashirSlice0Service exports expected surface", () => {
  const svc = new NashirSlice0Service();
  assert.strictEqual(typeof svc.createCampaign, "function");
  assert.strictEqual(typeof svc.getCampaignById, "function");
  assert.strictEqual(typeof svc.scoreReadiness, "function");
  assert.strictEqual(typeof svc.submitForApproval, "function");
  assert.strictEqual(typeof svc.recordManualEvidence, "function");
});

test("NashirSlice0Repository exports expected surface", () => {
  const repo = new NashirSlice0Repository();
  assert.strictEqual(typeof repo.findCampaignById, "function");
  assert.strictEqual(typeof repo.saveCampaign, "function");
  assert.strictEqual(typeof repo.findEvidenceById, "function");
  assert.strictEqual(typeof repo.saveEvidence, "function");
});

test("createNashirSlice0Service factory returns a NashirSlice0Service instance", () => {
  const svc = createNashirSlice0Service();
  assert.ok(svc instanceof NashirSlice0Service);
});

test("createNashirSlice0Repository factory returns a NashirSlice0Repository instance", () => {
  const repo = createNashirSlice0Repository();
  assert.ok(repo instanceof NashirSlice0Repository);
});

test("NashirSlice0Service methods throw not-implemented — no live behavior", () => {
  const svc = new NashirSlice0Service();
  const methods = [
    "createCampaign",
    "getCampaignById",
    "scoreReadiness",
    "submitForApproval",
    "recordManualEvidence"
  ];
  for (const method of methods) {
    assert.throws(
      () => svc[method](),
      /not implemented/,
      method + " must throw not implemented"
    );
  }
});

test("NashirSlice0Repository methods throw not-implemented — no live behavior", () => {
  const repo = new NashirSlice0Repository();
  const methods = ["findCampaignById", "saveCampaign", "findEvidenceById", "saveEvidence"];
  for (const method of methods) {
    assert.throws(
      () => repo[method](),
      /not implemented/,
      method + " must throw not implemented"
    );
  }
});

test("backend-slice0-service.js has no require() calls", () => {
  const src = fs.readFileSync(
    path.join(__dirname, "../src/nashir/backend-slice0-service.js"),
    "utf8"
  );
  assert.ok(
    !/\brequire\s*\(/.test(src),
    "Service file must have no require() calls"
  );
});

test("backend-slice0-repository.js has no require() calls", () => {
  const src = fs.readFileSync(
    path.join(__dirname, "../src/nashir/backend-slice0-repository.js"),
    "utf8"
  );
  assert.ok(
    !/\brequire\s*\(/.test(src),
    "Repository file must have no require() calls"
  );
});

test("backend-slice0-service.js does not reference router/server/store/db/rbac/guards/error-model — inertness assertion", () => {
  const src = fs.readFileSync(
    path.join(__dirname, "../src/nashir/backend-slice0-service.js"),
    "utf8"
  );
  assert.ok(!/\brouter\b/.test(src), "Service file must not reference router");
  assert.ok(!/\bserver\b/.test(src), "Service file must not reference server");
  assert.ok(!/\bstore\b/.test(src), "Service file must not reference store");
  assert.ok(!/\bdb\b/.test(src), "Service file must not reference db");
  assert.ok(!/\brbac\b/.test(src), "Service file must not reference rbac");
  assert.ok(!/\bguards\b/.test(src), "Service file must not reference guards");
  assert.ok(!/error-model/.test(src), "Service file must not reference error-model");
});

test("backend-slice0-repository.js does not reference router/server/store/db/rbac/guards/error-model — inertness assertion", () => {
  const src = fs.readFileSync(
    path.join(__dirname, "../src/nashir/backend-slice0-repository.js"),
    "utf8"
  );
  assert.ok(!/\brouter\b/.test(src), "Repository file must not reference router");
  assert.ok(!/\bserver\b/.test(src), "Repository file must not reference server");
  assert.ok(!/\bstore\b/.test(src), "Repository file must not reference store");
  assert.ok(!/\bdb\b/.test(src), "Repository file must not reference db");
  assert.ok(!/\brbac\b/.test(src), "Repository file must not reference rbac");
  assert.ok(!/\bguards\b/.test(src), "Repository file must not reference guards");
  assert.ok(!/error-model/.test(src), "Repository file must not reference error-model");
});
