// add context menu entries
chrome.contextMenus.create({
	id: "saveFile",
	title: "Save",
	contexts: ["image", "video", "audio"],
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
	if (info.menuItemId === "saveFile") {
		chrome.downloads.download({ url: info.srcUrl }, (downloadId) => {
			if (info.pageUrl === info.srcUrl) {
				chrome.tabs.remove(tab.id);
			}
			setTimeout(() => {
				chrome.downloads.setShelfEnabled(false);
				chrome.downloads.setShelfEnabled(true);
			}, 1000);
		});
	}
});
