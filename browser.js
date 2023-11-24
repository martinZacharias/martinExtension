/** @type {chrome} */
const browser = globalThis.browser ?? globalThis.chrome;
const storage = browser.storage.local;

export { browser, storage };
