// Shared with Module 2 - this is the connector, no main.js needed
window.currentUsername = "";

const authContainer = document.getElementById("auth-container");
const validationContainer = document.getElementById("validation-container");
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const authMsg = document.getElementById("auth-msg");
const validationUser = document.getElementById("validation-user");
const logoutBtn = document.getElementById("logout-btn");

function switchAuthTab(type) {
  authMsg.textContent = "";
  if (type === 'login') {
    loginForm.style.display = "block";
    signupForm.style.display = "none";
    document.getElementById("tab-login-btn").classList.add("active-tab");
    document.getElementById("tab-signup-btn").classList.remove("active-tab");
  } else {
    loginForm.style.display = "none";
    signupForm.style.display = "block";
    document.getElementById("tab-login-btn").classList.remove("active-tab");
    document.getElementById("tab-signup-btn").classList.add("active-tab");
  }
}

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  authMsg.textContent = "";
  authMsg.className = "";
  const username = document.getElementById("signup-username").value.trim();
  const password = document.getElementById("signup-password").value.trim();
  const res = await fetch("/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  authMsg.textContent = data.message;
  if (res.ok) {
    authMsg.style.color = "green";
    signupForm.reset();
    setTimeout(() => switchAuthTab('login'), 1500);
  } else {
    authMsg.className = "error";
  }
});

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  authMsg.textContent = "";
  authMsg.className = "";
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value.trim();
  const res = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (res.ok) {
    window.currentUsername = data.user;
    validationUser.textContent = window.currentUsername;
    authContainer.style.display = "none";
    validationContainer.style.display = "inline-block";
    loginForm.reset();
  } else {
    authMsg.className = "error";
    authMsg.textContent = data.message;
  }
});

logoutBtn.addEventListener("click", () => {
  window.currentUsername = "";
  document.getElementById("main-container").style.display = "none";
  authContainer.style.display = "inline-block";
  document.getElementById("main-msg").textContent = "";
  authMsg.textContent = "";
  switchAuthTab('login');
});