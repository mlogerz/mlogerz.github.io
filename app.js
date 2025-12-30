/* ================================
   GITNOTE – FINAL JS (CLEAN + PIN FIX)
   ================================ */

/* ELEMENTS */
const postsEl = document.getElementById("posts");
const moodSelect = document.getElementById("mood");
const topAvatar = document.getElementById("topAvatar");
const content = document.getElementById("content");

/* DEFAULT MOOD */
if (moodSelect) moodSelect.selectedIndex = 0;

/* USER */
const USER_KEY = "gitnote-user-locked";
const WORDS_A = ["grumpy","creepy","ghostly","sleepy","moody","sneaky","lonely","shy","quiet","wicked","lazy","chill","dark","soft","cold"];
const WORDS_B = ["fox","cat","raven","wolf","bat","owl","crow","moth","snake","bear","frog","spider","lizard","ghost"];

let username = localStorage.getItem(USER_KEY);
if (!username) {
  username = WORDS_A[Math.floor(Math.random()*WORDS_A.length)] +
             WORDS_B[Math.floor(Math.random()*WORDS_B.length)];
  username = username.charAt(0).toUpperCase() + username.slice(1);
  localStorage.setItem(USER_KEY, username);
}

const avatarLetter = username[0];
if (topAvatar) topAvatar.textContent = avatarLetter;

/* DATA */
const STORAGE_KEY = "gitnote-posts";
const INTRO_FLAG = "gitnote-intro-deleted";
const INTRO_ID = "intro-post";

let data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

/* FILTER */
let activeFilter = "all";

/* INIT INTRO POST */
function initIntroPost() {
  if (localStorage.getItem(INTRO_FLAG)) return;
  if (data.find(p => p.id === INTRO_ID)) return;

  const intro = {
    id: INTRO_ID,
    text: "Write your thoughts freely. Keep your thoughts like taking notes.",
    moodEmoji: "🎉",
    fav: true,
    pin: true,
    time: "19.12.2025 21:07:54"
  };

  data.unshift(intro);
  save();
}

/* RENDER */
function render() {
  postsEl.innerHTML = "";

  let list = [...data].sort((a, b) => {
    if (a.pin && !b.pin) return -1;
    if (!a.pin && b.pin) return 1;
    return 0;
  });

  if (activeFilter === "favorites") list = list.filter(p => p.fav);
  if (activeFilter === "pinned") list = list.filter(p => p.pin);

  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";

    const avatarChar = (p.id === INTRO_ID) ? "T" : avatarLetter;

    card.innerHTML = `
      <div class="post-header">
        <div class="avatar">${avatarChar}</div>
        <div>
          <strong>${p.id === INTRO_ID ? "Thoughts" : username}
            ${p.moodEmoji ? `<span style="margin-left:6px">${p.moodEmoji}</span>` : ""}
          </strong><br>
          <small>${p.time}</small>
        </div>
      </div>

      <div class="post-content">${escapeHTML(p.text)}</div>

      <div class="actions">
        <span onclick="toggleFav('${p.id}')">${p.fav ? "⭐ Favorited" : "☆ Favorite"}</span>
        <span onclick="togglePin('${p.id}')">${p.pin ? "📌 Pinned" : "📌 Pin"}</span>
        <span onclick="removePost('${p.id}')">🗑 Delete</span>
      </div>
    `;

    postsEl.appendChild(card);
  });
}

/* ESCAPE */
function escapeHTML(str) {
  return str.replace(/[&<>"']/g, m => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[m]));
}

/* ACTIONS */
function toggleFav(id) {
  const p = data.find(x => String(x.id) === String(id));
  if (!p) return;
  p.fav = !p.fav;
  save();
}

function togglePin(id) {
  const p = data.find(x => String(x.id) === String(id));
  if (!p) return;
  p.pin = !p.pin;
  save();
}

function removePost(id) {
  if (String(id) === INTRO_ID) {
    localStorage.setItem(INTRO_FLAG, "true");
  }
  data = data.filter(p => String(p.id) !== String(id));
  save();
}

/* ADD POST */
function addPost() {
  const text = content.value.trim();
  if (!text) return;

  const moodLabel = moodSelect.options[moodSelect.selectedIndex]?.text || "";
  const moodEmoji =
    moodLabel && !moodLabel.toLowerCase().includes("mood")
      ? moodLabel.split(" ")[0]
      : "";

  const post = {
    id: Date.now(),
    text,
    moodEmoji,
    fav: false,
    pin: false,
    time: new Date().toLocaleString()
  };

  data.unshift(post);
  save();

  content.value = "";
  moodSelect.selectedIndex = 0;
}

/* SAVE */
function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  render();
}

/* FAB MENU */
const fabBtn = document.getElementById("fabBtn");
const fabMenu = document.getElementById("fabMenu");

fabBtn.addEventListener("click", e => {
  e.stopPropagation();
  fabMenu.classList.toggle("show");
});

fabMenu.addEventListener("click", e => {
  e.stopPropagation(); // 🔥 KRİTİK SATIR
});

function setFilter(type) {
  activeFilter = type;
  render();
  fabMenu.classList.remove("show");
}

document.addEventListener("click", () => {
  fabMenu.classList.remove("show");
});

/* INIT */
initIntroPost();
render(); 
