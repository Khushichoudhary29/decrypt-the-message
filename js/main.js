// js/main.js

let level = 1;
let score = 0;
let shift = Math.floor(Math.random() * 5) + 1; // random shift (1–5)
let originalText = "HELLO WORLD";
let cipherText = caesarEncrypt(originalText, shift);
let timeLeft = 60;
let timerInterval;

// Initialize game
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("cipher-text").innerText = `Cipher Text: ${cipherText}`;
  document.getElementById("submit-btn").addEventListener("click", checkAnswer);
  document.getElementById("hint-btn").addEventListener("click", showHint);
  startTimer();
});

function checkAnswer() {
  const userInput = document.getElementById("user-input").value.trim().toUpperCase();
  const feedback = document.getElementById("feedback");

  if (userInput === originalText) {
    score += 10;
    feedback.innerText = "✅ Correct! Moving to next level...";
    feedback.style.color = "limegreen";
    nextLevel();
  } else {
    feedback.innerText = "❌ Wrong! Try again.";
    feedback.style.color = "red";
  }

  document.getElementById("score").innerText = `Score: ${score}`;
}

function nextLevel() {
  level++;
  shift = Math.floor(Math.random() * 5) + 1;
  originalText = "SECRET";
  cipherText = caesarEncrypt(originalText, shift);

  document.getElementById("level-display").innerText = `Level: ${level}`;
  document.getElementById("cipher-text").innerText = `Cipher Text: ${cipherText}`;
  document.getElementById("user-input").value = "";
}

function showHint() {
  const hintText = document.getElementById("hint-text");
  hintText.innerText = `Hint: Each letter is shifted by ${shift}.`;
}

function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").innerText = `Time: ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      document.getElementById("feedback").innerText = "⏰ Time’s up! Game over.";
      document.getElementById("feedback").style.color = "orange";
      document.getElementById("submit-btn").disabled = true;
    }
  }, 1000);
}
