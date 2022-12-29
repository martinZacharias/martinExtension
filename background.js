// load options and set up change listener
const storage = chrome.storage.local;
let hideDownloadShelfTime = 1000;

storage.get("options", ({ options }) => {
	hideDownloadShelfTime = options?.hideDownloadShelfTime ?? 1000;
});

storage.onChanged.addListener((changes, area) => {
	const newOptions = changes.options?.newValue;
	if (newOptions) {
		hideDownloadShelfTime = newOptions.hideDownloadShelfTime ?? 1000;
	}
});

// add context menu entries on install
chrome.runtime.onInstalled.addListener(() => {
	chrome.contextMenus.create({
		id: "saveFile",
		title: "Save",
		contexts: ["image", "video", "audio"],
	});

	chrome.contextMenus.create({
		id: "toggleDesignMode",
		title: "Design mode",
		contexts: ["page", "editable"],
	});
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
	switch (info.menuItemId) {
		case "saveFile":
			chrome.downloads.download({ url: info.srcUrl }, (downloadId) => {
				if (info.pageUrl === info.srcUrl) {
					chrome.tabs.remove(tab.id);
				}
			});
			break;

		case "toggleDesignMode":
			chrome.scripting.executeScript({
				target: { tabId: tab.id },
				func: () => {
					if (document.designMode === "on") {
						document.designMode = "off";
					} else {
						document.designMode = "on";
					}
				},
			});
			break;

		default:
			throw `Unknown menuItemId :${info.menuItemId}`;
	}
});

// hide download shelf when all downloads done
chrome.downloads.onChanged.addListener((downloadDelta) => {
	//query active downloads when state changes
	if (hideDownloadShelfTime >= 0 && downloadDelta.state) {
		chrome.downloads.search({ state: "in_progress" }, (results) => {
			if (results.length === 0) {
				setTimeout(() => {
					chrome.downloads.setShelfEnabled(false);
					chrome.downloads.setShelfEnabled(true);
				}, hideDownloadShelfTime);
			}
		});
	}
});
