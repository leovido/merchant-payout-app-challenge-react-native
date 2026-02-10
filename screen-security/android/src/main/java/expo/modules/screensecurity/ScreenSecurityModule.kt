package expo.modules.screensecurity

import android.app.Activity
import android.os.Build
import android.provider.Settings
import androidx.fragment.app.FragmentActivity
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ScreenSecurityModule : Module() {

  private val context
    get() = requireNotNull(appContext.reactContext)

  @Volatile
  private var screenCaptureCallback: Activity.ScreenCaptureCallback? = null

  @Volatile
  private var screenCaptureActivity: Activity? = null

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

    Events("onScreenshotTaken")

    OnStartObserving {
      if (Build.VERSION.SDK_INT < Build.VERSION_CODES.UPSIDE_DOWN_CAKE) return@OnStartObserving
      val activity = appContext.currentActivity ?: return@OnStartObserving
      val callback = Activity.ScreenCaptureCallback {
        sendEvent("onScreenshotTaken", emptyMap())
      }
      screenCaptureCallback = callback
      screenCaptureActivity = activity
      activity.registerScreenCaptureCallback(activity.mainExecutor, callback)
    }

    OnStopObserving {
      if (Build.VERSION.SDK_INT < Build.VERSION_CODES.UPSIDE_DOWN_CAKE) return@OnStopObserving
      val activity = screenCaptureActivity
      val callback = screenCaptureCallback
      if (activity != null && callback != null) {
        activity.unregisterScreenCaptureCallback(callback)
      }
      screenCaptureCallback = null
      screenCaptureActivity = null
    }

    Function("getDeviceId") {
      return@Function Settings.Secure.getString(context.contentResolver, Settings.Secure.ANDROID_ID)
        ?: ""
    }

    Function("simulateScreenshotEvent") {
      sendEvent("onScreenshotTaken", emptyMap())
    }

    AsyncFunction("isBiometricAuthenticated").SuspendBody(isBiometricAuthenticationBlock())
  }
}
