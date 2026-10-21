import test from "node:test";
import assert from "node:assert/strict";
import {
  sanitizeHashtags,
  formatSocialPost,
  formatInstagramAutoFill,
  formatFacebookAutoFill,
  getCaptionStats,
  getJetpackComposeSourceCode,
} from "./caption-helpers";

test("sanitizeHashtags formats tags with # and trims whitespace", () => {
  const input = ["  travel  ", "#sunset", "ocean vibe", "#nature#"];
  const result = sanitizeHashtags(input);

  assert.equal(result.length, 10, "Should always produce 10 hashtags");
  assert.equal(result[0], "#travel");
  assert.equal(result[1], "#sunset");
  assert.equal(result[2], "#oceanvibe");
  result.forEach((tag) => {
    assert.ok(tag.startsWith("#"), `Tag ${tag} should start with #`);
    assert.ok(!tag.includes(" "), `Tag ${tag} should not have spaces`);
  });
});

test("sanitizeHashtags deduplicates case-insensitive entries", () => {
  const input = ["#Tech", "#tech", "#TECH", "ai", "AI"];
  const result = sanitizeHashtags(input);

  const lowerSet = new Set(result.map((t) => t.toLowerCase()));
  assert.equal(lowerSet.size, result.length, "All returned tags should be unique");
  assert.equal(result.length, 10);
});

test("formatSocialPost formats caption and hashtag block cleanly", () => {
  const caption = "Living life one cup of coffee at a time.";
  const tags = ["#coffee", "#morning", "#vibes"];
  const output = formatSocialPost(caption, tags);

  assert.ok(output.includes(caption));
  assert.ok(output.includes("#coffee"));
  assert.ok(output.includes("\n\n"));
});

test("formatInstagramAutoFill generates Instagram-ready caption with CTA and 10 hashtags", () => {
  const caption = "Catching the golden hour in the hills.";
  const tags = ["#GoldenHour", "#SunsetLovers", "#Wanderlust"];
  const igPost = formatInstagramAutoFill(caption, tags);

  assert.ok(igPost.includes(caption));
  assert.ok(igPost.includes("Save this for later"));
  assert.ok(igPost.includes("."));
  assert.ok(igPost.includes("#GoldenHour"));
});

test("formatFacebookAutoFill generates conversational Facebook caption with question and discussion hook", () => {
  const primary = "Behind the scenes of our latest design sprint.";
  const question = "Which design element caught your eye first?";
  const tags = ["#DesignInspo", "#UIUX", "#Teamwork", "#ProductDesign"];
  const fbPost = formatFacebookAutoFill(primary, question, tags);

  assert.ok(fbPost.includes(primary));
  assert.ok(fbPost.includes(question));
  assert.ok(fbPost.includes("Share your thoughts below"));
  assert.ok(fbPost.includes("#DesignInspo"));
});

test("getCaptionStats calculates character and word counts", () => {
  const text = "A wonderful sunset over the mountains.";
  const stats = getCaptionStats(text);

  assert.equal(stats.wordCount, 6);
  assert.equal(stats.charCount, 38);
  assert.ok(stats.readingTimeSeconds >= 1);
});

test("getJetpackComposeSourceCode generates valid Jetpack Compose MainActivity code", () => {
  const code = getJetpackComposeSourceCode();
  assert.ok(code.includes("class MainActivity : ComponentActivity()"));
  assert.ok(code.includes("rememberLauncherForActivityResult"));
  assert.ok(code.includes("ActivityResultContracts.PickVisualMedia()"));
  assert.ok(code.includes("CaptionGeneratorScreen"));
  assert.ok(code.includes("formatAutoFill"));
  assert.ok(code.includes("SocialPlatform.INSTAGRAM"));
  assert.ok(code.includes("SocialPlatform.FACEBOOK"));
  assert.ok(code.includes("customVibe"));
  assert.ok(code.includes("onVibeChange"));
  assert.ok(code.includes("ElevatedCard"));
});
