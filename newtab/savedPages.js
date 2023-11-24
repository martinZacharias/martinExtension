import { storage } from "../browser.js";
let currentPages;

function savePages() {
  storage.set({ pages: currentPages });
}

const section = document.createElement("section");

function init(parent) {
  parent.append(section);
}

function onGet(entries) {
  currentPages = entries?.pages ?? [];

  for (const page of currentPages) {
    const a = addPage(page);
    section.append(a);
  }
}

function onChanged(newValue, _oldValue) {
  section.replaceChildren();
  onGet({ pages: newValue });
}

function addPage(page) {
  const a = document.createElement("a");
  a.page = page;
  a.href = page.url;
  a.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    selectedA = a;
    titleInput.value = page.title;
    urlInput.value = page.url;
    favIconUrlInput.value = page.favIconUrl;
    dialog.showModal();
  });

  const article = document.createElement("article");
  article.className = "item";

  const img = document.createElement("img");
  img.className = "thumbnail";
  img.src = page.favIconUrl;

  const titleDiv = document.createElement("div");
  titleDiv.className = "text";
  titleDiv.textContent = page.title;

  article.append(img, titleDiv);
  a.append(article);
  return a;
}

//#region dialog

const dialog = document.querySelector("dialog");
const form = document.querySelector("form");
const titleInput = document.querySelector("#title");
const urlInput = document.querySelector("#url");
const favIconUrlInput = document.querySelector("#favIconUrl");
const deleteButton = document.querySelector("#deleteItem");
const closeButton = document.querySelector("#closeDialog");

let deleteConfirmed = false;
let selectedA = null;

dialog.addEventListener("submit", (event) => {
  const fd = new FormData(form);
  for (const [key, value] of fd.entries()) {
    selectedA.page[key] = value;
  }
  savePages();
});

deleteButton.addEventListener("click", (event) => {
  if (deleteConfirmed || event.shiftKey) {
    const index = currentPages.indexOf(selectedA.page);
    currentPages.splice(index, 1);
    savePages();
    dialog.close();
    setConfirm(false);
  } else {
    setConfirm(true);
  }
});

closeButton.addEventListener("click", (event) => {
  dialog.close();
});

dialog.addEventListener("close", (event) => {
  selectedA = null;
  setConfirm(false);
});

function setConfirm(confirm) {
  deleteConfirmed = confirm;
  deleteButton.textContent = confirm ? "Confirm" : "Delete";
}

dialog.addEventListener("click", (event) => {
  if (
    event.offsetX < 0 ||
    event.offsetY < 0 ||
    event.offsetX > dialog.offsetWidth ||
    event.offsetY > dialog.offsetHeight
  )
    dialog.close();
});

//#endregion dialog

document.addEventListener("keydown", (event) => {
  const target = event.target;
  if (
    ["INPUT", "TEXTAREA"].includes(target.tagName) ||
    target.isContentEditable
  )
    return;
  const key = event.key;
  if (key < "0" || key > "9") return;
  const index = key === "0" ? 9 : parseInt(key) - 1;
  if (section.children.length <= index) return;
  section.children[index].click();
});

export default {
  stores: ["pages"],
  init,
  onGet,
  onChanged,
};
