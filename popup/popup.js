const storage = chrome.storage.local;
const addNewPageButton = document.querySelector("#addNewPage");

addNewPageButton.addEventListener("click", async (event) => {
	try {
		const [tab] = await chrome.tabs.query({
			active: true,
			currentWindow: true,
		});
		const { favIconUrl, title, url } = tab;

		storage.get(["pages"]).then((stored) => {
			const pages = stored.pages || [];
			pages.push({ favIconUrl, title, url });
			storage.set({ pages });
			document.body.append(`Added ${tab.title}`);
		});
	} catch (error) {
		document.body.append("Failed to add page");
	}
});
