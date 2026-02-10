import { NativeModule, requireNativeModule } from "expo";

import type { ScreenSecurityModuleEvents } from "./ScreenSecurity.types";

declare class ScreenSecurityModule extends NativeModule<ScreenSecurityModuleEvents> {
	getDeviceId(): string;
	isBiometricAuthenticated(): Promise<boolean>;
}

export default requireNativeModule<ScreenSecurityModule>("ScreenSecurity");
