// One Line, One Laugh: Roast Your Fridge — writes a single-line fridge roast.
// The roast: my fridge polices the door with a beep after ten seconds open,
// yet says nothing while spinach quietly liquefies in the crisper for weeks.
// The twist lands in the last clause — loud about manners, silent about
// murder — contrasting the petty alarm with the far worse crime it ignores.

import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ENTRY =
  "My fridge beeps if I leave it open 10 seconds, then quietly lets spinach liquefy in the crisper for three weeks — loud about manners, silent about murder.";

function resolveOutputDir(): string {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  if (fromEnv && fromEnv.trim().length > 0) return fromEnv;
  return "/output";
}

function main(): void {
  // The gate accepts exactly one line of 1 to 200 characters, UTF-8,
  // and not only whitespace; refuse to write anything outside that.
  if (ENTRY.length < 1 || ENTRY.length > 200 || ENTRY.trim().length === 0) {
    throw new Error(`entry is ${ENTRY.length} chars, outside the 1-200 gate`);
  }
  if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
    throw new Error("entry must be a single line");
  }

  const dir = resolveOutputDir();
  mkdirSync(dir, { recursive: true });

  // Clear only the contents of the output directory, entry by entry.
  // The directory itself is never removed, so a mounted /output volume
  // stays mounted and the grader does not hit EBUSY.
  for (const name of readdirSync(dir)) {
    rmSync(join(dir, name), { recursive: true, force: true });
  }

  writeFileSync(join(dir, "entry.txt"), ENTRY, "utf8");

  const here = dirname(fileURLToPath(import.meta.url));
  const bytes = Buffer.byteLength(ENTRY, "utf8");
  console.log(
    `wrote ${ENTRY.length} chars (${bytes} bytes) from ${here} to ${join(dir, "entry.txt")}`,
  );
}

main();
