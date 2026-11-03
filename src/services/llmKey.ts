/** DeepSeek key typed by the user. Lives only in this browser (localStorage) and is sent to the API as X-LLM-Key. */

const STORAGE_KEY = "gigabrain.llm-key";

export const LLM_KEY_UPDATED_EVENT = "gigabrain:llm-key-updated";

export function getLlmKey(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

export function setLlmKey(key: string): void {
  try {
    const value = key.trim();
    if (value) localStorage.setItem(STORAGE_KEY, value);
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // storage blocked: the key just won't be remembered
  }
  window.dispatchEvent(new Event(LLM_KEY_UPDATED_EVENT));
}
