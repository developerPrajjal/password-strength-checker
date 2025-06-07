function Strength(password) {
  let i = 0;
  if (password.length > 6) i++;
  if (password.length >= 10) i++;
  if (/[A-Z]/.test(password)) i++;
  if (/[0-9]/.test(password)) i++;
  if (/[A-Za-z0-8]/.test(password)) i++;
  return i;
}

// Approximate entropy per character class
function estimateCrackTime(password) {
  const charset = [
    { regex: /[a-z]/, size: 26 },
    { regex: /[A-Z]/, size: 26 },
    { regex: /[0-9]/, size: 10 },
    { regex: /[^a-zA-Z0-9]/, size: 32 }, // special characters
  ];

  let poolSize = 0;
  charset.forEach((c) => {
    if (c.regex.test(password)) poolSize += c.size;
  });

  const entropy = password.length * Math.log2(poolSize || 1);
  const guesses = Math.pow(2, entropy);
  const guessesPerSecond = 1e9; // e.g. 1 billion guesses/sec
  const seconds = guesses / guessesPerSecond;

  return formatTime(seconds);
}

function formatTime(seconds) {
  if (seconds < 60) return `${seconds.toFixed(2)} seconds`;
  const minutes = seconds / 60;
  if (minutes < 60) return `${minutes.toFixed(2)} minutes`;
  const hours = minutes / 60;
  if (hours < 24) return `${hours.toFixed(2)} hours`;
  const days = hours / 24;
  if (days < 30) return `${days.toFixed(2)} days`;
  const months = days / 30;
  if (months < 12) return `${months.toFixed(2)} months`;
  const years = months / 12;
  return `${years.toFixed(2)} years`;
}

let container = document.querySelector(".container");
let passwordInput = document.querySelector("#YourPassword");
let show = document.querySelector(".show");
let crackTimeDisplay = document.querySelector(".crackTime");

document.addEventListener("keyup", function () {
  let password = passwordInput.value;

  if (password.length === 0) {
    container.classList.remove("weak", "moderate", "strong");
    crackTimeDisplay.textContent = "";
    return;
  }

  let strength = Strength(password);
  let crackTime = estimateCrackTime(password);
  crackTimeDisplay.textContent = `Estimated time to crack: ${crackTime}`;

  if (strength <= 2) {
    container.classList.add("weak");
    container.classList.remove("moderate", "strong");
  } else if (strength >= 3 && strength <= 4) {
    container.classList.add("moderate");
    container.classList.remove("weak", "strong");
  } else {
    container.classList.add("strong");
    container.classList.remove("weak", "moderate");
  }
});

show.onclick = function () {
  if (passwordInput.type === "password") {
    passwordInput.setAttribute("type", "text");
    show.classList.add("hide");
  } else {
    passwordInput.setAttribute("type", "password");
    show.classList.remove("hide");
  }
};
