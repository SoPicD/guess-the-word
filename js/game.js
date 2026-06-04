// ==========================================================================
// 1. CORE STATE (Trạng thái cốt lõi của Game)
// ==========================================================================
let score = 0;
let combo = 0;
let maxCombo = 0;
let time = 60;
const maxTime = 60;
let timer = null;

let usedWords = [];
let lastPair = "";
let startChar = "";
let endChar = "";

let isPaused = false;
let gameOver = false;

let pairs = [];
let pairMap = {};
let normalizedDict = [];

// ==========================================================================
// 2. AUDIO SYSTEM (Hệ thống âm thanh)
// ==========================================================================
let soundEnabled = JSON.parse(localStorage.getItem("soundEnabled") ?? "true");
let volume = parseFloat(localStorage.getItem("volume") ?? "0.7");

const soundCorrect = new Audio("assets/audio/correct.mp3");
const soundWrong = new Audio("assets/audio/wrong.mp3");

soundCorrect.volume = volume;
soundWrong.volume = volume;

// Mở khóa Audio trên thiết bị di động (iOS/Android)
function unlockAudio() {
  soundCorrect.play().then(() => soundCorrect.pause()).catch(() => {});
  soundWrong.play().then(() => soundWrong.pause()).catch(() => {});
}
document.addEventListener("click", unlockAudio, { once: true });
document.addEventListener("touchstart", unlockAudio, { once: true });

function playCorrect() {
  if (!soundEnabled) return;
  soundCorrect.currentTime = 0;
  soundCorrect.play().catch(() => {});
}

function playWrong() {
  if (!soundEnabled) return;
  soundWrong.currentTime = 0;
  soundWrong.play().catch(() => {});
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  localStorage.setItem("soundEnabled", JSON.stringify(soundEnabled));
  updateSoundUI();
}

function changeVolume(val) {
  volume = parseFloat(val);
  localStorage.setItem("volume", volume);
  soundCorrect.volume = volume;
  soundWrong.volume = volume;
  
  const volPercent = $("volumePercent");
  if (volPercent) volPercent.innerText = Math.round(volume * 100) + "%";
}

// Cập nhật trạng thái chữ hiển thị Bật/Tắt âm thanh toàn hệ thống
function updateSoundUI() {
  const statusText = soundEnabled ? "🔊 Bật" : "🔇 Tắt";
  if ($("soundStatus")) $("soundStatus").innerText = statusText;
  
  const modalSoundBtn = $("modalSoundBtn");
  if (modalSoundBtn) {
    modalSoundBtn.innerText = statusText;
    modalSoundBtn.classList.toggle("off", !soundEnabled);
  }
}

// ==========================================================================
// 3. UTILS & DATA INITIALIZATION (Tiện ích & Khởi tạo dữ liệu)
// ==========================================================================
function $(id) { return document.getElementById(id); }

function normalize(word) {
  if (!word) return "";
  return word.toLowerCase().trim()
    .replace(/[^a-zàáảãạăắằẳẵặâấầẩẫậđèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵ]/g, "");
}

function initGameData() {
  pairMap = {};
  if (typeof DICTIONARY === "undefined") {
    console.error("Không tìm thấy biến DICTIONARY từ file dictionary.js!");
    return;
  }

  // Sử dụng Set để lọc trùng và tối ưu hóa hiệu năng cực cao (< 10ms)
  const uniqueWordsSet = new Set();

  DICTIONARY.forEach(w => {
    let word = normalize(w);
    if (!word || word.length < 2) return;

    uniqueWordsSet.add(word);

    let firstChar = word.charAt(0);
    let lastChar = word.charAt(word.length - 1);
    let key = `${firstChar}-${lastChar}`;

    if (!pairMap[key]) pairMap[key] = [];
    if (!pairMap[key].includes(word)) {
      pairMap[key].push(word);
    }
  });

  normalizedDict = Array.from(uniqueWordsSet);
  pairs = Object.keys(pairMap);
}

// ==========================================================================
// 4. GAME LOOP & TIMERS (Vòng lặp và Bộ đếm thời gian)
// ==========================================================================
function startTimer() {
  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    if (!isPaused && !gameOver) {
      time--;
      if (time <= 0) {
        time = 0;
        clearInterval(timer);
        finishGame();
      }
      updateUI();
    }
  }, 1000);
}

function newRound() {
  pairs = Object.keys(pairMap).filter(k => pairMap[k].length > 0);

  if (pairs.length === 0) {
    if ($("rule")) $("rule").innerText = "🎉 BẠN ĐÃ PHÁ ĐẢO GAME! 🎉";
    return finishGame();
  }

  let pair;
  if (pairs.length > 1) {
    do {
      pair = pairs[Math.floor(Math.random() * pairs.length)];
    } while (pair === lastPair);
  } else {
    pair = pairs[0];
  }

  lastPair = pair;
  [startChar, endChar] = pair.split("-");

  if ($("rule")) {
    $("rule").innerText = `Bắt đầu "${startChar.toUpperCase()}" — Kết thúc "${endChar.toUpperCase()}"`;
  }

  const inputEl = $("inputWord");
  if (inputEl) {
    inputEl.value = "";
    inputEl.focus();
  }
  if ($("result")) $("result").innerText = "";

  updateUI();
}

// ==========================================================================
// 5. GAME LOGIC & CORE CONTROLS (Kiểm tra từ đúng/sai)
// ==========================================================================
function checkWord() {
  if (time <= 0 || isPaused || gameOver) return;

  let inputEl = $("inputWord");
  let word = normalize(inputEl.value);
  if (!word) return;
  
  // Kiểm tra từ cấm
  if (typeof BANNED !== "undefined" && BANNED.some(b => word.includes(normalize(b)))) {
    $("result").innerText = "🚫 Từ không chuẩn mực";
    time = 0;
    updateUI();
    finishGame();
    return;
  }
  
  if (usedWords.includes(word)) return fail("Đã dùng ❌");

  if (word.charAt(0) !== startChar || word.charAt(word.length - 1) !== endChar) {
    return fail("Sai luật chữ ❌");
  }

  if (!normalizedDict.includes(word)) return fail("Từ không có trong từ điển ❌");

  // Xử lý khi nhập ĐÚNG
  usedWords.push(word);
  pairMap[lastPair] = pairMap[lastPair].filter(w => w !== word);

  combo++;
  if (combo === 5) showComboPopup("🔥 COMBO x2");
  if (combo === 10) showComboPopup("🔥 COMBO x3");
  if (combo === 15) showComboPopup("🔥 COMBO x5");
  
  let reward = 1;
  if (combo >= 15) reward = 5;
  else if (combo >= 10) reward = 3;
  else if (combo >= 5) reward = 2;

  score += reward;
  if (combo > maxCombo) maxCombo = combo;

  time = Math.min(maxTime, time + 3);
  showFloatingText("+3s", "#28a745");
  $("result").innerText = `Đúng 🎉 +${reward} điểm`;

  playCorrect();

  inputEl.classList.add("correct");
  setTimeout(() => {
    inputEl.classList.remove("correct");
    newRound();
  }, 400);

  updateUI();
}

function fail(msg) {
  combo = 0;
  $("result").innerText = msg;
  time = Math.max(0, time - 2);

  showFloatingText("-2s", "#dc3545");
  playWrong();

  let inputEl = $("inputWord");
  if (inputEl) {
    inputEl.classList.add("wrong");
    setTimeout(() => inputEl.classList.remove("wrong"), 250);
  }

  if (time <= 0) {
    finishGame();
  }
  updateUI();
}

// ==========================================================================
// 6. SCREEN SCREEN CONTROLS (Điều khiển màn hình & Modal)
// ==========================================================================
function startGameFromMenu() {
  const menu = $("mainMenu");
  if (!menu) return;

  menu.classList.add("menu-hide");
  setTimeout(() => {
    menu.classList.add("hidden");
    $("gameScreen").classList.remove("hidden");
    
    // Chỉ kích hoạt chạy Game thực tế sau khi nhấn nút Chơi
    resetGame();
  }, 400);
}

function resetGame() {
  score = 0;
  combo = 0;
  maxCombo = 0;
  time = maxTime;
  usedWords = [];
  isPaused = false;
  gameOver = false;

  initGameData();

  if ($("gameOverModal")) $("gameOverModal").classList.add("hidden");
  if ($("modalOverlay")) $("modalOverlay").classList.add("hidden");

  const inputEl = $("inputWord");
  if (inputEl) {
    inputEl.disabled = false;
    inputEl.value = "";
  }
  if ($("hamburger")) $("hamburger").classList.remove("hidden");

  updateUI();
  startTimer();
  newRound();
}

function finishGame() {
  gameOver = true;
  isPaused = true;
  if (timer) clearInterval(timer);

  if ($("inputWord")) $("inputWord").disabled = true;
  if ($("gameOverModal")) $("gameOverModal").classList.remove("hidden");
  if ($("modalOverlay")) $("modalOverlay").classList.remove("hidden");

  if ($("finalScore")) $("finalScore").innerText = score;
  if ($("finalCombo")) $("finalCombo").innerText = maxCombo;
  if ($("hamburger")) $("hamburger").classList.add("hidden");
}

function toggleMenu() {
  if (gameOver) return;
  const menu = $("sideMenu");
  const overlay = $("menuOverlay");
  const burger = $("hamburger");
  const isOpen = !menu.classList.contains("menu-hidden");

  if (isOpen) {
    menu.classList.add("menu-hidden");
    overlay.classList.add("hidden");
    if (burger) burger.classList.remove("hidden");
    isPaused = false;
  } else {
    menu.classList.remove("menu-hidden");
    overlay.classList.remove("hidden");
    if (burger) burger.classList.add("hidden");
    isPaused = true;
  }
}

function resumeGame() { toggleMenu(); }
function quitGame() { location.reload(); }

// --- Các Popup phụ trợ ---
function showSettings() {
  const modal = $("settingsModal");
  if (!modal) return;

  updateSoundUI();

  modal.classList.add("show-settings");
}

function closeSettings() {
  const modal = $("settingsModal");
  if (!modal) return;

  modal.classList.remove("show-settings");
}

function toggleSoundFromModal() {
  toggleSound();
}

function openComingSoon(icon, title) {
  const modal = $("comingSoonModal");
  const iconEl = $("comingIcon");
  const titleEl = $("comingTitle");

  if (modal && iconEl && titleEl) {
    iconEl.innerText = icon;
    titleEl.innerText = title;
    modal.classList.add("show-popup");
  }
}

function closeComingSoon() {
  if ($("comingSoonModal")) $("comingSoonModal").classList.remove("show-popup");
}

function showGuide() { openComingSoon("📖", "Hướng Dẫn"); }

// ==========================================================================
// 7. UI DYNAMIC UPDATES (Cập nhật giao diện động)
// ==========================================================================
function updateUI() {
  if ($("time")) $("time").innerText = time;
  if ($("score")) $("score").innerText = score;
  if ($("combo")) $("combo").innerText = combo;
  
  let percent = (time / maxTime) * 100;
  const bar = $("timeBar");
  if (bar) {
    bar.style.width = percent + "%";
    if (time <= 10) bar.style.background = "#dc3545";      // Đỏ rực
    else if (time <= 20) bar.style.background = "#ffc107"; // Vàng sáng
    else bar.style.background = "#28a745";                 // Xanh lá
  }
  
  let highScore = localStorage.getItem("highScore") || 0;
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
  }
  if ($("highScore")) $("highScore").innerText = highScore;
}

function showFloatingText(text, color) {
  const el = $("floatingText");
  if (!el) return;

  el.innerText = text;
  el.style.color = color;
  el.classList.remove("float-show");
  void el.offsetWidth; // Trigger reflow ép hệ thống cập nhật animation ngay lập tức
  el.classList.add("float-show");
}

function showComboPopup(text) {
  const popup = $("comboPopup");
  if (!popup) return;

  popup.innerText = text;
  popup.classList.remove("hidden");
  popup.style.animation = "none";
  void popup.offsetHeight; // Trigger reflow
  popup.style.animation = "comboShow 1s ease forwards";

  setTimeout(() => popup.classList.add("hidden"), 1000);
}

// ==========================================================================
// 8. DOM READY & GLOBAL EVENTS (Sự kiện tải trang và các liên kết ngoài)
// ==========================================================================
window.addEventListener("DOMContentLoaded", () => {
  // Chỉ tải data từ điển lên giao diện Trang chủ chứ KHÔNG chạy game ngay
  if (typeof DICTIONARY !== "undefined") {
    if ($("wordCount")) $("wordCount").innerText = DICTIONARY.length.toLocaleString("vi-VN");
  } else {
    console.error("Không tìm thấy tệp dữ liệu DICTIONARY!");
  }

  if ($("menuHighScore")) {
    $("menuHighScore").innerText = localStorage.getItem("highScore") || 0;
  }

  // Lắng nghe hành vi ô Input nhập từ
  const inputWord = $("inputWord");
  if (inputWord) {
    inputWord.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        e.preventDefault();
        checkWord();
      }
    });

    inputWord.addEventListener("focus", () => {
      setTimeout(() => {
        inputWord.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    });
  }
  
  // Đồng bộ UI Âm thanh hiển thị ban đầu
  updateSoundUI();
});

function openMessenger() { window.open("https://m.me/tai4329", "_blank"); }
function openFacebook() { window.open("https://www.facebook.com/share/1D2H5pHxzx/", "_blank"); }
