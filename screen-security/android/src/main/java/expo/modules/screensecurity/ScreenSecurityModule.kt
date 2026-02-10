package expo.modules.screensecurity

import android.os.Build
import android.provider.Settings
import androidx.biometric.BiometricManager
import androidx.biometric.BiometricPrompt
import androidx.fragment.app.FragmentActivity
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlinx.coroutines.withContext
import kotlin.coroutines.resume

class ScreenSecurityModule : Module() {
  private val context
    get() = requireNotNull(appContext.reactContext)

  override fun definition() = ModuleDefinition {
    Name("ScreenSecurity")

    Function("getDeviceId") {
      return@Function Settings.Secure.getString(context.contentResolver, Settings.Secure.ANDROID_ID)
        ?: ""
    }

    val isBiometricBlock: suspend () -> Boolean = block@ {
      if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) {
        return@block false
      }
      val ctx = requireNotNull(appContext.reactContext)
      val biometricManager = BiometricManager.from(ctx)
      val canAuthenticate = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
        biometricManager.canAuthenticate(BiometricManager.Authenticators.BIOMETRIC_STRONG) == BiometricManager.BIOMETRIC_SUCCESS
      } else {
        @Suppress("DEPRECATION")
        biometricManager.canAuthenticate() == BiometricManager.BIOMETRIC_SUCCESS
      }
      if (!canAuthenticate) {
        return@block false
      }
      withContext(Dispatchers.Main) {
        val activity = appContext.currentActivity as? FragmentActivity
        if (activity == null) {
          return@withContext false
        }
        suspendCancellableCoroutine { cont ->
          val executor = ctx.mainExecutor
          val callback = object : BiometricPrompt.AuthenticationCallback() {
            override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
              if (cont.isActive) cont.resume(true)
            }
            override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
              if (cont.isActive) cont.resume(false)
            }
            override fun onAuthenticationFailed() {
              // Don't resume here - user can retry; only resume on final success or error
            }
          }
          val promptInfoBuilder = BiometricPrompt.PromptInfo.Builder()
            .setTitle("Biometric authentication")
            .setSubtitle("Require biometric authentication for payments over £1,000.00")
            .setNegativeButtonText("Cancel")
          if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            promptInfoBuilder.setAllowedAuthenticators(BiometricManager.Authenticators.BIOMETRIC_STRONG)
          } else {
            @Suppress("DEPRECATION")
            promptInfoBuilder.setDeviceCredentialAllowed(false)
          }
          val promptInfo = promptInfoBuilder.build()
          val prompt = BiometricPrompt(activity, executor, callback)
          cont.invokeOnCancellation { prompt.cancelAuthentication() }
          prompt.authenticate(promptInfo)
        }
      }
    }
    AsyncFunction("isBiometricAuthenticated").SuspendBody(isBiometricBlock)
  }
}
