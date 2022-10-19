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

// hide download shelf when done
let activeDownloads = 0;
chrome.downloads.onCreated.addListener((downloadItem) => {
	activeDownloads++;
});

chrome.downloads.onChanged.addListener((downloadDelta) => {
	if (["complete", "interrupted"].includes(downloadDelta.state?.current)) {
		activeDownloads--;
		if (activeDownloads === 0) {
			setTimeout(() => {
				chrome.downloads.setShelfEnabled(false);
				chrome.downloads.setShelfEnabled(true);
			}, 1000);
		}
	}
});
