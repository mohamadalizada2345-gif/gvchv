const textInput = document.getElementById("textInput");
const charCount = document.getElementById("charCount");
const wordCount = document.getElementById("wordCount");
const lineCount = document.getElementById("lineCount");
const textMessage = document.getElementById("textMessage");

function updateTextStats() {
  const text = textInput.value;

  charCount.textContent = text.length;
  wordCount.textContent = text.trim()
    ? text.trim().split(/\s+/).length
    : 0;
  lineCount.textContent = text.length
    ? text.split(/\r\n|\r|\n/).length
    : 0;
}

function showTextMessage(message) {
  textMessage.textContent = message;
}

function changeText(transform, message) {
  textInput.value = transform(textInput.value);
  updateTextStats();
  showTextMessage(message);
}

textInput.addEventListener("input", () => {
  updateTextStats();
  showTextMessage("");
});

document.getElementById("upperBtn").addEventListener("click", () => {
  changeText(text => text.toUpperCase(), "Text converted to uppercase.");
});

document.getElementById("lowerBtn").addEventListener("click", () => {
  changeText(text => text.toLowerCase(), "Text converted to lowercase.");
});

document.getElementById("titleBtn").addEventListener("click", () => {
  changeText(
    text => text.toLowerCase().replace(/\b\w/g, letter => letter.toUpperCase()),
    "Text converted to title case."
  );
});

document.getElementById("cleanBtn").addEventListener("click", () => {
  changeText(
    text => text
      .split(/\r\n|\r|\n/)
      .map(line => line.replace(/\s+/g, " ").trim())
      .join("\n")
      .trim(),
    "Extra spaces removed."
  );
});

document.getElementById("reverseBtn").addEventListener("click", () => {
  changeText(
    text => Array.from(text).reverse().join(""),
    "Text reversed."
  );
});

async function copyText(text) {
  if (!text) {
    throw new Error("There is no text to copy.");
  }

  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const temporary = document.createElement("textarea");
  temporary.value = text;
  temporary.style.position = "fixed";
  temporary.style.opacity = "0";
  document.body.appendChild(temporary);
  temporary.select();

  const success = document.execCommand("copy");
  temporary.remove();

  if (!success) {
    throw new Error("Copy failed. Please select and copy the text manually.");
  }
}

document.getElementById("copyBtn").addEventListener("click", async () => {
  try {
    await copyText(textInput.value);
    showTextMessage("Text copied successfully!");
  } catch (error) {
    showTextMessage(error.message);
  }
});

document.getElementById("clearBtn").addEventListener("click", () => {
  textInput.value = "";
  updateTextStats();
  showTextMessage("Text cleared.");
});

document.getElementById("downloadBtn").addEventListener("click", () => {
  if (!textInput.value) {
    showTextMessage("Please enter some text before downloading.");
    return;
  }

  const blob = new Blob([textInput.value], {
    type: "text/plain;charset=utf-8"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "maz-tools-text.txt";
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
  showTextMessage("Your text file has been downloaded.");
});

// Password generator
const passwordLength = document.getElementById("passwordLength");
const lengthValue = document.getElementById("lengthValue");
const passwordOutput = document.getElementById("passwordOutput");
const passwordMessage = document.getElementById("passwordMessage");

passwordLength.addEventListener("input", () => {
  lengthValue.textContent = passwordLength.value;
});

function generateSecurePassword(length, characters) {
  let password = "";
  const randomValues = new Uint32Array(length);

  crypto.getRandomValues(randomValues);

  for (let i = 0; i < length; i++) {
    password += characters[randomValues[i] % characters.length];
  }

  return password;
}

document.getElementById("generateBtn").addEventListener("click", () => {
  let characters = "";

  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()-_=+[]{}?";

  if (document.getElementById("includeUpper").checked) {
    characters += upper;
  }

  if (document.getElementById("includeLower").checked) {
    characters += lower;
  }

  if (document.getElementById("includeNumbers").checked) {
    characters += numbers;
  }

  if (document.getElementById("includeSymbols").checked) {
    characters += symbols;
  }

  if (!characters) {
    passwordOutput.value = "";
    passwordMessage.textContent = "Select at least one character type.";
    return;
  }

  if (!window.crypto || !crypto.getRandomValues) {
    passwordMessage.textContent =
      "Secure password generation is unavailable in this browser.";
    return;
  }

  passwordOutput.value = generateSecurePassword(
    Number(passwordLength.value),
    characters
  );

  passwordMessage.textContent = "Password generated successfully.";
});

document.getElementById("copyPasswordBtn").addEventListener("click", async () => {
  try {
    await copyText(passwordOutput.value);
    passwordMessage.textContent = "Password copied successfully!";
  } catch (error) {
    passwordMessage.textContent = error.message;
  }
});

// Current year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// Initialize counters
updateTextStats();