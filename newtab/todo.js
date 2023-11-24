import { storage } from "../browser.js";
let currentTodos;

const ul = document.createElement("ul");

/** @param {ParentNode} parent */
function init(parent) {
  const title = document.createElement("h2");
  title.textContent = "ToDo:";
  title.addEventListener("click", (event) => addTodo("").focus());

  parent.append(title, ul);
}

function onGet(entries) {
  currentTodos = entries?.todo ?? [];
  for (const entry of currentTodos) {
    addTodo(entry);
  }
}

function onChanged(newValue, _oldValue) {
  if (newValue.toString() == currentTodos.toString()) return;
  ul.replaceChildren();
  onGet({ todo: newValue });
}

function addTodo(content) {
  const li = document.createElement("li");
  li.textContent = content;
  li.contentEditable = true;

  li.addEventListener("focusout", (event) => {
    li.textContent = li.textContent.trim();
    if (li.textContent === "") li.remove();
    saveTodos();
  });

  li.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      li.blur();
    }
  });

  ul.append(li);
  return li;
}

function saveTodos() {
  currentTodos = Array.from(ul.children).map((li) => li.textContent);
  storage.set({ todo: currentTodos });
}

export default {
  stores: ["todo"],
  init,
  onGet,
  onChanged,
};
