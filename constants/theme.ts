/**
 * Design system tokens derived from docs/ios and docs/android reference designs.
 * Colors, typography, spacing, and radii for light theme (dark mirrors for compatibility).
 */

import { Platform, type ViewStyle } from "react-native";

// ---------------------------------------------------------------------------
// Semantic color palette (light theme – primary reference from docs)
// ---------------------------------------------------------------------------

const lightColors = {
	backgroundPrimary: "#F2F2F2",
	backgroundSecondary: "#FFFFFF",
	textPrimary: "#1A1A1A",
	textSecondary: "#555555",
	textPlaceholder: "#A0A0A0",
	primary: "#0096AA",
	success: "#27AE60",
	error: "#EB5757",
	border: "#D5D5D5",
	buttonSecondaryBackground: "#EBEBEB",
	/** Gray for disabled primary buttons (e.g. Confirm) */
	buttonDisabledBackground: "#DFDFDF",
	/** Text color for disabled primary buttons */
	buttonDisabledText: "#B9B9B9",
	buttonLinkBackground: "#EBF5FF",
	/** Show more button (e.g. Recent Activity) */
	showMoreButtonBackground: "#E3F1F6",
	showMoreButtonText: "#4787DE",
	tabInactive: "#8C8C8C",
	overlay: "rgba(0,0,0,0.5)",
} as const;

const darkColors = {
	backgroundPrimary: "#151718",
	backgroundSecondary: "#1C1E1F",
	textPrimary: "#ECEDEE",
	textSecondary: "#9BA1A6",
	textPlaceholder: "#687076",
	primary: "#00B4CC",
	success: "#34C759",
	error: "#FF453A",
	border: "#2C2E2F",
	buttonSecondaryBackground: "#2C2E2F",
	buttonDisabledBackground: "#3A3D3F",
	buttonDisabledText: "#6B6B6B",
	buttonLinkBackground: "rgba(0, 180, 204, 0.15)",
	showMoreButtonBackground: "rgba(71, 135, 222, 0.15)",
	showMoreButtonText: "#6BA3F5",
	tabInactive: "#9BA1A6",
	overlay: "rgba(0,0,0,0.6)",
} as const;

export const SemanticColors = {
	light: lightColors,
	dark: darkColors,
} as const;

// ---------------------------------------------------------------------------
// Legacy exports (aliased for incremental migration)
// ---------------------------------------------------------------------------

const tintColorLight = lightColors.primary;
const tintColorDark = darkColors.primary;

/** @deprecated Use SemanticColors.light.backgroundPrimary */
export const BACKGROUND_COLOR_LIGHT = lightColors.backgroundPrimary;

/** @deprecated Use SemanticColors.light.primary */
export const TINT_COLOR_LIGHT = tintColorLight;

/** @deprecated Use SemanticColors.light.error */
export const ERROR_RED = lightColors.error;

/** @deprecated Use SemanticColors.light.overlay */
export const MODAL_OVERLAY = lightColors.overlay;

/** @deprecated Use SemanticColors.light.border */
export const INPUT_BORDER_LIGHT = lightColors.border;

/** @deprecated Use SemanticColors.light.backgroundSecondary */
export const SURFACE_WHITE = lightColors.backgroundSecondary;

export const Colors = {
	light: {
		text: lightColors.textPrimary,
		background: lightColors.backgroundSecondary,
		tint: tintColorLight,
		icon: lightColors.textSecondary,
		tabIconDefault: lightColors.tabInactive,
		tabIconSelected: tintColorLight,
	},
	dark: {
		text: darkColors.textPrimary,
		background: darkColors.backgroundSecondary,
		tint: tintColorDark,
		icon: darkColors.textSecondary,
		tabIconDefault: darkColors.tabInactive,
		tabIconSelected: tintColorDark,
	},
};

// ---------------------------------------------------------------------------
// Typography scale (from docs mocks)
// ---------------------------------------------------------------------------

export const Typography = {
	/** Screen title e.g. "Business Account", "Send Payout" */
	title: { fontSize: 28, fontWeight: "700" as const, lineHeight: 34 },
	/** Section / modal title */
	sectionTitle: { fontSize: 20, fontWeight: "700" as const, lineHeight: 26 },
	/** Form labels, semibold */
	label: { fontSize: 16, fontWeight: "600" as const, lineHeight: 22 },
	/** Body and input value */
	body: { fontSize: 16, fontWeight: "400" as const, lineHeight: 24 },
	/** Hint, caption, dates, tab labels */
	hint: { fontSize: 12, fontWeight: "400" as const, lineHeight: 16 },
	/** Balance amounts */
	balance: { fontSize: 24, fontWeight: "700" as const, lineHeight: 30 },
	/** Link / action text (use with primary color) */
	link: { fontSize: 16, fontWeight: "600" as const, lineHeight: 24 },
	/** Default fallback */
	default: { fontSize: 16, fontWeight: "400" as const, lineHeight: 24 },
} as const;

// ---------------------------------------------------------------------------
// Spacing scale (generic + semantic aliases)
// ---------------------------------------------------------------------------

const spacingScale = {
	xs: 4,
	sm: 8,
	md: 12,
	lg: 16,
	xl: 20,
	"2xl": 24,
} as const;

export const Spacing = {
	...spacingScale,
	// Semantic aliases (derived from scale)
	screenPaddingHorizontal: spacingScale.xl,
	sectionGap: spacingScale["2xl"],
	labelInputGap: spacingScale.sm,
	fieldGap: spacingScale.lg,
	listItemPaddingVertical: spacingScale.md,
	sectionPaddingVertical: spacingScale.lg,
	modalPadding: spacingScale["2xl"],
} as const;

// ---------------------------------------------------------------------------
// Border radius
// ---------------------------------------------------------------------------

export const BorderRadius = {
	input: 8,
	button: 8,
	modal: 12,
} as const;

// ---------------------------------------------------------------------------
// Shadows (for modal etc.)
// ---------------------------------------------------------------------------

export const Shadows: Record<string, ViewStyle> = {
	modal:
		Platform.OS === "ios"
			? {
					shadowColor: "#000",
					shadowOffset: { width: 0, height: 2 },
					shadowOpacity: 0.1,
					shadowRadius: 8,
					elevation: 4,
				}
			: { elevation: 4 },
};

// ---------------------------------------------------------------------------
// Fonts (platform-specific family names)
// ---------------------------------------------------------------------------

export const Fonts = Platform.select({
	ios: {
		sans: "system-ui",
		serif: "ui-serif",
		rounded: "ui-rounded",
		mono: "ui-monospace",
	},
	default: {
		sans: "normal",
		serif: "serif",
		rounded: "normal",
		mono: "monospace",
	},
	web: {
		sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
		serif: "Georgia, 'Times New Roman', serif",
		rounded:
			"'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
		mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
	},
});
