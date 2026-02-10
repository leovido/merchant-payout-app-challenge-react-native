import ScreenSecurityModule from "./ScreenSecurityModule";

export default function getDeviceId(): string {
	return ScreenSecurityModule.getDeviceId();
}

export function isBiometricAuthenticated(): Promise<boolean> {
	return ScreenSecurityModule.isBiometricAuthenticated();
}
