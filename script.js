// 중학교 3학년 역사 교육과정 기준 태조~효종 8개 쌍 데이터
const historyData = [
  { id: 1, name: "태조 (이성계)", text: "👑 태조 (이성계)", category: "person" },
  { id: 1, name: "태조 (이성계)", text: "📜 조선 건국 (1392)\n한양 수도 이전", category: "achievement" },
  
  { id: 2, name: "태종 (이방원)", text: "👑 태종 (이방원)", category: "person" },
  { id: 2, name: "태종 (이방원)", text: "📜 6조 직계제 실시\n호패법 시행", category: "achievement" },
  
  { id: 3, name: "세종", text: "👑 세종", category: "person" },
  { id: 3, name: "세종", text: "📜 훈민정음 창제\n집현전 확장 및 4군 6진", category: "achievement" },
  
  { id: 4, name: "세조", text: "👑 세조", category: "person" },
  { id: 4, name: "세조", text: "📜 직전법 실시\n<경국대전> 편찬 시작", category: "achievement" },
  
  { id: 5, name: "성종", text: "👑 성종", category: "person" },
  { id: 5, name: "성종", text: "📜 <경국대전> 완성 및 반포\n홍문관 설치", category: "achievement" },
  
  { id: 6, name: "선조", text: "👑 선조", category: "person" },
  { id: 6, name: "선조", text: "📜 임진왜란 발생\n이순신과 의병의 활약", category: "achievement" },
  
  { id: 7, name: "광해군", text: "👑 광해군", category: "person" },
  { id: 7, name: "광해군", text: "📜 중립 외교 추진\n대동법 실시 (경기도)", category: "achievement" },
  
  { id: 8, name: "효종", text: "👑 효종", category: "person" },
  { id: 8, name: "효종", text: "📜 북벌론 추진\n(청에 복수 및 군사 양성)", category: "achievement" }
];

let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matches = 0;

const board = document.getElementById("game-board");
const movesDisplay = document.getElementById("moves");
const matchesDisplay = document.getElementById("matches");
const resetButton = document.getElementById("reset-btn");
const winModal = document.getElementById("win-modal");
const modalResetBtn = document.getElementById("modal-reset-btn");

// 카드 배열 섞기 (Fisher-Yates 알고리즘)
function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

// 게임판 생성
function createBoard() {
  board.innerHTML = "";
  cards = shuffle([...historyData]);
  
  cards.forEach((data) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.id = data.id;

    const backFace = document.createElement("div");
    backFace.classList.add("card-face", "card-back");
    backFace.textContent = "🇰🇷";

    const frontFace = document.createElement("div");
    frontFace.classList.add("card-face", "card-front", data.category);
    frontFace.innerText = data.text;

    card.appendChild(backFace);
    card.appendChild(frontFace);

    card.addEventListener("click", flipCard);
    board.appendChild(card);
  });
}

// 카드 뒤집기
function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  moves++;
  movesDisplay.textContent = moves;

  checkMatch();
}

// 짝 맞추기 확인
function checkMatch() {
  const isMatch = firstCard.dataset.id === secondCard.dataset.id;

  if (isMatch) {
    disableCards();
  } else {
    unflipCards();
  }
}

// 매칭 성공 처리
function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  matches++;
  matchesDisplay.textContent = matches;

  resetCards();

  if (matches === 8) {
    setTimeout(() => {
      document.getElementById("win-message").textContent = `${moves}회 만에 모든 역사를 연결했습니다!`;
      winModal.classList.remove("hidden");
    }, 500);
  }
}

// 매칭 실패 시 원복
function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetCards();
  }, 1200);
}

function resetCards() {
  [firstCard, secondCard] = [null, null];
  [lockBoard] = [false];
}

// 게임 리셋
function resetGame() {
  moves = 0;
  matches = 0;
  movesDisplay.textContent = moves;
  matchesDisplay.textContent = matches;
  winModal.classList.add("hidden");
  resetCards();
  createBoard();
}

resetButton.addEventListener("click", resetGame);
modalResetBtn.addEventListener("click", resetGame);

// 초기 게임 실행
createBoard();
