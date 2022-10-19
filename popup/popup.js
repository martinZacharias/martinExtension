const storage = chrome.storage.local;
const form = document.querySelector("form");
const favIconUrlInput = document.getElementById("favIconUrl");
const titleInput = document.getElementById("title");
const urlInput = document.getElementById("url");

const [tab] = await chrome.tabs.query({
	active: true,
	currentWindow: true,
});

favIconUrlInput.value = tab.favIconUrl;
titleInput.value = tab.title;
urlInput.value = tab.url;

form.addEventListener("submit", (event) => {
	const favIconUrl = favIconUrlInput.value;
	const title = titleInput.value;
	const url = urlInput.value;
	try {
		storage.get(["pages"]).then((stored) => {
			const pages = stored.pages || [];
			pages.push({ favIconUrl, title, url });
			storage.set({ pages });
			document.body.append(`Added ${title}`);
		});
	} catch (error) {
		document.body.append("Failed to add page");
	}
});
