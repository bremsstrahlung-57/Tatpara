import story from './story.js';
import UserLevelChecker from './userlevel.js';

class StoryManager {
  constructor(startingLevel) {
    if (startingLevel === undefined) {
      startingLevel = 1;
    }
    this.levelChecker = new UserLevelChecker(startingLevel);
    this.sectionUnlockLevel = 10;
    this.story = story;
  }

  getAvailableSections() {
    let level = this.levelChecker.getCurrentLevel();
    let sections = [];

    let numberOfSections = Math.floor(level / this.sectionUnlockLevel);

    for (let i = 0; i <= numberOfSections; i++) {
      if (i < this.story.length) {
        sections.push(i);
      }
    }

    if (level >= 1 && sections.indexOf(0) === -1) {
      sections.unshift(0);
    }

    return sections;
  }

  getSectionContent(index) {
    let available = this.getAvailableSections();
    if (available.indexOf(index) !== -1) {
      return this.story[index];
    } else {
      return null;
    }
  }

  getLatestUnlockedContent() {
    let unlocked = this.getAvailableSections();
    if (unlocked.length > 0) {
      let last = unlocked[unlocked.length - 1];
      return {
        sectionKey: this.getSectionName(last),
        content: this.story[last]
      };
    } else {
      return null;
    }
  }

  getSectionName(index) {
    let names = [
      "prologue",
      "seg1",
      "seg2",
      "seg3",
      "seg4",
      "seg5",
      "seg6",
      "seg7",
      "seg8",
      "seg9",
      "seg10",
      "epilogue"
    ];

    if (index >= 0 && index < names.length) {
      return names[index];
    } else {
      return "section" + index;
    }
  }

  isNextSectionUnlocked() {
    let currentLevel = this.levelChecker.getCurrentLevel();
    let nextLevel = (Math.floor(currentLevel / this.sectionUnlockLevel) + 1) * this.sectionUnlockLevel;

    let unlocked = false;
    if (currentLevel >= nextLevel) {
      unlocked = true;
    }

    return {
      unlocked: unlocked,
      currentLevel: currentLevel,
      nextSectionLevel: nextLevel,
      levelDifference: nextLevel - currentLevel
    };
  }

  setUserLevel(level) {
    return this.levelChecker.setLevel(level);
  }

  incrementUserLevel(amount) {
    if (amount === undefined) {
      amount = 1;
    }

    let before = this.levelChecker.getCurrentLevel();
    let after = this.levelChecker.incrementLevel(amount);

    let beforeSections = Math.floor(before / this.sectionUnlockLevel);
    let afterSections = Math.floor(after / this.sectionUnlockLevel);

    let newUnlocked = false;
    let sectionName = null;

    if (afterSections > beforeSections && afterSections < this.story.length) {
      newUnlocked = true;
      sectionName = this.getSectionName(afterSections);
    }

    return {
      previousLevel: before,
      newLevel: after,
      newSectionUnlocked: newUnlocked,
      unlockedSection: sectionName
    };
  }
}

export default StoryManager;
