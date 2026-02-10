package expo.modules.screensecurity

import android.content.Context
import android.os.Build
import androidx.biometric.BiometricManager
import androidx.biometric.BiometricPrompt
import androidx.fragment.app.FragmentActivity
import expo.modules.kotlin.exception.CodedException
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlinx.coroutines.withContext
import kotlin.coroutines.resume

object BiometricsHelper {

  const val ERROR_USER_CANCELED = 10
  const val ERROR_NO_BIOMETRICS = 11

  private const val PROMPT_TITLE = "Biometric authentication"
  private const val PROMPT_SUBTITLE = "Require biometric authentication for payments over £1,000.00"
  private const val PROMPT_NEGATIVE_BUTTON = "Cancel"

  fun isBiometricAvailable(context: Context): Boolean {
    val manager = BiometricManager.from(context)
    return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
      manager.canAuthenticate(BiometricManager.Authenticators.BIOMETRIC_STRONG) == BiometricManager.BIOMETRIC_SUCCESS
    } else {
      @Suppress("DEPRECATION")
      manager.canAuthenticate() == BiometricManager.BIOMETRIC_SUCCESS
    }
  }

  fun buildPromptInfo(): BiometricPrompt.PromptInfo {
    val builder = BiometricPrompt.PromptInfo.Builder()
      .setTitle(PROMPT_TITLE)
      .setSubtitle(PROMPT_SUBTITLE)
      .setNegativeButtonText(PROMPT_NEGATIVE_BUTTON)
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
      builder.setAllowedAuthenticators(BiometricManager.Authenticators.BIOMETRIC_STRONG)
    } else {
      @Suppress("DEPRECATION")
      builder.setDeviceCredentialAllowed(false)
    }
    return builder.build()
  }

  fun biometricsErrorCodeAndMessage(
    errorCode: Int,
    errString: CharSequence?,
  ): Pair<String, String> {
    val fallback = errString?.toString()?.ifBlank { null } ?: "Biometric authentication failed."
    return when (errorCode) {
      ERROR_USER_CANCELED ->
        "BIOMETRICS_USER_CANCEL" to "Biometric authentication was cancelled."
      ERROR_NO_BIOMETRICS ->
        "BIOMETRICS_NOT_ENROLLED" to "No biometrics are enrolled."
      else ->
        "BIOMETRICS_AUTH_FAILED" to fallback
    }
  }

  fun createAuthenticationCallback(
    cont: kotlinx.coroutines.CancellableContinuation<Boolean>,
  ): BiometricPrompt.AuthenticationCallback =
    object : BiometricPrompt.AuthenticationCallback() {
      override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
        if (cont.isActive) cont.resume(true)
      }

      override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
        if (cont.isActive) {
          val (code, message) = biometricsErrorCodeAndMessage(errorCode, errString)
          cont.resumeWith(Result.failure(CodedException(code, message, null)))
        }
      }

      override fun onAuthenticationFailed() {
        // Don't resume here; user can retry. Only success or onAuthenticationError ends the flow.
      }
    }

  suspend fun authenticate(context: Context, activity: FragmentActivity): Boolean =
    withContext(Dispatchers.Main) {
      suspendCancellableCoroutine { cont ->
        val promptInfo = buildPromptInfo()
        val callback = createAuthenticationCallback(cont)
        val prompt = BiometricPrompt(activity, context.mainExecutor, callback)

        cont.invokeOnCancellation { prompt.cancelAuthentication() }
        prompt.authenticate(promptInfo)
      }
    }
}
