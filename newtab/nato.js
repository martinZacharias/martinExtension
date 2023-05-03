// prettier-ignore
const alphabet = ["Alfa","Bravo","Charlie","Delta","Echo","Foxtrot","Golf","Hotel","India","Juliett","Kilo","Lima","Mike","November","Oscar","Papa","Quebec","Romeo","Sierra","Tango","Uniform","Victor","Whiskey","Xray","Yankee","Zulu"];
const index = Math.floor(Math.random() * alphabet.length);
const correctWord = alphabet[index];

const footer = document.querySelector("footer");

const DELAY = 1250;

const form = document.createElement("form");
form.autocomplete = "off";
form.style = `display:block;transition:visibility 0s ${DELAY}ms, opacity ${DELAY}ms linear`;

const input = document.createElement("input");
input.id = "text";

const label = document.createElement("label");
label.htmlFor = input.id;
label.textContent = String.fromCharCode(index + 65) + ": ";

form.append(label, input);
footer.append(form);

form.addEventListener("submit", (event) => {
	event.preventDefault();
	input.disabled = true;

	const submitted = input.value.trim().toLowerCase();
	const correct = correctWord.toLowerCase();
	const result = submitted === correct ? "✅" : "❌";
	input.value = correctWord;
	form.append(result);

	form.style.visibility = "hidden";
	form.style.opacity = 0;
	setTimeout(() => form.remove, DELAY);
});
