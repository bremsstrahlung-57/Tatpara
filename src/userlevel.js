class UserLevelChecker {
    constructor(initialLevel = 1) {
      this.currentLevel = initialLevel;
    }
  
    getCurrentLevel() {
      return this.currentLevel;
    }
  
    setLevel(level) {
      if (level > 0) {
        this.currentLevel = level;
        return true;
      }
      return false;
    }
  
    incrementLevel(amount = 1) {
      if (amount > 0) {
        this.currentLevel += amount;
        return this.currentLevel;
      }
      return this.currentLevel;
    }
  

    meetsLevelRequirement(requiredLevel) {
      return this.currentLevel >= requiredLevel;
    }
  }
  
  export default UserLevelChecker;