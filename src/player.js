import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

const playButton = document.getElementById("play");
const pauseButton = document.getElementById("pause");
const nextButton = document.getElementById("next");
const previousButton = document.getElementById("previous");

let player;
let currentVideoIndex = 0;
let isPlayerReady = false;
let isMuted = false;
let isVideoPlaying = false;
let currentVideoId = null;
let videoQueue = [];
let lastVolume = 100;
let videoTimer = null;

const playlist = [
  "ugTluz9d3eg",
  "S9uCbvC3dOY",
  "mXpLHdYhMKA",
  "IXsWr2CK4SI",
  "zNaGofYkN0w",
  "hbpph9CrJbs",
  "F02iMCEEQWs",
  "jfKfPfyJRdk",
  "DWcJFNfaw9c",
  "lTRiuFIWV54",
  "n61ULEU7CO0",
];

function createPlayerContainer() {
  const playerContainer = document.createElement("div");
  playerContainer.id = "youtube-player";
  playerContainer.style.position = "fixed";
  playerContainer.style.bottom = "0";
  playerContainer.style.right = "0";
  playerContainer.style.width = "1px";
  playerContainer.style.height = "1px";
  playerContainer.style.visibility = "hidden";
  document.body.appendChild(playerContainer);
}

function initializeYouTubeAPI() {
  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  createPlayerContainer();
}

window.onYouTubeIframeAPIReady = function () {
  player = new YT.Player("youtube-player", {
    height: "1",
    width: "1",
    videoId: playlist[currentVideoIndex],
    playerVars: {
      playsinline: 1,
      controls: 0,
      disablekb: 1,
      fs: 0,
      autoplay: 0,
      loop: 0,
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
      onError: onPlayerError,
    },
  });
};

function onPlayerReady(event) {
  isPlayerReady = true;

  player.setVolume(50);

  playButton.addEventListener("click", playVideo);
  pauseButton.addEventListener("click", pauseVideo);
  nextButton.addEventListener("click", playNextVideo);
  previousButton.addEventListener("click", playPreviousVideo);

  showToast("Music player ready", "info");
}

function onPlayerStateChange(event) {
  isVideoPlaying = event.data === YT.PlayerState.PLAYING;

  if (playButton && pauseButton) {
    if (isVideoPlaying) {
      playButton.style.display = "none";
      pauseButton.style.display = "block";
    } else {
      playButton.style.display = "block";
      pauseButton.style.display = "none";
    }
  }

  if (event.data === 0) {
    playNextVideo();
  }
}

function onPlayerError(event) {
  console.error("YouTube Player Error:", event.data);
  showToast("Error playing video. Trying next one...", "error");
  playNextVideo();
}

function playVideo() {
  if (player && player.playVideo) {
    player.playVideo();
    const currentTitle = player.getVideoData().title || "Music";
    showToast(`Now playing: ${currentTitle}`, "success");
  }
}

function pauseVideo() {
  if (player && player.pauseVideo) {
    player.pauseVideo();
    showToast("Music paused", "info");
  }
}

function playNextVideo() {
  currentVideoIndex = (currentVideoIndex + 1) % playlist.length;
  loadAndPlayVideo();
}

function playPreviousVideo() {
  currentVideoIndex =
    (currentVideoIndex - 1 + playlist.length) % playlist.length;
  loadAndPlayVideo();
}

function loadAndPlayVideo() {
  if (player && player.loadVideoById) {
    player.loadVideoById(playlist[currentVideoIndex]);

    setTimeout(() => {
      try {
        const currentTitle = player.getVideoData().title || "Music";
        showToast(`Now playing: ${currentTitle}`, "success");
      } catch (error) {
        console.error("Error getting video title:", error);
        showToast("Playing next track", "info");
      }
    }, 1000);
  }
}

function showToast(message, type) {
  const bgColors = {
    success: "linear-gradient(to right, #00b09b, #96c93d)",
    error: "linear-gradient(to right, #ff5f6d, #ffc371)",
    info: "linear-gradient(to right, #2193b0, #6dd5ed)",
    warning: "linear-gradient(to right, #f6d365, #fda085)",
  };

  Toastify({
    text: message,
    duration: 3000,
    gravity: "top",
    position: "right",
    style: {
      background: bgColors[type] || bgColors.info,
    },
    stopOnFocus: true,
  }).showToast();
}

function handleKeyboardShortcuts(e) {
  if (e.altKey && e.code === "Space") {
    e.preventDefault();
    if (player && player.getPlayerState) {
      if (player.getPlayerState() === 1) {
        pauseVideo();
      } else {
        playVideo();
      }
    }
  }

  if (e.altKey && e.key === "ArrowRight") {
    e.preventDefault();
    playNextVideo();
  }

  if (e.altKey && e.key === "ArrowLeft") {
    e.preventDefault();
    playPreviousVideo();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initializeYouTubeAPI();

  document.addEventListener("keydown", handleKeyboardShortcuts);

  createVolumeControl();
});

function createVolumeControl() {
  const volumeContainer = document.createElement("div");
  volumeContainer.className = "volume-control";
  volumeContainer.style.marginTop = "10px";
  volumeContainer.style.display = "flex";
  volumeContainer.style.justifyContent = "center";
  volumeContainer.style.alignItems = "center";

  const volumeSlider = document.createElement("input");
  volumeSlider.type = "range";
  volumeSlider.min = "0";
  volumeSlider.max = "100";
  volumeSlider.value = "50";
  volumeSlider.className = "volume-slider";
  volumeSlider.style.width = "150px";

  const volumeLabel = document.createElement("span");
  volumeLabel.textContent = "Volume: 50%";
  volumeLabel.style.marginLeft = "10px";
  volumeLabel.style.fontSize = "0.875rem";

  volumeSlider.addEventListener("input", () => {
    const volume = volumeSlider.value;
    if (player && player.setVolume) {
      player.setVolume(volume);
      volumeLabel.textContent = `Volume: ${volume}%`;
    }
  });

  volumeContainer.appendChild(volumeSlider);
  volumeContainer.appendChild(volumeLabel);

  const musicControlsDiv =
    document.querySelector("#play").parentNode.parentNode;
  musicControlsDiv.appendChild(volumeContainer);
}

document.addEventListener("DOMContentLoaded", function () {
  // const focusTabButton = document.getElementById("focus-tab-button");
  const storyTabButton = document.getElementById("story-tab-button");
  const tasksTabButton = document.getElementById("tasks-tab-button");
  const navStoryButton = document.getElementById("nav-story");

  const storyScrollTabButton = document.getElementById(
    "story-scroll-tab-button"
  );
  const tasksScrollTabButton = document.getElementById(
    "tasks-scroll-tab-button"
  );

  const storyScrollContent = document.getElementById("story-scroll-content");
  const tasksScrollContent = document.getElementById("tasks-scroll-content");

  const focusContainer = document.getElementById("focus-container");
  const storyContainer = document.getElementById("story-container");
  const tasksContainer = document.getElementById("tasks-container");

  const storyScroll = document.querySelector(".story-scroll");
  const storyScrollHandle = document.querySelector(".story-scroll-handle");
  const mainContent = document.querySelector(".main-content");

  // function showFocus() {
  //   focusContainer.style.display = "block";
  //   storyContainer.style.display = "none";
  //   tasksContainer.style.display = "none";
  //   focusTabButton.classList.add("border-rpg-gold");
  //   storyTabButton.classList.remove("border-rpg-gold");
  //   tasksTabButton.classList.remove("border-rpg-gold");
  // }

  function showStory() {
    focusContainer.style.display = "none";
    storyContainer.style.display = "block";
    tasksContainer.style.display = "none";
    focusTabButton.classList.remove("border-rpg-gold");
    storyTabButton.classList.add("border-rpg-gold");
    tasksTabButton.classList.remove("border-rpg-gold");
  }

  function showTasks() {
    focusContainer.style.display = "none";
    storyContainer.style.display = "none";
    tasksContainer.style.display = "block";
    focusTabButton.classList.remove("border-rpg-gold");
    storyTabButton.classList.remove("border-rpg-gold");
    tasksTabButton.classList.add("border-rpg-gold");
  }

  function showStoryScrollTab() {
    storyScrollContent.style.display = "block";
    tasksScrollContent.style.display = "none";
    storyScrollTabButton.classList.add("border-rpg-gold");
    tasksScrollTabButton.classList.remove("border-rpg-gold");
  }

  function showTasksScrollTab() {
    storyScrollContent.style.display = "none";
    tasksScrollContent.style.display = "block";
    storyScrollTabButton.classList.remove("border-rpg-gold");
    tasksScrollTabButton.classList.add("border-rpg-gold");
  }

  function toggleStoryScroll() {
    storyScroll.classList.toggle("open");
    mainContent.classList.toggle("shifted");
  }

  // focusTabButton.addEventListener("click", showFocus);
  storyTabButton.addEventListener("click", showStory);
  tasksTabButton.addEventListener("click", showTasks);

  storyScrollTabButton.addEventListener("click", showStoryScrollTab);
  tasksScrollTabButton.addEventListener("click", showTasksScrollTab);

  navStoryButton.addEventListener("click", toggleStoryScroll);
  storyScrollHandle.addEventListener("click", toggleStoryScroll);
});
