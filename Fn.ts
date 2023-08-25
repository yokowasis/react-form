import { AES, enc } from "crypto-js";
const PUBLIC_LOCAL_KEY = "123123";

export function getVal(id: string) {
  if (typeof document === "undefined" || typeof window === "undefined")
    return "";
  const elem = document.getElementById(id);
  if (typeof elem === "undefined" || elem === null) return "";

  switch (elem.dataset.type) {
    default:
      return (elem as HTMLInputElement).value;
      break;
  }
}

export function setVal(id: string, value: string) {
  if (typeof document === "undefined" || typeof window === "undefined")
    return "";
  const elem = document.getElementById(id);
  if (typeof elem === "undefined" || elem === null) return "";

  switch (elem.dataset.type) {
    case "select":
      (elem as HTMLInputElement).value = value;
      (elem as HTMLInputElement).dispatchEvent(new Event("change"));
      break;
    default:
      (elem as HTMLInputElement).value = value;
      break;
  }
}

export function getAllVal() {
  let hasil: { [x: string]: string } = {};
  document
    .querySelectorAll<HTMLInputElement>(".form-control")
    .forEach((elem) => {
      // skip if file input
      if (elem.type === "file") return;
      hasil[elem.id] = getVal(elem.id);
    });
  return hasil;
}

export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "_") // Replace spaces with _
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

export function capitalize(str: string) {
  if (str) {
    str = str.replace(/_/g, " ");
    return str
      .split(" ")
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" ");
  } else return "";
}

export function digitGrouping(num: number) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function paddingZero(num: number, size: number = 2) {
  let s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
}

export function setStorageVar(key: string, val: any) {
  const s = AES.encrypt(JSON.stringify(val), PUBLIC_LOCAL_KEY);
  localStorage.setItem(key, s.toString());
}

export function getStorageVar(key: string) {
  const item = localStorage.getItem(key);
  if (!item) return undefined;
  const encrypted = item;
  const decrypted = AES.decrypt(encrypted, PUBLIC_LOCAL_KEY);
  const s = decrypted.toString(enc.Utf8);
  return JSON.parse(s);
}
