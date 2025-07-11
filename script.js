const image = document.getElementById("cover"),
  title = document.getElementById("music-title"),
  artist = document.getElementById("music-artist"),
  currentTimeEl = document.getElementById("current-time"),
  durationEl = document.getElementById("duration"),
  progress = document.getElementById("progress"),
  playerProgress = document.getElementById("player-progress"),
  prevBtn = document.getElementById("prev"),
  nexBtn = document.getElementById("next"),
  playBtn = document.getElementById("play");

const music = new Audio();

const songs = [
  {
    path: "assets/music/1.mp3",
    displayName: "Blinding Lights",
    cover: "assets/img/1.webp",
    artist: "The Weeknd",
  },
  {
    path: "assets/music/2.mp3",
    displayName: "Timeless",
    cover: "assets/img/2.webp",
    artist: "The Weeknd",
  },
  {
    path: "assets/music/3.mp3",
    displayName: "Blue Horizon",
    cover: "assets/img/3.webp",
    artist: "NXGHT",
  },
  {
    path: "assets/music/4.mp3",
    displayName: "Nunca Muda",
    cover: "assets/img/4.webp",
    artist: "Scythermane",
  },
  {
    path: "assets/music/5.mp3",
    displayName: "Avangard",
    cover: "assets/img/5.webp",
    artist: "LONOWN",
  },
];

let musicIndex = 0;
let isPlaying = false;

function togglePlay() {
  if (isPlaying) {
    pauseMusic();
  } else {
    playMusic();
  }
}

function playMusic() {
  isPlaying = true;
  //Change play button icon
  playBtn.classList.replace("fa-play", "fa-pause");
  //Set button hover title
  playBtn.setAttribute("title", "Pause");
  music.play();
}

function pauseMusic() {
  isPlaying = false;
  playBtn.classList.replace("fa-pause", "fa-play");
  //Set button hover titwebp  playBtn.setAttribute("title", "Play");
  music.pause();
}

function loadMusic(song) {
  // Reset duration and progress UI early
  durationEl.textContent = "--:--";
  currentTimeEl.textContent = "0:00";
  progress.style.width = "0%";

  // Set text content immediately
  title.textContent = song.displayName;
  artist.textContent = song.artist;

  // Set audio source
  music.src = song.path;

  // Wait for duration to be ready (prevents NaN)
  music.addEventListener(
    "loadedmetadata",
    () => {
      updateProgressBar(); // sets correct duration
    },
    { once: true }
  );

  // Use preloading technique for cover image
  const img = new Image();
  img.src = song.cover;
  img.onload = () => {
    image.src = img.src;
  };
}

function changeMusic(direction) {
  music.pause();
  musicIndex = (musicIndex + direction + songs.length) % songs.length;
  loadMusic(songs[musicIndex]);
  playMusic();
}

function updateProgressBar() {
  const { duration, currentTime } = music;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;

  //Format helper
  const formatTime = (time) => String(Math.floor(time)).padStart(2, "0");

  //Minutes and seconds
  const durationMinutes = Math.floor(duration / 60);
  const durationSeconds = Math.floor(duration % 60);
  const currentMinutes = Math.floor(currentTime / 60);
  const currentSeconds = Math.floor(currentTime % 60);

  //set text
  durationEl.textContent = `${formatTime(durationMinutes)}:${formatTime(
    durationSeconds
  )}`;
  currentTimeEl.textContent = `${formatTime(currentMinutes)}:${formatTime(
    currentSeconds
  )}`;
}

function setProgressBar(e) {
  const width = playerProgress.clientWidth;
  const clickX = e.offsetX;
  music.currentTime = (clickX / width) * music.duration;
}

playBtn.addEventListener("click", togglePlay);
prevBtn.addEventListener("click", () => changeMusic(-1));
nexBtn.addEventListener("click", () => changeMusic(1));
music.addEventListener("ended", () => changeMusic(1));
music.addEventListener("timeupdate", updateProgressBar);
playerProgress.addEventListener("click", setProgressBar);

loadMusic(songs[musicIndex]);
