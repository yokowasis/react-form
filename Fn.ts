/* eslint-disable @typescript-eslint/no-explicit-any */

import { AES, enc } from "crypto-js";
import bcrypt from "bcryptjs";

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

export function generateSalt() {
  return bcrypt.genSaltSync(10);
}

export function getToken(salt = "$2a$10$us4l1evreCGvANr2QiCz8O") {
  // create a function to hash password using salt
  // import bcrypt

  const hashPassword = (password: string) => {
    // const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  };

  // get current date and time
  const now = new Date();

  // set timezone to Central Indonesia Time (UTC+8)
  now.setUTCHours(now.getUTCHours() + 8);

  // round down to the nearest 15-minute interval
  const roundedMinutes = Math.floor(now.getUTCMinutes() / 15) * 15;
  now.setUTCMinutes(roundedMinutes);
  now.setUTCSeconds(0);
  now.setUTCMilliseconds(0);

  // print in ISO format
  const rounded = now.toISOString();

  const hash = hashPassword(rounded);

  // get last 5 characters of hash, and make it uppercase
  const last5 = hash.slice(-5).toUpperCase();
  return last5;
}

export function setVal(id: string, value: string) {
  if (typeof document === "undefined" || typeof window === "undefined") return;
  const elem = document.getElementById(id);
  if (typeof elem === "undefined" || elem === null) return;

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
  const hasil: { [x: string]: string } = {};
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

export function getStorageVar(key: string): any | undefined {
  const item = localStorage.getItem(key);
  if (!item) return undefined;
  const encrypted = item;
  const decrypted = AES.decrypt(encrypted, PUBLIC_LOCAL_KEY);
  const s = decrypted.toString(enc.Utf8);
  return JSON.parse(s);
}

export function parseJwt(token: string) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

export async function imgURLtoBase64(url: string): Promise<string> {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      resolve(reader.result as any as string);
    };
  });
}

export function convertImgSrcToBase64(htmlString: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlString;
    const imgElements = tempDiv.querySelectorAll("img");

    if (imgElements.length === 0) {
      resolve(htmlString);
      return;
    }

    let loadedCount = 0;
    const loadHandler = () => {
      loadedCount++;
      if (loadedCount === imgElements.length) {
        resolve(tempDiv.innerHTML);
      }
    };

    for (let i = 0; i < imgElements.length; i++) {
      const imgElement = imgElements[i];
      const imgUrl = imgElement.getAttribute("src") || "";
      fetch(imgUrl)
        .then((response) => response.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            const base64String: string = (reader as any).result.replace(
              /^data:.+;base64,/,
              ""
            );
            imgElement.setAttribute(
              "src",
              `data:image/png;base64,${base64String}`
            );
            loadHandler();
          };
        })
        .catch(() => {
          reject(new Error(`Failed to load image: ${imgUrl}`));
        });
    }
  });
}

export function rp(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function showModal(id: string) {
  const btn = document.getElementById(`modalBtn-${id}`);
  if (btn) btn.click();
}

export function closeModal(id: string) {
  const btn = document.getElementById(`modalBtnClose-${id}`);
  if (btn) btn.click();
}
