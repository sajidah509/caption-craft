/**
 * Complete Android Project Files for Google Play Store APK/AAB Release
 */

export const ANDROID_MANIFEST_XML = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.socialcaption">

    <!-- Permissions required for network access and voice-to-text recording -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />

    <!-- Package Visibility Queries for Android 11+ (API 30+) to deep link and share -->
    <queries>
        <package android:name="com.instagram.android" />
        <package android:name="com.facebook.katana" />
        <intent>
            <action android:name="android.intent.action.SEND" />
            <data android:mimeType="text/plain" />
        </intent>
        <intent>
            <action android:name="android.speech.action.RECOGNIZE_SPEECH" />
        </intent>
    </queries>

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.SocialCaption">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:label="@string/app_name"
            android:theme="@style/Theme.SocialCaption"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
`;

export const BUILD_GRADLE_KTS = `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "com.example.socialcaption"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.example.socialcaption"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }

        // Pass Gemini API key from local.properties into BuildConfig
        buildConfigField("String", "GEMINI_API_KEY", "\\"\${project.findProperty(\\"GEMINI_API_KEY\\") ?: \\"\\"}\\"")
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            signingConfig = signingConfigs.getByName("debug") // Replace with your production release signing key
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    buildFeatures {
        compose = true
        buildConfig = true
    }
}

dependencies {
    // AndroidX & Lifecycle
    implementation(platform("androidx.compose:compose-bom:2024.10.01"))
    implementation("androidx.core:core-ktx:1.15.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.8.7")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.8.7")
    implementation("androidx.activity:activity-compose:1.9.3")

    // Material 3 Compose
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.material:material-icons-extended")

    // Coil Image Loader for Compose
    implementation("io.coil-kt:coil-compose:2.7.0")

    // Google Gemini Android SDK
    implementation("com.google.ai.client.generativeai:generativeai:0.9.0")

    // Coroutines & JSON
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.9.0")
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.7.3")

    // Testing
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.2.1")
    androidTestImplementation(platform("androidx.compose:compose-bom:2024.10.01"))
    androidTestImplementation("androidx.compose.ui:ui-test-junit4")
    debugImplementation("androidx.compose.ui:ui-tooling")
    debugImplementation("androidx.compose.ui:ui-test-manifest")
}
`;

export const REPOSITORY_KT = `package com.example.socialcaption

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.net.Uri
import com.google.ai.client.generativeai.GenerativeModel
import com.google.ai.client.generativeai.type.content
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONObject

object Repository {

    /**
     * Calls Google Gemini 3.8 Flash SDK to analyze the image bitmap
     * along with optional custom voice vibe and returns structured captions & hashtags.
     */
    suspend fun generateCaptionsForImage(
        context: Context,
        imageUri: Uri,
        customVibe: String = ""
    ): CaptionsResult = withContext(Dispatchers.IO) {
        val apiKey = BuildConfig.GEMINI_API_KEY.ifEmpty {
            // Read from secure preferences or BuildConfig
            System.getenv("GEMINI_API_KEY") ?: ""
        }

        val generativeModel = GenerativeModel(
            modelName = "gemini-3.8-flash",
            apiKey = apiKey
        )

        // Decode bitmap from Uri with downsampling for network efficiency
        val bitmap = decodeBitmapFromUri(context, imageUri, maxDimension = 1024)
            ?: throw IllegalArgumentException("Could not decode image from selected URI")

        val prompt = buildString {
            appendLine("Analyze the visual subject, composition, and mood of this image.")
            appendLine("Return a valid JSON object with:")
            appendLine("1. 'funny': A witty, humorous, or meme-style caption")
            appendLine("2. 'professional': A polished storytelling caption for LinkedIn or brand portfolio")
            appendLine("3. 'question': An engaging question designed to spark comments and discussion")
            appendLine("4. 'hashtags': An array of exactly 10 relevant hashtags starting with #")
            if (customVibe.isNotBlank()) {
                appendLine("CUSTOM USER VIBE / PROMPT:")
                appendLine("\\"\$customVibe\\"")
                appendLine("Carefully customize the tone, theme, and vocabulary of all captions to match this vibe!")
            }
            appendLine("Respond ONLY with valid JSON.")
        }

        val response = generativeModel.generateContent(
            content {
                image(bitmap)
                text(prompt)
            }
        )

        val rawJson = response.text ?: "{}"
        val cleanJson = extractJson(rawJson)
        val jsonObject = JSONObject(cleanJson)

        val funny = jsonObject.optString("funny", "When you're trying to look casual but the camera caught everything.")
        val professional = jsonObject.optString("professional", "Moments that inspire intentional focus and authentic storytelling.")
        val question = jsonObject.optString("question", "What is the first thing that caught your eye in this frame?")

        val tagsArray = jsonObject.optJSONArray("hashtags")
        val hashtags = mutableListOf<String>()
        if (tagsArray != null) {
            for (i in 0 until tagsArray.length()) {
                val tag = tagsArray.getString(i).trim()
                val formatted = if (tag.startsWith("#")) tag else "#\$tag"
                if (formatted.length > 1) {
                    hashtags.add(formatted.replace(" ", ""))
                }
            }
        }

        // Ensure 10 tags
        while (hashtags.size < 10) {
            hashtags.add("#DailyInspiration")
        }

        CaptionsResult(
            funny = funny,
            professional = professional,
            question = question,
            hashtags = hashtags.take(10)
        )
    }

    private fun decodeBitmapFromUri(context: Context, uri: Uri, maxDimension: Int): Bitmap? {
        val inputStream = context.contentResolver.openInputStream(uri) ?: return null
        val options = BitmapFactory.Options().apply {
            inJustDecodeBounds = true
        }
        BitmapFactory.decodeStream(inputStream, null, options)
        inputStream.close()

        val sampleSize = calculateInSampleSize(options, maxDimension, maxDimension)
        val secondStream = context.contentResolver.openInputStream(uri) ?: return null
        val decodeOptions = BitmapFactory.Options().apply {
            inSampleSize = sampleSize
        }
        val bitmap = BitmapFactory.decodeStream(secondStream, null, decodeOptions)
        secondStream.close()
        return bitmap
    }

    private fun calculateInSampleSize(options: BitmapFactory.Options, reqWidth: Int, reqHeight: Int): Int {
        val (height: Int, width: Int) = options.outHeight to options.outWidth
        var inSampleSize = 1
        if (height > reqHeight || width > reqWidth) {
            val halfHeight: Int = height / 2
            val halfWidth: Int = width / 2
            while (halfHeight / inSampleSize >= reqHeight && halfWidth / inSampleSize >= reqWidth) {
                inSampleSize *= 2
            }
        }
        return inSampleSize
    }

    private fun extractJson(raw: String): String {
        val startIndex = raw.indexOf('{')
        val endIndex = raw.lastIndexOf('}')
        return if (startIndex != -1 && endIndex != -1 && endIndex > startIndex) {
            raw.substring(startIndex, endIndex + 1)
        } else {
            raw
        }
    }
}
`;

export const THEME_KT = `package com.example.socialcaption

import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext

private val DarkColorScheme = darkColorScheme(
    primary = Color(0xFFD0BCFF),
    onPrimary = Color(0xFF381E72),
    primaryContainer = Color(0xFF4F378B),
    onPrimaryContainer = Color(0xFFEADDFF),
    secondary = Color(0xFFCCC2DC),
    onSecondary = Color(0xFF332D41),
    background = Color(0xFF141218),
    onBackground = Color(0xFFE6E0E9),
    surface = Color(0xFF141218),
    onSurface = Color(0xFFE6E0E9),
    surfaceVariant = Color(0xFF2B2930),
    onSurfaceVariant = Color(0xFFCAC4D0),
    outline = Color(0xFF938F99)
)

private val LightColorScheme = lightColorScheme(
    primary = Color(0xFF6750A4),
    onPrimary = Color(0xFFFFFFFF),
    primaryContainer = Color(0xFFEADDFF),
    onPrimaryContainer = Color(0xFF21005D),
    secondary = Color(0xFF625B71),
    onSecondary = Color(0xFFFFFFFF),
    background = Color(0xFFFEF7FF),
    onBackground = Color(0xFF1D1B20),
    surface = Color(0xFFFEF7FF),
    onSurface = Color(0xFF1D1B20),
    surfaceVariant = Color(0xFFE7E0EC),
    onSurfaceVariant = Color(0xFF49454F),
    outline = Color(0xFF79747E)
)

@Composable
fun SocialCaptionTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = true,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }
        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography(),
        content = content
    )
}
`;

export const PLAYSTORE_CHECKLIST = [
  {
    category: "1. Keystore & App Signing",
    items: [
      "Generate release upload keystore: `keytool -genkey -v -keystore release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias captioncraft`",
      "Store keystore password & alias securely (e.g. in local.properties or CI/CD environment secrets)",
      "Enable Google Play App Signing in the Play Console to let Google manage app distribution keys",
    ],
  },
  {
    category: "2. Build Production AAB (Android App Bundle)",
    items: [
      "Run `./gradlew bundleRelease` in your Android Studio project root",
      "The bundle output will be generated at `app/build/outputs/bundle/release/app-release.aab`",
      "Ensure ProGuard minification & resource shrinking are enabled (configured in build.gradle.kts)",
    ],
  },
  {
    category: "3. Google Play Store Console Requirements",
    items: [
      "Target SDK: Set to 35 (Android 15) as required for all new apps submitted to Google Play",
      "App Content / Privacy Policy: Link your privacy policy covering microphone access for voice transcription",
      "Data Safety Form: Declare that voice data is transcribed for user prompts and not shared with 3rd-party advertisers",
      "Store Listing Assets: High-res App Icon (512x512 PNG), Feature Graphic (1024x500 PNG), at least 2 phone screenshots",
    ],
  },
];
