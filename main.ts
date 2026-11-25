// The Funniest Honest Appliance Error — entry program.
//
// Writes one honest appliance error line to /output/entry.txt
// (or $MAKEFUN_OUTPUT_DIR/entry.txt when set, for local testing),
// then reads it back and verifies it is byte-identical.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "Error: blender blade spins, contents do not. Something inside this jar is winning.";

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

// Validate the line against the competition gate.
if (LINE.length === 0) fail("line is empty");
if (LINE.trim().length === 0) fail("line is only whitespace");
if (LINE.includes("\n") || LINE.includes("\r")) {
  fail("line must be a single line");
}
if (LINE.length < 1 || LINE.length > 200) {
  fail(`line must be 1-200 characters, got ${LINE.length}`);
}

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outputDir, { recursive: true });

const outputPath = join(outputDir, "entry.txt");

// Write with NO trailing newline.
writeFileSync(outputPath, LINE, "utf8");

// Read back and verify byte-identical.
const written = readFileSync(outputPath, "utf8");
if (written !== LINE) fail("verification failed: output is not byte-identical");
// The gate counts characters; a stray newline or non-ASCII byte would
// change the file without changing the visible line, so check both.
if (written.endsWith("\n") || written.endsWith("\r")) {
  fail("verification failed: output has a trailing newline");
}
const byteLength = Buffer.byteLength(written, "utf8");
if (byteLength !== written.length) {
  fail(`verification failed: expected ASCII-only output, got ${byteLength} bytes for ${written.length} characters`);
}
console.log(`wrote ${outputPath}: ${written.length} characters, ${byteLength} bytes`);
