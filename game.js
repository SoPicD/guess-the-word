let score = 0;
let time = 60;
let maxTime = 60;
let timer;
let usedWords = [];
let lastPair = "";
let startChar = "";
let endChar = "";
let isPaused = false;
let pairs = []; 

// ================= UTILS =================
function $(id) { return document.getElementById(id); }

function updateUI() {
  $("time").innerText = time;
  $("score").innerText = score;
  let percent = (time / maxTime) * 100;
  $("timeBar").style.width = percent + "%";
}

function normalize(word) {
  return word.toLowerCase().trim()
    .replace(/[^a-zàáảãạăắằẳẵặâấầẩẫậđèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵ]/g, "");
}

function initPairs() {
  let pairSet = new Set();
  DICTIONARY.forEach(w => {
    let word = normalize(w);
    if (word.length >= 1) {
      pairSet.add(word[0] + "-" + word[word.length - 1]);
    }
  });
  pairs = Array.from(pairSet);
}

// ================= GAME LOGIC ============

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

function newRound() {
  if (pairs.length === 0) initPairs();

  let pair;
  do {
    pair = pairs[Math.floor(Math.random() * pairs.length)];
  } while (pair === lastPair && pairs.length > 1);

  lastPair = pair;
  [startChar, endChar] = pair.split("-");

  $("rule").innerText = `Bắt đầu "${startChar.toUpperCase()}" - kết thúc "${endChar.toUpperCase()}"`;
  $("inputWord").value = "";
  $("inputWord").focus();
  $("result").innerText = "";
  updateUI();
}

function finishGame() {
  $("inputWord").disabled = true;
  if ($("gameOverModal")) {
      $("gameOverModal").classList.remove("hidden");
      $("finalScore").innerText = score;
  }
  if ($("modalOverlay")) $("modalOverlay").classList.remove("hidden");
}

function resetGame() {
  score = 0;
  time = maxTime;
  usedWords = [];
  isPaused = false;
  
  // Ẩn các UI thông báo
  if ($("gameOverModal")) $("gameOverModal").classList.add("hidden");
  if ($("modalOverlay")) $("modalOverlay").classList.add("hidden");
  
  $("inputWord").disabled = false;
  $("inputWord").value = "";
  
  startTimer();
  newRound();
}

function checkWord() {
  if (time <= 0 || isPaused) return;

  let word = normalize($("inputWord").value);
  if (word.length === 0) return;

  if (typeof BANNED !== 'undefined' && BANNED.some(b => word.includes(b))) return fail("Từ cấm ❌");
  if (usedWords.includes(word)) return fail("Đã dùng ❌");
  if (word[0] !== startChar || word[word.length - 1] !== endChar) return fail("Sai luật ❌");
  if (!DICTIONARY.includes(word)) return fail("Không có nghĩa ❌");

  // ĐÚNG
  usedWords.push(word);
  score++;
  time = Math.min(maxTime, time + 3); // Cộng 3 giây
  $("result").innerText = "Đúng 🎉";
  updateUI();
  
  setTimeout(newRound, 600);
}

function fail(msg) {
  $("result").innerText = msg;
  time = Math.max(0, time - 2);
  updateUI();
}

// ================= EVENT LISTENERS =======

$("inputWord").addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    checkWord();
  }
});

window.onload = () => {
  initPairs();
  resetGame(); // Dùng resetGame để khởi tạo lần đầu cho sạch
};
// ================= AUDIO =================
let soundCorrect = new Audio("assets/audio/correct.mp3");
let soundWrong = new Audio("assets/audio/wrong.mp3");
function checkWord() {
  if (time <= 0 || isPaused) return;

  let word = normalize($("inputWord").value);
  if (word.length === 0) return;

  if (typeof BANNED !== 'undefined' && BANNED.some(b => word.includes(b))) return fail("Từ cấm ❌");
  if (usedWords.includes(word)) return fail("Đã dùng ❌");
  if (word[0] !== startChar || word[word.length - 1] !== endChar) return fail("Sai luật ❌");
  if (!DICTIONARY.includes(word)) return fail("Không có nghĩa ❌");

  // ĐÚNG
  usedWords.push(word);
  score++;
  time = Math.min(maxTime, time + 3);
  $("result").innerText = "Đúng 🎉";
  
  // PHÁT ÂM THANH ĐÚNG
  soundCorrect.currentTime = 0;
  soundCorrect.play().catch(()=>{}); 
  
  updateUI();
  setTimeout(newRound, 600);
}

function fail(msg) {
  $("result").innerText = msg;
  time = Math.max(0, time - 2);
  
  // PHÁT ÂM THANH SAI
  soundWrong.currentTime = 0;
  soundWrong.play().catch(()=>{}); 

  updateUI();
  
  // Thêm hiệu ứng rung nhẹ cho input để người chơi biết mình sai
  $("inputWord").classList.add("wrong");
  setTimeout(() => $("inputWord").classList.remove("wrong"), 250);
}
// ================= MENU CONTROL ==========

function toggleMenu() {
  const menu = $("sideMenu");
  const overlay = $("menuOverlay");
  
  // Nếu đang ẩn thì hiện, đang hiện thì ẩn
  if (menu.classList.contains("menu-hidden")) {
    isPaused = true; // Tạm dừng đồng hồ
    menu.classList.remove("menu-hidden");
    overlay.classList.remove("hidden");
  } else {
    resumeGame();
  }
}

function resumeGame() {
  isPaused = false; // Chạy tiếp đồng hồ
  $("sideMenu").classList.add("menu-hidden");
  $("menuOverlay").classList.add("hidden");
}

function quitGame() {
  if (confirm("Thoát game và chơi lại từ đầu?")) {
    location.reload();
  }
}

function openSettings() {
  alert("Cài đặt: (Âm thanh: Bật)");
}
