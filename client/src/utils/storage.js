const appName = 'Move in one'

export function loadState() {
  try {
    const serialized = localStorage.getItem(appName)
    if (serialized === null) return;
    return JSON.parse(serialized)
  } catch (err) {
    return console.log('local storage error' + err)
  }
}

export function saveState(state) {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(appName, serialized);
  } catch (err) {
    // ignore
  }
}

export function clearState() {
  try {
    localStorage.removeItem(appName);
  } catch (err) {
    // ignore
  }
}
