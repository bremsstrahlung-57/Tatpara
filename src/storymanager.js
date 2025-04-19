import story from './story.js';
import UserLevelChecker from './userlevel.js';

class StoryManager {
  constructor(initialLevel = 1) {
    this.levelChecker = new UserLevelChecker(initialLevel);
    this.sectionUnlockLevel = 10; // Unlock new story section every 10 levels
    this.story = story; // Using the imported story array
  }

  // Get available story sections based on current level
  getAvailableSections() {
    const currentLevel = this.levelChecker.getCurrentLevel();
    const availableSections = [];
    
    // Calculate how many sections should be unlocked
    const unlockedSections = Math.floor(currentLevel / this.sectionUnlockLevel);
    
    // Add section indices to available sections (sections are 0-indexed in the array)
    for (let i = 0; i <= unlockedSections && i < this.story.length; i++) {
      availableSections.push(i);
    }
    
    return availableSections;
  }

  // Get content for a specific section if it's available
  getSectionContent(sectionIndex) {
    const availableSections = this.getAvailableSections();
    
    if (availableSections.includes(sectionIndex) && this.story[sectionIndex]) {
      return this.story[sectionIndex];
    }
    
    return null; // Section not unlocked or doesn't exist
  }

  // Get the latest unlocked section content
  getLatestUnlockedContent() {
    const availableSections = this.getAvailableSections();
    
    if (availableSections.length > 0) {
      const latestSectionIndex = availableSections[availableSections.length - 1];
      return {
        sectionKey: this.getSectionName(latestSectionIndex),
        content: this.story[latestSectionIndex]
      };
    }
    
    return null; // No sections available
  }

  // Helper to get section name based on index
  getSectionName(index) {
    const sectionNames = [
      "prologue",
      "section1",
      "section2",
      "section3",
      "section4",
      "section5",
      "section6",
      "section7",
      "section8",
      "section9",
      "section10",
      "epilogue"
    ];
    
    return sectionNames[index] || `section${index}`;
  }

  // Check if next story section is unlocked
  isNextSectionUnlocked() {
    const currentLevel = this.levelChecker.getCurrentLevel();
    const nextSectionLevel = (Math.floor(currentLevel / this.sectionUnlockLevel) + 1) * this.sectionUnlockLevel;
    
    return {
      unlocked: currentLevel >= nextSectionLevel,
      currentLevel: currentLevel,
      nextSectionLevel: nextSectionLevel,
      levelDifference: nextSectionLevel - currentLevel
    };
  }

  // Set user level (for testing or loading saved games)
  setUserLevel(level) {
    return this.levelChecker.setLevel(level);
  }

  // Increment user level (when they gain XP/complete quests)
  incrementUserLevel(amount = 1) {
    const previousLevel = this.levelChecker.getCurrentLevel();
    const newLevel = this.levelChecker.incrementLevel(amount);
    
    // Check if a new section was unlocked with this level up
    const previousSections = Math.floor(previousLevel / this.sectionUnlockLevel);
    const currentSections = Math.floor(newLevel / this.sectionUnlockLevel);
    
    const newSectionIndex = currentSections < this.story.length ? currentSections : null;
    
    return {
      previousLevel,
      newLevel,
      newSectionUnlocked: currentSections > previousSections && newSectionIndex !== null,
      unlockedSection: currentSections > previousSections && newSectionIndex !== null ? 
        this.getSectionName(newSectionIndex) : null
    };
  }
}

export default StoryManager;