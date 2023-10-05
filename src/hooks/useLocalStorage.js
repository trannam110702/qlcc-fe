const useLocalStorage = (keyName, defaultValue = null) => {
  let value;
  const rawValue = window.localStorage.getItem(keyName);
  if (rawValue === "null") {
    value = JSON.parse(rawValue);
  } else {
    value = rawValue;
  }
  const setValue = (newValue) => {
    try {
      window.localStorage.setItem(keyName, JSON.stringify(newValue));
    } catch (err) {}
  };
  return [value, setValue];
};
export default useLocalStorage;
