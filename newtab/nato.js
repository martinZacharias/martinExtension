import alphabet from "./alphabet.js";
import { storage } from "../browser.js";

let parent;

function init(element) {
  parent = element;
}

function onGet(entries) {
  const natoChance = entries?.options?.natoChance ?? 0.2;
  const natoStats = entries?.natoStats ?? { wins: 0, loses: 0 };
  if (Math.random() < natoChance) {
    const index = Math.floor(Math.random() * alphabet.length);
    const correctWord = alphabet[index];

    const form = document.createElement("form");
    form.autocomplete = "off";
    form.className = "fade";

    const input = document.createElement("input");
    input.id = "text";

    const label = document.createElement("label");
    label.htmlFor = input.id;
    label.textContent = String.fromCharCode(index + 65) + ": ";

    form.append(label, input);
    parent.prepend(form);

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      input.disabled = true;

      const submitted = input.value.trim().toLowerCase();
      const correct = correctWord.toLowerCase();

      if (submitted === correct) {
        form.append("✅");
        natoStats.wins++;
      } else {
        form.append("❌");
        natoStats.loses++;
      }

      storage.set({ natoStats });
      input.value = correctWord;
      const { wins, loses } = natoStats;
      form.append(`${wins} - ${loses}`);

      form.classList.add("hidden");
      setTimeout(() => form.remove(), 1250);
    });
  }
}

export default {
  stores: ["options", "natoStats"],
  init,
  onGet,
  onChanged: () => {},
};
