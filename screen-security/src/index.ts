import type { EventSubscription } from "expo-modules-core";
import ScreenSecurityModule from "./ScreenSecurityModule";

export default function getDeviceId(): string {
	return ScreenSecurityModule.getDeviceId();
}

export function isBiometricAuthenticated(): Promise<boolean> {
	return ScreenSecurityModule.isBiometricAuthenticated();
}

export function addScreenshotListener(callback: () => void): EventSubscription {
	return ScreenSecurityModule.addListener("onScreenshotTaken", callback);
}
