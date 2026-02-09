import { NativeModule, requireNativeModule } from "expo";

import type { ScreenSecurityModuleEvents } from "./ScreenSecurity.types";

declare class ScreenSecurityModule extends NativeModule<ScreenSecurityModuleEvents> {
	getDeviceId(): string;
}

export default requireNativeModule<ScreenSecurityModule>("ScreenSecurity");
