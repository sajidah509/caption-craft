export interface CaptionResponse {
  funny: string;
  professional: string;
  question: string;
  hashtags: string[];
}

export const DEFAULT_FALLBACK_TAGS = [
  "#Photography",
  "#VisualStorytelling",
  "#MomentsInTime",
  "#InstaDaily",
  "#CreativePerspective",
  "#AestheticVibes",
  "#CaptureTheMoment",
  "#DailyInspiration",
  "#ContentCreator",
  "#SocialMediaLife",
];

/**
 * Normalizes an array of hashtags:
 * - Trims whitespace
 * - Ensures single leading '#'
 * - Deduplicates
 * - Ensures exactly 10 tags (padding if needed, slicing if excess)
 */
export function sanitizeHashtags(tags: string[] = []): string[] {
  const cleaned: string[] = [];
  const seen = new Set<string>();

  for (const raw of tags) {
    if (!raw) continue;
    let tag = raw.trim();
    if (!tag.startsWith("#")) {
      tag = `#${tag}`;
    }
    // Remove internal spaces
    tag = tag.replace(/\s+/g, "");
    const lower = tag.toLowerCase();

    if (tag.length > 1 && !seen.has(lower)) {
      seen.add(lower);
      cleaned.push(tag);
    }
    if (cleaned.length === 10) break;
  }

  // Pad up to 10 if we have fewer
  let fallbackIndex = 0;
  while (cleaned.length < 10 && fallbackIndex < DEFAULT_FALLBACK_TAGS.length) {
    const fallbackTag = DEFAULT_FALLBACK_TAGS[fallbackIndex];
    if (!seen.has(fallbackTag.toLowerCase())) {
      seen.add(fallbackTag.toLowerCase());
      cleaned.push(fallbackTag);
    }
    fallbackIndex++;
  }

  return cleaned.slice(0, 10);
}

/**
 * Formats a caption and hashtags into a clean copyable post format
 */
export function formatSocialPost(caption: string, hashtags: string[] = []): string {
  const cleanCaption = (caption || "").trim();
  const validTags = sanitizeHashtags(hashtags);
  if (validTags.length === 0) return cleanCaption;
  return `${cleanCaption}\n\n${validTags.join(" ")}`;
}

/**
 * Formats auto-fill caption tailored specifically for Instagram:
 * - Aesthetic hook
 * - Spaced paragraph structure
 * - Call to action (Save & Share)
 * - Dot line breaks before the 10 hashtags
 */
export function formatInstagramAutoFill(
  caption: string,
  hashtags: string[] = [],
  cta = "Save this for later & tag someone who needs to see this! ✨"
): string {
  const text = (caption || "").trim();
  const tags = sanitizeHashtags(hashtags).join(" ");
  return `${text}\n\n${cta}\n.\n.\n${tags}`;
}

/**
 * Formats auto-fill caption tailored specifically for Facebook:
 * - Conversational flow
 * - Engaging discussion question
 * - Comment & share CTA
 * - Curated top hashtags (3-5 tags, ideal for Facebook feed algorithm)
 */
export function formatFacebookAutoFill(
  primaryCaption: string,
  questionCaption: string,
  hashtags: string[] = []
): string {
  const body = (primaryCaption || "").trim();
  const question = (questionCaption || "").trim();
  const curatedTags = sanitizeHashtags(hashtags).slice(0, 4).join(" ");

  const lines = [body];
  if (question && question !== body) {
    lines.push(`\n${question} 👇`);
  }
  lines.push("\nShare your thoughts below or share this with a friend! 💬");
  if (curatedTags) {
    lines.push(`\n${curatedTags}`);
  }

  return lines.join("\n");
}

/**
 * Calculates word, character, and engagement stats
 */
export function getCaptionStats(text: string) {
  const trimmed = (text || "").trim();
  const charCount = trimmed.length;
  const wordCount = trimmed ? trimmed.split(/\s+/).length : 0;
  return {
    charCount,
    wordCount,
    readingTimeSeconds: Math.max(1, Math.ceil(wordCount / 3.5)),
  };
}

/**
 * Jetpack Compose Kotlin source code generator for the Android app
 */
export function getJetpackComposeSourceCode(): string {
  return `package com.example.socialcaption

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.*
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import coil.compose.AsyncImage
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

/**
 * Single-Activity Android Application using Jetpack Compose (Material 3).
 * Features:
 * - Image picker from device gallery
 * - Gemini API multimodal caption generation (Funny, Professional, Question + 10 Hashtags)
 * - Instagram & Facebook Auto-Fill Post Formatter
 * - Direct Android Share Intent integration
 */
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            SocialCaptionTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    CaptionGeneratorScreen()
                }
            }
        }
    }
}

enum class SocialPlatform {
    INSTAGRAM,
    FACEBOOK
}

data class CaptionsResult(
    val funny: String,
    val professional: String,
    val question: String,
    val hashtags: List<String>
) {
    fun formatAutoFill(platform: SocialPlatform, selectedTone: String = funny): String {
        return when (platform) {
            SocialPlatform.INSTAGRAM -> {
                "$selectedTone\\n\\nSave this for later & share with a friend! ✨\\n.\\n.\\n\${hashtags.joinToString(" ")}"
            }
            SocialPlatform.FACEBOOK -> {
                "$selectedTone\\n\\n$question 👇\\n\\nShare your thoughts below or share this with friends! 💬\\n\\n\${hashtags.take(4).joinToString(" ")}"
            }
        }
    }
}

sealed interface UiState {
    object Idle : UiState
    object Loading : UiState
    data class Success(val result: CaptionsResult) : UiState
    data class Error(val message: String) : UiState
}

class CaptionViewModel : ViewModel() {
    private val _uiState = MutableStateFlow<UiState>(UiState.Idle)
    val uiState: StateFlow<UiState> = _uiState.asStateFlow()

    private val _selectedImageUri = MutableStateFlow<Uri?>(null)
    val selectedImageUri: StateFlow<Uri?> = _selectedImageUri.asStateFlow()

    private val _customVibe = MutableStateFlow("")
    val customVibe: StateFlow<String> = _customVibe.asStateFlow()

    fun onImageSelected(uri: Uri?) {
        _selectedImageUri.value = uri
        _uiState.value = UiState.Idle
    }

    fun onVibeChange(vibe: String) {
        _customVibe.value = vibe
    }

    fun generateCaptions(context: android.content.Context) {
        val uri = _selectedImageUri.value ?: return
        viewModelScope.launch {
            _uiState.value = UiState.Loading
            try {
                // In production: calls repository to query Gemini 3.8 Flash with customVibe prompt
                val captions = Repository.generateCaptionsForImage(context, uri, _customVibe.value)
                _uiState.value = UiState.Success(captions)
            } catch (e: Exception) {
                _uiState.value = UiState.Error(e.localizedMessage ?: "Failed to generate captions")
            }
        }
    }

    fun shareToSocial(context: android.content.Context, text: String, platform: SocialPlatform) {
        val sendIntent = Intent().apply {
            action = Intent.ACTION_SEND
            putExtra(Intent.EXTRA_TEXT, text)
            type = "text/plain"
            val packageName = if (platform == SocialPlatform.INSTAGRAM) {
                "com.instagram.android"
            } else {
                "com.facebook.katana"
            }
            setPackage(packageName)
        }
        try {
            context.startActivity(sendIntent)
        } catch (e: Exception) {
            // Fallback generic share chooser if dedicated app not installed
            val chooser = Intent.createChooser(
                Intent().apply {
                    action = Intent.ACTION_SEND
                    putExtra(Intent.EXTRA_TEXT, text)
                    type = "text/plain"
                },
                "Share to \${platform.name.lowercase().replaceFirstChar { it.uppercase() }}"
            )
            context.startActivity(chooser)
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CaptionGeneratorScreen(
    viewModel: CaptionViewModel = androidx.lifecycle.viewmodel.compose.viewModel()
) {
    val context = LocalContext.current
    val clipboardManager = LocalClipboardManager.current
    val uiState by viewModel.uiState.collectAsState()
    val selectedImageUri by viewModel.selectedImageUri.collectAsState()

    var activePlatform by remember { mutableStateOf(SocialPlatform.INSTAGRAM) }

    val photoPickerLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.PickVisualMedia(),
        onResult = { uri -> viewModel.onImageSelected(uri) }
    )

    Scaffold(
        topBar = {
            CenterAlignedTopAppBar(
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.AutoAwesome,
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.size(24.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "CaptionCraft AI",
                            fontWeight = FontWeight.Bold,
                            style = MaterialTheme.typography.titleLarge
                        )
                    }
                },
                colors = TopAppBarDefaults.centerAlignedTopAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surfaceColorAtElevation(3.dp)
                )
            )
        }
    ) { innerPadding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
            contentPadding = PaddingValues(vertical = 16.dp)
        ) {
            // Gallery Image Picker Card
            item {
                ElevatedCard(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(24.dp),
                    colors = CardDefaults.elevatedCardColors(
                        containerColor = MaterialTheme.colorScheme.surfaceVariant
                    )
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        horizontalAlignment = Alignment.CenterVertically
                    ) {
                        if (selectedImageUri != null) {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(260.dp)
                                    .clip(RoundedCornerShape(16.dp))
                            ) {
                                AsyncImage(
                                    model = selectedImageUri,
                                    contentDescription = "Selected Gallery Image",
                                    contentScale = ContentScale.Crop,
                                    modifier = Modifier.fillMaxSize()
                                )
                            }
                            Spacer(modifier = Modifier.height(12.dp))
                            FilledTonalButton(
                                onClick = {
                                    photoPickerLauncher.launch(
                                        PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly)
                                    )
                                },
                                shape = RoundedCornerShape(12.dp)
                            ) {
                                Icon(Icons.Default.PhotoLibrary, contentDescription = null)
                                Spacer(modifier = Modifier.width(8.dp))
                                Text("Change Gallery Photo")
                            }
                        } else {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(180.dp)
                                    .border(
                                        width = 2.dp,
                                        color = MaterialTheme.colorScheme.outlineVariant,
                                        shape = RoundedCornerShape(16.dp)
                                    )
                                    .clickable {
                                        photoPickerLauncher.launch(
                                            PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly)
                                        )
                                    },
                                contentAlignment = Alignment.Center
                            ) {
                                Column(horizontalAlignment = Alignment.CenterVertically) {
                                    Icon(
                                        imageVector = Icons.Outlined.AddPhotoAlternate,
                                        contentDescription = "Select from Gallery",
                                        tint = MaterialTheme.colorScheme.primary,
                                        modifier = Modifier.size(48.dp)
                                    )
                                    Spacer(modifier = Modifier.height(8.dp))
                                    Text(
                                        text = "Select Image from Gallery",
                                        style = MaterialTheme.typography.bodyLarge,
                                        fontWeight = FontWeight.Medium
                                    )
                                }
                            }
                        }
                    }
                }
            }

            // 'Generate Captions' Button
            item {
                Button(
                    onClick = { viewModel.generateCaptions(context) },
                    enabled = selectedImageUri != null && uiState !is UiState.Loading,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(56.dp),
                    shape = RoundedCornerShape(16.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = MaterialTheme.colorScheme.primary
                    )
                ) {
                    if (uiState is UiState.Loading) {
                        CircularProgressIndicator(
                            color = MaterialTheme.colorScheme.onPrimary,
                            modifier = Modifier.size(24.dp),
                            strokeWidth = 2.5.dp
                        )
                        Spacer(modifier = Modifier.width(12.dp))
                        Text("Analyzing with Gemini AI...", fontSize = 16.sp)
                    } else {
                        Icon(Icons.Default.AutoAwesome, contentDescription = null)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Generate Captions",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                }
            }

            // Results Section + Platform Auto-Fill
            when (val state = uiState) {
                is UiState.Success -> {
                    // Platform Auto-Fill Card (Instagram & Facebook)
                    item {
                        ElevatedCard(
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(20.dp),
                            colors = CardDefaults.elevatedCardColors(
                                containerColor = MaterialTheme.colorScheme.primaryContainer
                            )
                        ) {
                            Column(modifier = Modifier.padding(16.dp)) {
                                Text(
                                    text = "Auto-Fill Platform Caption",
                                    fontWeight = FontWeight.Bold,
                                    style = MaterialTheme.typography.titleMedium,
                                    color = MaterialTheme.colorScheme.onPrimaryContainer
                                )
                                Spacer(modifier = Modifier.height(12.dp))
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    FilterChip(
                                        selected = activePlatform == SocialPlatform.INSTAGRAM,
                                        onClick = { activePlatform = SocialPlatform.INSTAGRAM },
                                        label = { Text("Instagram Auto-Fill") },
                                        leadingIcon = { Icon(Icons.Default.CameraAlt, contentDescription = null) }
                                    )
                                    FilterChip(
                                        selected = activePlatform == SocialPlatform.FACEBOOK,
                                        onClick = { activePlatform = SocialPlatform.FACEBOOK },
                                        label = { Text("Facebook Auto-Fill") },
                                        leadingIcon = { Icon(Icons.Default.ThumbUp, contentDescription = null) }
                                    )
                                }
                                Spacer(modifier = Modifier.height(12.dp))
                                val autoFilledText = state.result.formatAutoFill(activePlatform)
                                Surface(
                                    shape = RoundedCornerShape(12.dp),
                                    color = MaterialTheme.colorScheme.surface,
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    Text(
                                        text = autoFilledText,
                                        modifier = Modifier.padding(12.dp),
                                        style = MaterialTheme.typography.bodyMedium
                                    )
                                }
                                Spacer(modifier = Modifier.height(12.dp))
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.End
                                ) {
                                    OutlinedButton(
                                        onClick = {
                                            clipboardManager.setText(AnnotatedString(autoFilledText))
                                            Toast.makeText(context, "Auto-filled \${activePlatform.name} caption copied!", Toast.LENGTH_SHORT).show()
                                        }
                                    ) {
                                        Icon(Icons.Default.ContentCopy, contentDescription = null, modifier = Modifier.size(16.dp))
                                        Spacer(modifier = Modifier.width(6.dp))
                                        Text("Copy")
                                    }
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Button(
                                        onClick = {
                                            viewModel.shareToSocial(context, autoFilledText, activePlatform)
                                        }
                                    ) {
                                        Icon(Icons.Default.Share, contentDescription = null, modifier = Modifier.size(16.dp))
                                        Spacer(modifier = Modifier.width(6.dp))
                                        Text("Share / Open App")
                                    }
                                }
                            }
                        }
                    }

                    // 1. Funny Caption Card
                    item {
                        CaptionCard(
                            title = "Funny & Playful",
                            icon = Icons.Default.Mood,
                            badgeColor = Color(0xFFFFB74D),
                            text = state.result.funny,
                            onCopy = {
                                clipboardManager.setText(AnnotatedString(state.result.funny))
                                Toast.makeText(context, "Funny caption copied!", Toast.LENGTH_SHORT).show()
                            }
                        )
                    }

                    // 2. Professional Caption Card
                    item {
                        CaptionCard(
                            title = "Professional & Inspiring",
                            icon = Icons.Default.WorkOutline,
                            badgeColor = Color(0xFF64B5F6),
                            text = state.result.professional,
                            onCopy = {
                                clipboardManager.setText(AnnotatedString(state.result.professional))
                                Toast.makeText(context, "Professional caption copied!", Toast.LENGTH_SHORT).show()
                            }
                        )
                    }

                    // 3. Question-Based Caption Card
                    item {
                        CaptionCard(
                            title = "Question & Engagement",
                            icon = Icons.Default.HelpOutline,
                            badgeColor = Color(0xFF81C784),
                            text = state.result.question,
                            onCopy = {
                                clipboardManager.setText(AnnotatedString(state.result.question))
                                Toast.makeText(context, "Question caption copied!", Toast.LENGTH_SHORT).show()
                            }
                        )
                    }

                    // 4. 10 Relevant Hashtags Card
                    item {
                        HashtagsCard(
                            hashtags = state.result.hashtags,
                            onCopyAll = {
                                val allTags = state.result.hashtags.joinToString(" ")
                                clipboardManager.setText(AnnotatedString(allTags))
                                Toast.makeText(context, "All 10 hashtags copied!", Toast.LENGTH_SHORT).show()
                            },
                            onCopyTag = { tag ->
                                clipboardManager.setText(AnnotatedString(tag))
                                Toast.makeText(context, "Copied $tag", Toast.LENGTH_SHORT).show()
                            }
                        )
                    }
                }
                is UiState.Error -> {
                    item {
                        Card(
                            colors = CardDefaults.cardColors(
                                containerColor = MaterialTheme.colorScheme.errorContainer
                            ),
                            shape = RoundedCornerShape(16.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(
                                modifier = Modifier.padding(16.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(Icons.Default.ErrorOutline, contentDescription = null, tint = MaterialTheme.colorScheme.error)
                                Spacer(modifier = Modifier.width(12.dp))
                                Text(
                                    text = state.message,
                                    color = MaterialTheme.colorScheme.onErrorContainer
                                )
                            }
                        }
                    }
                }
                else -> {}
            }
        }
    }
}

@Composable
fun CaptionCard(
    title: String,
    icon: ImageVector,
    badgeColor: Color,
    text: String,
    onCopy: () -> Unit
) {
    ElevatedCard(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(18.dp),
        colors = CardDefaults.elevatedCardColors(
            containerColor = MaterialTheme.colorScheme.surface
        )
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(32.dp)
                            .background(badgeColor.copy(alpha = 0.2f), CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(icon, contentDescription = null, tint = badgeColor, modifier = Modifier.size(18.dp))
                    }
                    Spacer(modifier = Modifier.width(10.dp))
                    Text(text = title, fontWeight = FontWeight.SemiBold, fontSize = 15.sp)
                }
                FilledTonalIconButton(
                    onClick = onCopy,
                    modifier = Modifier.size(36.dp)
                ) {
                    Icon(Icons.Outlined.ContentCopy, contentDescription = "Copy", modifier = Modifier.size(18.dp))
                }
            }
            Spacer(modifier = Modifier.height(12.dp))
            Text(
                text = text,
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onSurface,
                lineHeight = 22.sp
            )
        }
    }
}

@Composable
fun HashtagsCard(
    hashtags: List<String>,
    onCopyAll: () -> Unit,
    onCopyTag: (String) -> Unit
) {
    ElevatedCard(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(18.dp),
        colors = CardDefaults.elevatedCardColors(
            containerColor = MaterialTheme.colorScheme.surface
        )
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.Tag,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.primary
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "10 Trending Hashtags",
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp
                    )
                }
                TextButton(onClick = onCopyAll) {
                    Icon(Icons.Default.ContentCopy, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Copy All")
                }
            }
            Spacer(modifier = Modifier.height(8.dp))
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .horizontalScroll(rememberScrollState()),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                hashtags.forEach { tag ->
                    AssistChip(
                        onClick = { onCopyTag(tag) },
                        label = { Text(tag) },
                        leadingIcon = {
                            Icon(Icons.Default.Tag, contentDescription = null, modifier = Modifier.size(14.dp))
                        }
                    )
                }
            }
        }
    }
}
`;
}
