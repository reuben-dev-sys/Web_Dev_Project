const mainContainer = document.getElementById("main-container");
const bookForm = document.getElementById("book-form");
const mainMsg = document.getElementById("main-msg");
const logList = document.getElementById("log-list");
const userDisplay = document.getElementById("user-display");
const continueBtn = document.getElementById("continue-btn");

// Connector: Continue button moves Module 1 -> Module 2
continueBtn.addEventListener("click", () => {
  document.getElementById("validation-container").style.display = "none";
  mainContainer.style.display = "inline-block";
  userDisplay.textContent = window.currentUsername;
  loadBookLogs();
});

async function loadBookLogs() {
  if (!window.currentUsername) return;
  const res = await fetch(`/logs/${encodeURIComponent(window.currentUsername)}`);
  const logs = await res.json();
  logList.innerHTML = "";
  logs.forEach(log => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${log.bookName}</strong> <br> Issued: ${log.issueDate} | Duration: ${log.duration}`;
    logList.appendChild(li);
  });
}

bookForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  mainMsg.textContent = "";
  mainMsg.className = "";
  const bookName = document.getElementById("bookName").value.trim();
  const issueDate = document.getElementById("issueDate").value;
  const duration = document.getElementById("duration").value;
  const res = await fetch("/add-log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: window.currentUsername,
      bookName,
      issueDate,
      duration
    })
  });
  const data = await res.json();
  mainMsg.textContent = data.message;
  if (res.ok) {
    mainMsg.style.color = "green";
    bookForm.reset();
    loadBookLogs();
  } else {
    mainMsg.className = "error";
  }
});