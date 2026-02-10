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
      guard context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &canEvaluateError) else {
        throw NSError(domain: "ScreenSecurity", code: 1, userInfo: [NSLocalizedDescriptionKey: "BIOMETRICS_NOT_ENROLLED"])
      }

      let reason = "Require biometric authentication for payments over £1,000.00"
      return try await withCheckedThrowingContinuation { (continuation: CheckedContinuation<Bool, Error>) in
        context.evaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, localizedReason: reason) { success, error in
          if success {
            continuation.resume(returning: true)
          } else {
            guard let error = error as? LAError else {
              continuation.resume(throwing: NSError(domain: "ScreenSecurity", code: 1, userInfo: [NSLocalizedDescriptionKey: "BIOMETRICS_NOT_ENROLLED", NSLocalizedFailureReasonErrorKey: "Biometrics not enrolled"]))
              return
            }

            // Handle only the cases that are relevant at the moment.
            // Adding more cases is easier, simply adding the necessary case and error message.
            switch error.code {
            case .authenticationFailed:
              continuation.resume(throwing: NSError(domain: "ScreenSecurity", code: 1, userInfo: [NSLocalizedDescriptionKey: "BIOMETRICS_AUTH_FAILED", NSLocalizedFailureReasonErrorKey: "Authentication failed"]))
            case .userCancel:
              continuation.resume(throwing: NSError(domain: "ScreenSecurity", code: 1, userInfo: [NSLocalizedDescriptionKey: "BIOMETRICS_USER_CANCEL", NSLocalizedFailureReasonErrorKey: "User cancelled"]))
            default:
              continuation.resume(throwing: NSError(domain: "ScreenSecurity", code: 1, userInfo: [NSLocalizedDescriptionKey: "BIOMETRICS_UNKNOWN_ERROR", NSLocalizedFailureReasonErrorKey: "Unknown error"]))
            }
          }
        }
      }
    }
  }
}
