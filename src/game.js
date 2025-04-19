// game.js
import StoryManager from 'storyManager.js';

// Create a new story manager instance
const storyManager = new StoryManager(1); // Start at level 1

// Demo function to show how it works
function demoStoryProgression() {
  console.log("Player starting at level 1");
  console.log("Available sections:", storyManager.getAvailableSections());
  console.log("Latest story content:", storyManager.getLatestUnlockedContent());
  
  // Player levels up to level 10
  console.log("\nPlayer gains 9 levels!");
  const levelUpResult = storyManager.incrementUserLevel(9);
  console.log("Level up result:", levelUpResult);
  console.log("Available sections now:", storyManager.getAvailableSections());
  
  // Show newly unlocked story
  if (levelUpResult.newSectionUnlocked) {
    console.log("\nNew story unlocked!");
    const latestStory = storyManager.getLatestUnlockedContent();
    console.log(`Section: ${latestStory.sectionKey}`);
    latestStory.content.forEach((storyLine, index) => {
      console.log(`${index + 1}. ${storyLine}`);
    });
  }
  
  // Check when next section will unlock
  const nextSectionInfo = storyManager.isNextSectionUnlocked();
  console.log("\nNext section info:", nextSectionInfo);
  console.log(`You need ${nextSectionInfo.levelDifference} more levels to unlock the next story section.`);
}

// Run the demo
demoStoryProgression();