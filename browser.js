const browser = window.browser ?? window.chrome;
const storage = browser.storage.local;

export { browser, storage };
