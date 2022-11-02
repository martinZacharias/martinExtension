const storage = chrome.storage.local;
const options = {};

const optionsForm = document.querySelector("#optionsForm");

storage.get(["options"]).then(({ options }) => {
	const { hideDownloadShelfTime } = options;
	// default to 1000 if undefined
	optionsForm.hideDownloadShelfTime.value = hideDownloadShelfTime ?? 1000;
});

optionsForm.hideDownloadShelfTime.addEventListener("change", (event) => {
	options.hideDownloadShelfTime = parseInt(event.target.value);
	storage.set({ options });
});
