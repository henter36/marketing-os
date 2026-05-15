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

test("NashirSlice0Service inert methods reject with not-implemented — getCampaignById is implemented", async () => {
  const svc = new NashirSlice0Service();
  // getCampaignById is now implemented; only the remaining inert methods are tested here.
  const methods = [
    "createCampaign",
    "scoreReadiness",
    "submitForApproval",
    "recordManualEvidence"
  ];
  for (const method of methods) {
    await assert.rejects(
      () => svc[method](),
      /not implemented/,
      method + " must reject with not implemented"
    );
  }
});

test("NashirSlice0Repository inert methods reject with not-implemented — findCampaignById and findEvidenceById are implemented", async () => {
  const repo = new NashirSlice0Repository();
  // findCampaignById and findEvidenceById are now implemented; only remaining inert methods are tested here.
  const methods = ["saveCampaign", "saveEvidence"];
  for (const method of methods) {
    await assert.rejects(
      () => repo[method](),
      /not implemented/,
      method + " must reject with not implemented"
    );
  }
});

function assertFileIsInert(relPath, label) {
  const src = fs.readFileSync(path.join(__dirname, relPath), "utf8");
  assert.ok(!/\b(require|import)\b/.test(src), label + " must have no require() or import statements");
  assert.ok(!/\brouter\b/.test(src),        label + " must not reference router");
  assert.ok(!/\bserver\b/.test(src),        label + " must not reference server");
  assert.ok(!/\bstore\b/.test(src),         label + " must not reference store");
  assert.ok(!/\bdb\b/.test(src),            label + " must not reference db");
  assert.ok(!/\brbac\b/.test(src),          label + " must not reference rbac");
  assert.ok(!/\bguards\b/.test(src),        label + " must not reference guards");
  assert.ok(!/\berror-model\b/.test(src),    label + " must not reference error-model");
  assert.ok(!/\bconfig\b/.test(src),        label + " must not reference config");
  assert.ok(!/\bintegrity\b/.test(src),     label + " must not reference integrity");
  assert.ok(!/\bprototype\b/.test(src),     label + " must not reference prototype");
}

test("backend-slice0-service.js is inert — no require() or forbidden references", () => {
  assertFileIsInert("../src/nashir/backend-slice0-service.js", "backend-slice0-service.js");
});

test("backend-slice0-repository.js has no forbidden references — store access is approved by Blocker 4 gate", () => {
  const src = fs.readFileSync(path.join(__dirname, "../src/nashir/backend-slice0-repository.js"), "utf8");
  // store access is approved by the Nashir store entities gate (PR #175) and service/repository gate (PR #178).
  // All other forbidden references remain prohibited.
  assert.ok(!/\b(require|import)\b/.test(src), "backend-slice0-repository.js must have no require() or import statements");
  assert.ok(!/\brouter\b/.test(src),      "backend-slice0-repository.js must not reference router");
  assert.ok(!/\bserver\b/.test(src),      "backend-slice0-repository.js must not reference server");
  assert.ok(!/\bdb\b/.test(src),          "backend-slice0-repository.js must not reference db");
  assert.ok(!/\brbac\b/.test(src),        "backend-slice0-repository.js must not reference rbac");
  assert.ok(!/\bguards\b/.test(src),      "backend-slice0-repository.js must not reference guards");
  assert.ok(!/\berror-model\b/.test(src), "backend-slice0-repository.js must not reference error-model");
  assert.ok(!/\bconfig\b/.test(src),      "backend-slice0-repository.js must not reference config");
  assert.ok(!/\bintegrity\b/.test(src),   "backend-slice0-repository.js must not reference integrity");
  assert.ok(!/\bprototype\b/.test(src),   "backend-slice0-repository.js must not reference prototype");
});
