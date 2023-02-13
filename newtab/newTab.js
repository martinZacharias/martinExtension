import savedPages from "./savedPages.js";
import todo from "./todo.js";

const storage = chrome.storage.local;

const main = document.querySelector("main");
const footer = document.querySelector("footer");

savedPages.init(storage, main);
todo.init(storage, footer);

const components = new Map();
components.set(todo.name, todo);
components.set(savedPages.name, savedPages);

storage.get(Array.from(components.keys())).then((entries) => {
	for (const [key, value] of Object.entries(entries))
		components.get(key).onGet(value);
});

storage.onChanged.addListener((changes, _) => {
	for (const [key, { newValue, oldValue }] of Object.entries(changes)) {
		components.get(key).onChanged(newValue, oldValue);
	}
});
