addEventListener("submit", (event) => event.preventDefault());

const storage = chrome.storage.local;
const options = {};

const statusSpan = document.querySelector("#status");
/** @type {HTMLFormElement} */
const optionsForm = document.querySelector("#optionsForm");
const slider = optionsForm.natoChance;
const sliderNumber = document.querySelector("#natoChanceNumber");

storage.get(["options"]).then(({ options }) => {
  const { hideDownloadShelfTime, natoChance } = options ?? {};

  optionsForm.hideDownloadShelfTime.value = hideDownloadShelfTime ?? 1000;
  slider.value = natoChance ?? 0.2;
  updateLabel();
});

optionsForm.addEventListener("change", (event) => {
  if (optionsForm.reportValidity()) {
    const fd = new FormData(optionsForm);
    storage.set({ options: Object.fromEntries(fd) });
  } else {
    for (const element of optionsForm.elements) {
      if (!element.checkValidity()) {
        const { rangeUnderflow, rangeOverflow, valueMissing } =
          element.validity;
        if (valueMissing || rangeUnderflow) {
          element.value = element.min;
        } else if (rangeOverflow) {
          element.value = element.max;
        }
      }
    }
  }
});

slider.addEventListener("input", updateLabel);
function updateLabel() {
  sliderNumber.textContent = Math.round(slider.value * 100);
}

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
