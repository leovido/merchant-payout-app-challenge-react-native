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
      var canEvaluateError: NSError?
      guard context.canEvaluatePolicy(.deviceOwnerAuthentication, error: &canEvaluateError) else {
        throw NSError(domain: "ScreenSecurity", code: 1, userInfo: [NSLocalizedDescriptionKey: "BIOMETRICS_NOT_ENROLLED"])
      }

      let reason = "Require biometric authentication for payments over £1,000.00"
      return try await withCheckedThrowingContinuation { (continuation: CheckedContinuation<Bool, Error>) in
        context.evaluatePolicy(.deviceOwnerAuthentication, localizedReason: reason) { success, error in
          if let error = error {
            continuation.resume(throwing: NSError(domain: "ScreenSecurity", code: 1, userInfo: [NSLocalizedDescriptionKey: error.localizedDescription]))
            return
          }
          continuation.resume(returning: success)
        }
      }
    }
  }
}
