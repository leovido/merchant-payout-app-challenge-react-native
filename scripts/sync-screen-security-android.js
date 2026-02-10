/**
 * Syncs Android Kotlin sources from the workspace screen-security package
 * into the installed screen-security location (e.g. node_modules or pnpm store).
 * Needed because pnpm copies file: deps, so the build may not see files added
 * in the workspace (e.g. BiometricsHelper.kt) until they are synced.
 */
const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const workspaceScreenSecurity = path.join(projectRoot, "screen-security");
const relKotlinDir = path.join(
	"android",
	"src",
	"main",
	"java",
	"expo",
	"modules",
	"screensecurity",
);
const sourceDir = path.join(workspaceScreenSecurity, relKotlinDir);

if (!fs.existsSync(sourceDir)) {
	process.exit(0);
}

let installedScreenSecurity;
try {
	installedScreenSecurity = path.dirname(
		require.resolve("screen-security/package.json", { paths: [projectRoot] }),
	);
} catch {
	process.exit(0);
}

const targetDir = path.join(installedScreenSecurity, relKotlinDir);
if (
	path.relative(projectRoot, targetDir).startsWith("..") &&
	!targetDir.includes(projectRoot)
) {
	// target is outside project (e.g. pnpm store)
}
if (!fs.existsSync(targetDir)) {
	fs.mkdirSync(targetDir, { recursive: true });
}

for (const name of fs.readdirSync(sourceDir)) {
	if (name.endsWith(".kt")) {
		const src = path.join(sourceDir, name);
		const dest = path.join(targetDir, name);
		fs.copyFileSync(src, dest);
	}
}
