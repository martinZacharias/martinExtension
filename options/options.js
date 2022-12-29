const storage = chrome.storage.local;
const options = {};

const statusSpan = document.querySelector("#status");
const optionsForm = document.querySelector("#optionsForm");

storage.get(["options"]).then(({ options }) => {
	const { hideDownloadShelfTime } = options ?? {};
	// default to 1000 if undefined
	optionsForm.hideDownloadShelfTime.value = hideDownloadShelfTime ?? 1000;
});

optionsForm.hideDownloadShelfTime.addEventListener("change", (event) => {
	options.hideDownloadShelfTime = parseInt(event.target.value);
	storage.set({ options });
});

const bookmarksFileInput = document.querySelector("#bookmarksFile");
bookmarksFileInput.addEventListener("change", (event) => {
	event.preventDefault();
	try {
		const file = bookmarksFileInput.files[0];
		const reader = new FileReader();
		reader.addEventListener("load", (event) => {
			const pages = JSON.parse(event.target.result);
			storage.set({ pages });
			statusSpan.textContent = "Imported pages!";
		});
		reader.readAsText(file);
	} catch (error) {
		statusSpan.textContent = "Invalid file!";
	}
});

const importBookmarksButton = document.querySelector("#importBookmarks");
importBookmarksButton.addEventListener("click", (event) =>
	bookmarksFileInput.click()
);

const exportBookmarksButton = document.querySelector("#exportBookmarks");
exportBookmarksButton.addEventListener("click", (event) => {
	storage.get(["pages"]).then(({ pages }) => {
		const output = JSON.stringify(pages);
		if (output) {
			saveFile("pages.json", output, "application/json");
			statusSpan.textContent = "Download started!";
		} else {
			statusSpan.textContent = "Failed to save pages!";
		}
	});
});

function saveFile(filename, data, type) {
	const blob = new Blob([data], { type });
	const url = URL.createObjectURL(blob);

	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
}
