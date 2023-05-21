import savedPages from "./savedPages.js";
import nato from "./nato.js";
import todo from "./todo.js";

const storage = chrome.storage.local;

const main = document.querySelector("main");
const footer = document.querySelector("footer");

savedPages.init(storage, main);
todo.init(storage, footer);
nato.init(footer);

const components = new Map();
components.set(todo.name, todo);
components.set(savedPages.name, savedPages);
components.set(nato.name, nato);

storage.get(Array.from(components.keys())).then((entries) => {
  for (const [key, value] of Object.entries(entries)) {
    const component = components.get(key);
    if ("onGet" in component) component.onGet(value);
  }
});

storage.onChanged.addListener((changes, _) => {
  for (const [key, { newValue, oldValue }] of Object.entries(changes)) {
    const component = components.get(key);
    if ("onChanged" in component) component.onChanged(newValue, oldValue);
  }
});
