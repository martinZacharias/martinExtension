import { browser, storage } from "./browser";

// load options and set up change listener
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
browser.runtime.onInstalled.addListener(() => {
  browser.contextMenus.create({
    id: "saveFile",
    title: "Save",
    contexts: ["image", "video", "audio"],
  });

  browser.contextMenus.create({
    id: "toggleDesignMode",
    title: "Design mode",
    contexts: ["page", "editable"],
  });
});

browser.contextMenus.onClicked.addListener(async (info, tab) => {
  switch (info.menuItemId) {
    case "saveFile":
      browser.downloads.download({ url: info.srcUrl }, (downloadId) => {
        if (info.pageUrl === info.srcUrl) {
          browser.tabs.remove(tab.id);
        }
      });
      break;

    case "toggleDesignMode":
      browser.scripting.executeScript({
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
browser.downloads.onChanged.addListener((downloadDelta) => {
  //query active downloads when state changes
  if (hideDownloadShelfTime >= 0 && downloadDelta.state) {
    browser.downloads.search({ state: "in_progress" }, (results) => {
      if (results.length === 0) {
        setTimeout(() => {
          browser.downloads.setShelfEnabled(false);
          browser.downloads.setShelfEnabled(true);
        }, hideDownloadShelfTime);
      }
    });
  }
});
