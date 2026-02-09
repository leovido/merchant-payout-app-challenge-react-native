import ExpoModulesCore
import LocalAuthentication

public class ScreenSecurityModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ScreenSecurity")

    Function("getDeviceId") {
      return UIDevice.current.identifierForVendor?.uuidString ?? ""
    }

    AsyncFunction("isBiometricAuthenticated") {
      let context = LAContext()
      
      guard context.canEvaluatePolicy(.deviceOwnerAuthentication, error: nil) else {
        throw NSError(domain: "ScreenSecurity", code: 1, userInfo: [NSLocalizedDescriptionKey: "BIOMETRICS_NOT_ENROLLED"])
      }

      do {
        try await context.evaluatePolicy(.deviceOwnerAuthentication, localizedReason: "Require biometric authentication for payments over £1,000.00") { success, error in
        if success {
          return
        } else {
          return
        }
      }
      } catch {
        throw NSError(domain: "ScreenSecurity", code: 1, userInfo: [NSLocalizedDescriptionKey: error.localizedDescription])
      }
    }
  }
}
