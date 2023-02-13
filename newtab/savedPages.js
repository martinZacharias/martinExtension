let storage;
let currentPages;

const section = document.createElement("section");

function init(store, parent) {
	parent.append(section);
	storage = store;
}

function onGet(data) {
	currentPages = data;

	for (const page of currentPages) {
		const a = addPage(page);
		section.append(a);
	}
}

function onChanged(newValue, _oldValue) {
	section.replaceChildren();
	onGet(newValue);
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

function savePages() {
	storage.set({ pages: currentPages });
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

export default {
	name: "pages",
	init,
	onGet,
	onChanged,
};
