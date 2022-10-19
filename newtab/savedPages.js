const storage = chrome.storage.local;

const savedPagesSection = document.querySelector("#savedPages");
const dialog = document.querySelector("dialog");
const form = document.querySelector("form");
const titleInput = document.querySelector("#title");
const urlInput = document.querySelector("#url");
const favIconUrlInput = document.querySelector("#favIconUrl");
const deleteButton = document.querySelector("#deleteItem");

let selectedA = null;
let pagesVar = [];

storage.get(["pages"]).then(({ pages }) => {
	pagesVar = pages;
	setPages(pages);
});

storage.onChanged.addListener((changes) => {
	for (const [key, { newValue, oldValue }] of Object.entries(changes)) {
		switch (key) {
			case "pages":
				pagesVar = newValue;
				setPages(newValue);
				break;
		}
	}
});

function setPages(pages) {
	savedPagesSection.replaceChildren();
	if (typeof pages !== "undefined") {
		for (const page of pages) {
			const a = createItem(page);
			savedPagesSection.append(a);
		}
	}
}

function createItem(page) {
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

dialog.addEventListener("submit", (event) => {
	const fd = new FormData(form);
	for (const [key, value] of fd.entries()) {
		selectedA.page[key] = value;
	}
	storage.set({ pages: pagesVar });
});

deleteButton.addEventListener("click", (event) => {
	const index = pagesVar.indexOf(selectedA.page);
	pagesVar.splice(index, 1);
	storage.set({ pages: pagesVar });
	dialog.close();
});

dialog.addEventListener("close", (event) => {
	selectedA = null;
});
