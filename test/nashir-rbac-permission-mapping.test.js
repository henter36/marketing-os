"use strict";

const assert = require("assert");
const { test } = require("node:test");
const { hasPermission } = require("../src/rbac");

// 4 approved Nashir codes × 7 roles = 28 assertions.
// Imports only hasPermission — no router, store, guards, server, or nashir modules.

const GRANTS = {
  "nashir.campaign.read": {
    owner: true,
    admin: true,
    creator: true,
    reviewer: true,
    publisher: true,
    billing_admin: false,
    viewer: true
  },
  "nashir.campaign.write": {
    owner: true,
    admin: true,
    creator: true,
    reviewer: false,
    publisher: false,
    billing_admin: false,
    viewer: false
  },
  "nashir.evidence.submit": {
    owner: true,
    admin: true,
    creator: false,
    reviewer: false,
    publisher: true,
    billing_admin: false,
    viewer: false
  },
  "nashir.approval.decide": {
    owner: true,
    admin: true,
    creator: false,
    reviewer: true,
    publisher: false,
    billing_admin: false,
    viewer: false
  }
};

for (const [code, roles] of Object.entries(GRANTS)) {
  for (const [role, expected] of Object.entries(roles)) {
    test(`${role} ${expected ? "has" : "does not have"} ${code}`, () => {
      assert.strictEqual(
        hasPermission(role, code),
        expected,
        `expected hasPermission('${role}', '${code}') to be ${expected}`
      );
    });
  }
}
