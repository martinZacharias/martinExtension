// add context menu entries
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

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
	switch (info.menuItemId) {
		case "saveFile":
			chrome.downloads.download({ url: info.srcUrl }, (downloadId) => {
				if (info.pageUrl === info.srcUrl) {
					chrome.tabs.remove(tab.id);
				}
				setTimeout(() => {
					chrome.downloads.setShelfEnabled(false);
					chrome.downloads.setShelfEnabled(true);
				}, 1000);
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
