let parent;

function init(element) {
  parent = element;
}

function onGet(options) {
  if (Math.random() < (options.natoChance ?? 0.2)) {
    // prettier-ignore
    const alphabet = ["Alfa","Bravo","Charlie","Delta","Echo","Foxtrot","Golf","Hotel","India","Juliett","Kilo","Lima","Mike","November","Oscar","Papa","Quebec","Romeo","Sierra","Tango","Uniform","Victor","Whiskey","Xray","Yankee","Zulu"];
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
      const result = submitted === correct ? "✅" : "❌";
      input.value = correctWord;
      form.append(result);

      form.classList.add("hidden");
      setTimeout(() => form.remove(), 1250);
    });
  }
}

export default {
  name: "options",
  init,
  onGet,
};
