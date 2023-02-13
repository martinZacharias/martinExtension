const footer = document.querySelector("footer");
const ul = document.createElement("ul");

const title = document.createElement("h2");
title.textContent = "ToDo:";
title.addEventListener("click", (event) => addTodo("").focus());

storage.get(["todo"]).then(({ todo }) => {
	const entries = JSON.parse(todo ?? []);
	for (const entry of entries) {
		addTodo(entry);
	}
});

footer.append(title, ul);

function saveTodos() {
	const entries = Array.from(ul.children).map((li) => li.textContent);
	storage.set({ todo: JSON.stringify(entries) });
}

function addTodo(content) {
	const li = document.createElement("li");
	li.textContent = content;
	li.contentEditable = true;
	li.addEventListener("focusout", (event) => {
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
