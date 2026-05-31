// ================= CORE STATE ============
let score = 0;
let combo = 0;
let maxCombo = 0;
let time = 60;
let maxTime = 60;
let timer;
let usedWords = [];
let lastPair = "";
let startChar = "";
let endChar = "";
let isPaused = false;
let gameOver = false;
let pairs = [];
let pairMap = {};
let normalizedDict = [];

// ================= AUDIO SYSTEM =================
let soundEnabled = JSON.parse(localStorage.getItem("soundEnabled") ?? "true");
let volume = parseFloat(localStorage.getItem("volume") ?? "0.7");

let soundCorrect = new Audio("assets/audio/correct.mp3");
let soundWrong = new Audio("assets/audio/wrong.mp3");

soundCorrect.volume = volume;
soundWrong.volume = volume;

// unlock audio (mobile + chrome)
function unlockAudio() {
  soundCorrect.play().then(()=>soundCorrect.pause()).catch(()=>{});
  soundWrong.play().then(()=>soundWrong.pause()).catch(()=>{});
}
document.addEventListener("click", unlockAudio, { once: true });
document.addEventListener("touchstart", unlockAudio, { once: true });

function playCorrect() {
  if (!soundEnabled) return;
  soundCorrect.currentTime = 0;
  soundCorrect.play().catch(()=>{});
}

function playWrong() {
  if (!soundEnabled) return;
  soundWrong.currentTime = 0;
  soundWrong.play().catch(()=>{});
}
function toggleSound() {
  soundEnabled = !soundEnabled;

  localStorage.setItem("soundEnabled", JSON.stringify(soundEnabled));

  $("soundStatus").innerText = soundEnabled ? "🔊 Bật" : "🔇 Tắt";
}
function toggleMenu() {

  if (gameOver) return;

  const menu = $("sideMenu");
  const overlay = $("menuOverlay");
  const burger = $("hamburger");
  const isOpen = !menu.classList.contains("menu-hidden");

  if (isOpen) {
    // ĐANG MỞ → ĐÓNG
    menu.classList.add("menu-hidden");
    overlay.classList.add("hidden");
    burger.classList.remove("hidden");
    isPaused = false;
  } else {
    // ĐANG ĐÓNG → MỞ
    menu.classList.remove("menu-hidden");
    overlay.classList.remove("hidden");
    burger.classList.add("hidden");
    isPaused = true;
  }
}
function resumeGame() {
  toggleMenu(); // dùng lại cho gọn
}

function quitGame() {
  location.reload();
}


// ================= UTILS =================
function $(id) { return document.getElementById(id); }

function normalize(word) {
  if (!word) return "";
  return word.toLowerCase().trim()
    .replace(/[^a-zàáảãạăắằẳẵặâấầẩẫậđèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵ]/g, "");
}

// ================= UI =================
function updateUI() {
  $("time").innerText = time;
  $("score").innerText = score;
  $("combo").innerText = combo;
  let percent = (time / maxTime) * 100;
  $("timeBar").style.width = percent + "%";
const bar = $("timeBar");

if (time <= 10) {
  bar.style.background = "red";
}
else if (time <= 20) {
  bar.style.background = "yellow";
}
else {
  bar.style.background = "green";
}
  let highScore = localStorage.getItem("highScore") || 0;
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
  }
  $("highScore").innerText = highScore;
}

// ================= INIT DATA =================
function initGameData() {
  pairMap = {};
  normalizedDict = [];

  DICTIONARY.forEach(w => {
    let word = normalize(w);
    if (word.length < 2) return;

    normalizedDict.push(word);

    let key = word[0] + "-" + word[word.length - 1];
    if (!pairMap[key]) pairMap[key] = [];
    pairMap[key].push(word);
  });

  pairs = Object.keys(pairMap);
}

// ================= TIMER =================
function startTimer() {
  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    if (!isPaused) {
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

// ================= ROUND =================
function newRound() {
  pairs = Object.keys(pairMap).filter(k => pairMap[k].length > 0);

  if (pairs.length === 0) {
    alert("Hết từ rồi!");
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

  $("rule").innerText = `Bắt đầu "${startChar.toUpperCase()}" - kết thúc "${endChar.toUpperCase()}"`;

  $("inputWord").value = "";
  $("inputWord").focus();
  $("result").innerText = "";

  updateUI();
}

// ================= CHECK =================
function checkWord() {
  if (time <= 0 || isPaused) return;

  let word = normalize($("inputWord").value);
  if (!word) return;
  
  if (
  typeof BANNED !== "undefined" &&
  BANNED.some(b => word.includes(normalize(b)))
) {
  $("result").innerText = "🚫 Từ không chuẩn mực";

  time = 0;
  updateUI();

  finishGame();
  return;
}
  
  if (usedWords.includes(word))
    return fail("Đã dùng ❌");

  if (word[0] !== startChar || word[word.length - 1] !== endChar)
    return fail("Sai luật ❌");

  if (!normalizedDict.includes(word))
    return fail("Không có nghĩa ❌");

// ✅ đúng
usedWords.push(word);
pairMap[lastPair] = pairMap[lastPair].filter(w => w !== word);

combo++;
if (combo === 5)
  showComboPopup("🔥 COMBO x2");

if (combo === 10)
  showComboPopup("🔥 COMBO x3");

if (combo === 15)
  showComboPopup("🔥 COMBO x5" );
  

let reward = 1;

if (combo >= 15)
  reward = 5;
else if (combo >= 10)
  reward = 3;
else if (combo >= 5)
  reward = 2;

score += reward;

if (combo > maxCombo) {
  maxCombo = combo;
}

time = Math.min(maxTime, time + 3);
showFloatingText("+3s", "#28a745");
  $("result").innerText = `Đúng 🎉 +${reward} điểm`;

  playCorrect();

  $("inputWord").classList.add("correct");
  setTimeout(() => {
    $("inputWord").classList.remove("correct");
    newRound();
  }, 400);

  updateUI();
}

// ================= FAIL =================
function fail(msg) {
  combo = 0;
  $("result").innerText = msg;
  time = Math.max(0, time - 2);

showFloatingText("-2s", "#dc3545");

if (time <= 0) {
  finishGame();
  return;
}

  playWrong();

  $("inputWord").classList.add("wrong");
  setTimeout(() => $("inputWord").classList.remove("wrong"), 250);

  updateUI();
}

// ================= GAME CONTROL =================
function finishGame() {
  $("inputWord").disabled = true;

  if ($("gameOverModal"))
    $("gameOverModal").classList.remove("hidden");

  if ($("modalOverlay"))
    $("modalOverlay").classList.remove("hidden");

  $("finalScore").innerText = score;
  $("finalCombo").innerText = maxCombo;

  $("hamburger").classList.add("hidden");

  isPaused = true;
  gameOver = true;
}

function showFloatingText(text, color) {
  const el = $("floatingText");

  if (!el) return;

  el.innerText = text;
  el.style.color = color;

  el.classList.remove("float-show");
  void el.offsetWidth;
  el.classList.add("float-show");
}

function showComboPopup(text) {
  const popup = $("comboPopup");

  if (!popup) return;

  popup.innerText = text;

  popup.classList.remove("hidden");

  popup.style.animation = "none";
  popup.offsetHeight;

  popup.style.animation = "comboShow 1s ease forwards";

  setTimeout(() => {
    popup.classList.add("hidden");
  }, 1000);
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

  if ($("gameOverModal"))
    $("gameOverModal").classList.add("hidden");

  if ($("modalOverlay"))
    $("modalOverlay").classList.add("hidden");

  $("inputWord").disabled = false;
  $("hamburger").classList.remove("hidden");
  $("inputWord").value = "";

  startTimer();
  newRound();
}

// ================= EVENTS ==============
$("inputWord").addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    checkWord();
  }
});

// ================= INIT =================
window.onload = () => {
  resetGame();

  const input = document.getElementById("inputWord");

  input.addEventListener("focus", () => {
    setTimeout(() => {
      input.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }, 300);
  });
};



function openMessenger() {
  window.open(
    "https://m.me/tai4329",
    "_blank"
  );
}

function openFacebook() {
  window.open(
    "https://www.facebook.com/share/1D2H5pHxzx/",
    "_blank"
  );
}