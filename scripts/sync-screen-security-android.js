/**
 * Syncs native sources from the workspace `screen-security` package
 * into the installed package location under node_modules/.pnpm.
 *
 * Needed because `file:` deps are snapshot-copied by pnpm, so changes in the
 * workspace package (especially native source files) are not always reflected
 * in the installed copy used by builds.
 */
const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const workspaceScreenSecurity = path.join(projectRoot, "screen-security");

let installedScreenSecurity;
try {
	installedScreenSecurity = path.dirname(
		require.resolve("screen-security/package.json", { paths: [projectRoot] }),
	);
} catch {
	console.warn(
		"[sync-screen-security] screen-security not resolved in node_modules; skipping native sync. Run after install: pnpm run sync:screen-security",
	);
	process.exit(0);
}

function syncDirectory(relativeDir, extension) {
	const sourceDir = path.join(workspaceScreenSecurity, relativeDir);
	if (!fs.existsSync(sourceDir)) {
		return;
	}

	const targetDir = path.join(installedScreenSecurity, relativeDir);
	if (!fs.existsSync(targetDir)) {
		fs.mkdirSync(targetDir, { recursive: true });
	}

	for (const name of fs.readdirSync(sourceDir)) {
		if (name.endsWith(extension)) {
			const src = path.join(sourceDir, name);
			const dest = path.join(targetDir, name);
			fs.copyFileSync(src, dest);
		}
	}
}

syncDirectory(
	path.join(
		"android",
		"src",
		"main",
		"java",
		"expo",
		"modules",
		"screensecurity",
	),
	".kt",
);
syncDirectory(path.join("ios"), ".swift");
