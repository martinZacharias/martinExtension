import savedPages from "./savedPages.js";
import nato from "./nato.js";
import todo from "./todo.js";
import { storage } from "../browser.js";

const main = document.querySelector("main");
const footer = document.querySelector("footer");

savedPages.init(main);
todo.init(footer);
nato.init(footer);

const components = [todo, savedPages, nato];
const map = new Map();
for (const component of components) {
  const { stores } = component;
  for (const store of stores)
    if (map.has(store)) map.get(store).push(component);
    else map.set(store, [component]);
}
const storeP = storage.get(Array.from(map.keys()));

components.forEach(({ onGet }) => storeP.then(onGet));

storage.onChanged.addListener((changes) => {
  for (const [key, { oldValue, newValue }] of Object.entries(changes))
    for (const component of map.get(key))
      component.onChanged(newValue, oldValue);
});
