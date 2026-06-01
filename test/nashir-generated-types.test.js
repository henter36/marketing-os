"use strict";

const assert = require("assert");
const { test } = require("node:test");
const fs = require("fs");
const path = require("path");

// Lightweight structural checks for the Nashir generated type artifact.
// Does not snapshot the entire file; checks only key invariants.

const ROOT = path.resolve(__dirname, "..");
const TYPES_FILE = path.join(ROOT, "generated", "nashir-api-types", "index.d.ts");

let _types;
function typesText() {
  if (_types === undefined) _types = fs.readFileSync(TYPES_FILE, "utf8");
  return _types;
}

test("generated/nashir-api-types/index.d.ts exists", () => {
  assert.ok(fs.existsSync(TYPES_FILE), "index.d.ts must exist in generated/nashir-api-types/");
});

test("generated types file declares generation source as docs/nashir_v1_openapi.yaml", () => {
  assert.ok(
    typesText().includes("docs/nashir_v1_openapi.yaml"),
    "generated types must reference the canonical source file"
  );
});

test("generated types file includes DO NOT EDIT header", () => {
  assert.ok(
    typesText().includes("DO NOT EDIT MANUALLY"),
    "generated types must include a DO NOT EDIT header"
  );
});

test("generated types file includes @source-hash for freshness tracking", () => {
  assert.ok(
    /@source-hash:\s*[0-9a-f]{64}/.test(typesText()),
    "generated types must include a @source-hash line for freshness verification"
  );
});

test("generated types exports NashirStoreProfile interface", () => {
  assert.ok(
    typesText().includes("export interface NashirStoreProfile"),
    "NashirStoreProfile interface must be exported"
  );
});

test("generated types exports NashirStoreProfileResponse interface", () => {
  assert.ok(
    typesText().includes("export interface NashirStoreProfileResponse"),
    "NashirStoreProfileResponse interface must be exported"
  );
});

test("generated types exports NashirProduct interface", () => {
  assert.ok(
    typesText().includes("export interface NashirProduct"),
    "NashirProduct interface must be exported"
  );
});

test("generated types exports NashirProductResponse interface", () => {
  assert.ok(
    typesText().includes("export interface NashirProductResponse"),
    "NashirProductResponse interface must be exported"
  );
});

test("generated types exports NashirProductListResponse interface", () => {
  assert.ok(
    typesText().includes("export interface NashirProductListResponse"),
    "NashirProductListResponse interface must be exported"
  );
});

test("generated types exports ErrorModel interface", () => {
  assert.ok(
    typesText().includes("export interface ErrorModel"),
    "ErrorModel interface must be exported"
  );
});

test("generated types exports NashirOperationId union", () => {
  assert.ok(
    typesText().includes("export type NashirOperationId"),
    "NashirOperationId union type must be exported"
  );
});

test("generated types NashirOperationId includes getNashirStoreProfile", () => {
  assert.ok(
    typesText().includes("getNashirStoreProfile"),
    "NashirOperationId must include getNashirStoreProfile"
  );
});

test("generated types NashirOperationId includes listNashirProducts and getNashirProduct", () => {
  assert.ok(typesText().includes("listNashirProducts"), "must include listNashirProducts");
  assert.ok(typesText().includes("getNashirProduct"), "must include getNashirProduct");
});

test("generated types do not include fetch/client/runtime helper exports", () => {
  const text = typesText();
  assert.ok(!text.includes("export function fetch"), "must not export a fetch function");
  assert.ok(!text.includes("export class"), "must not export a class (runtime client)");
  assert.ok(!text.includes("import fetch"), "must not import fetch");
  assert.ok(!text.includes("require("), "must not use require() — types only");
});

test("generated types do not expose internal snake_case DB-only fields from store/product", () => {
  // NashirProduct and NashirStoreProfile must use camelCase
  const text = typesText();
  // Check that snake_case internal fields are NOT in the NashirProduct block
  const productIdx = text.indexOf("export interface NashirProduct {");
  const productEnd = text.indexOf("}", productIdx);
  const productBlock = text.slice(productIdx, productEnd);
  assert.ok(!productBlock.includes("product_id:"), "product_id snake_case must not appear in NashirProduct");
  assert.ok(!productBlock.includes("store_profile_id:"), "store_profile_id snake_case must not appear in NashirProduct");
});

test("generated types README exists", () => {
  const readme = path.join(ROOT, "generated", "nashir-api-types", "README.md");
  assert.ok(fs.existsSync(readme), "README.md must exist in generated/nashir-api-types/");
});
