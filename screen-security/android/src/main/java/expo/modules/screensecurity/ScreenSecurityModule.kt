package expo.modules.screensecurity

import android.os.Build
import android.provider.Settings
import androidx.fragment.app.FragmentActivity
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ScreenSecurityModule : Module() {

  private val context
    get() = requireNotNull(appContext.reactContext)

  private fun isBiometricAuthenticationBlock(): suspend () -> Boolean = block@ {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) return@block false

    val ctx = requireNotNull(appContext.reactContext)
    if (!BiometricsHelper.isBiometricAvailable(ctx)) return@block false

    val activity = appContext.currentActivity as? FragmentActivity
    if (activity == null) return@block false

    BiometricsHelper.authenticate(ctx, activity)
  }

  override fun definition() = ModuleDefinition {
    Name("ScreenSecurity")

    Function("getDeviceId") {
      return@Function Settings.Secure.getString(context.contentResolver, Settings.Secure.ANDROID_ID)
        ?: ""
    }

    AsyncFunction("isBiometricAuthenticated").SuspendBody(isBiometricAuthenticationBlock())
  }
}
