package expo.modules.screensecurity

import android.content.Context
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import android.os.Build
import android.provider.Settings

class ScreenSecurityModule : Module() {
  private val context
    get() = requireNotNull(appContext.reactContext)

  override fun definition() = ModuleDefinition {
    Name("ScreenSecurity")

    Function("getDeviceId") {
      return@Function Settings.Secure.getString(context.contentResolver, Settings.Secure.ANDROID_ID)
        ?: ""
    }
  }
}
