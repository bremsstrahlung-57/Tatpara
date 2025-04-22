import StoryManager from "storyManager.js";

const storyManager = new StoryManager(1);

function demoStoryProgression() {
  console.log("Player starting at level 1");
  console.log("Available sections:", storyManager.getAvailableSections());
  console.log("Latest story content:", storyManager.getLatestUnlockedContent());

  console.log("\nPlayer gains 9 levels!");
  const levelUpResult = storyManager.incrementUserLevel(9);
  console.log("Level up result:", levelUpResult);
  console.log("Available sections now:", storyManager.getAvailableSections());

  if (levelUpResult.newSectionUnlocked) {
    console.log("\nNew story unlocked!");
    const latestStory = storyManager.getLatestUnlockedContent();
    console.log(`Section: ${latestStory.sectionKey}`);
    latestStory.content.forEach((storyLine, index) => {
      console.log(`${index + 1}. ${storyLine}`);
    });
  }

  const nextSectionInfo = storyManager.isNextSectionUnlocked();
  console.log("\nNext section info:", nextSectionInfo);
  console.log(
    `You need ${nextSectionInfo.levelDifference} more levels to unlock the next story section.`
  );
}

demoStoryProgression();
