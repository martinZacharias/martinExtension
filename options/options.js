const storage = chrome.storage.local;

const syncEnabledCheckbox = document.querySelector("#syncEnabled");

storage.get(["syncEnabled"]).then(({ syncEnabled }) => {
	syncEnabledCheckbox.checked = syncEnabled;
});

syncEnabledCheckbox.addEventListener("change", (event) => {
	storage.set({ syncEnabled: syncEnabledCheckbox.checked });
});
