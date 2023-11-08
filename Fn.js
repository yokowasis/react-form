// @ts-check

import { AES, enc } from "crypto-js";
import bcrypt from "bcryptjs";
import * as jose from "jose";

/**
 *
 * @param {string} id
 * @returns
 */
export function getVal(id) {
  if (typeof document === "undefined" || typeof window === "undefined")
    return "";
  const elem = document.getElementById(id);
  if (typeof elem === "undefined" || elem === null) return "";

  switch (elem.dataset.type) {
    default:
      return /** @type {HTMLInputElement} */ (elem).value;
      break;
  }
}

export function generateSalt() {
  return bcrypt.genSaltSync(10);
}

/**
 *
 * @param {string} password
 * @param {string} salt
 */
export const hashPassword = (
  password,
  salt = "$2a$10$us4l1evreCGvANr2QiCz8O"
) => {
  // const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

export function getToken() {
  // create a function to hash password using salt
  // import bcrypt

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

/**
 *
 * @param {string} id
 * @param {string} value
 * @returns
 */
export function setVal(id, value) {
  if (typeof document === "undefined" || typeof window === "undefined") return;
  const elem = document.getElementById(id);
  if (typeof elem === "undefined" || elem === null) return;

  switch (elem.dataset.type) {
    case "select":
      /** @type {HTMLInputElement} */ (elem).value = value;
      /** @type {HTMLInputElement} */ (elem).dispatchEvent(new Event("change"));
      break;
    default:
      /** @type {HTMLInputElement} */ (elem).value = value;
      break;
  }
}

export function getAllVal() {
  /** @type {Object.<string,string>} */
  const hasil = {};
  document.querySelectorAll(".form-control").forEach((elem) => {
    // skip if file input
    if (/** @type {HTMLInputElement} */ (elem).type === "file") return;
    hasil[elem.id] = getVal(elem.id);
  });
  return hasil;
}

/**
 *
 * @param {string} text
 * @returns
 */
export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "_") // Replace spaces with _
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

/**
 *
 * @param {string} str
 * @returns
 */
export function capitalize(str) {
  if (str) {
    str = str.replace(/_/g, " ");
    return str
      .split(" ")
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" ");
  } else return "";
}

/**
 *
 * @param {number} num
 * @returns
 */
export function digitGrouping(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/**
 *
 * @param {number} num
 * @param {number} size
 * @returns
 */
export function paddingZero(num, size = 2) {
  let s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
}

/**
 *
 * @param {*} val
 * @param {string} LOCAL_KEY
 * @returns
 */
export function encodeVar(val, LOCAL_KEY) {
  // console.log(val);
  // console.log(JSON.stringify(val));
  const s = AES.encrypt(JSON.stringify(val), LOCAL_KEY);
  // console.log(decodeVar(s.toString()));
  return s.toString();
}

/**
 *
 * @param {string} item
 * @param {string} LOCAL_KEY
 * @returns
 */
export function decodeVar(item, LOCAL_KEY) {
  const encrypted = item;
  const decrypted = AES.decrypt(encrypted, LOCAL_KEY);
  const s = decrypted.toString(enc.Utf8);
  if (s) {
    return JSON.parse(s);
  } else {
    return;
  }
}

/**
 *
 * @param {string} key
 * @param {*} val
 * @param {string} LOCAL_KEY
 */
export function setStorageVar(key, val, LOCAL_KEY) {
  const s = encodeVar(val, LOCAL_KEY);
  localStorage.setItem(key, s);
}

/**
 *
 * @param {string} key
 * @param {string} LOCAL_KEY
 * @returns {* | undefined}
 */
export function getStorageVar(key, LOCAL_KEY = "123123") {
  const item = localStorage.getItem(key);
  if (!item) return undefined;
  const s = decodeVar(item, LOCAL_KEY);
  return s;
}

/**
 *
 * @param {string} token
 * @returns
 */
export function parseJwt(token) {
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

/**
 *
 * @param {string} url
 * @returns {Promise<String>}
 */
export async function imgURLtoBase64(url) {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      resolve(/** @type {*} */ (reader).result);
    };
  });
}

/**
 *
 * @param {string} htmlString
 * @returns {Promise<string>}
 */
export function convertImgSrcToBase64(htmlString) {
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
            const base64String = /** @type {*} */ (reader).result.replace(
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

/**
 *
 * @param {string} url
 * @returns {Promise<*>}
 */
export function rp(url, method = "GET", body = {}, token = "") {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        resolve(false);
        console.log(err);
      });
  });
}

/**
 *
 * @param {string} id
 */
export function showModal(id) {
  const btn = document.getElementById(`modalBtn-${id}`);
  if (btn) btn.click();
}

/**
 *
 * @param {string} id
 */
export function closeModal(id) {
  const btn = document.getElementById(`modalBtnClose-${id}`);
  if (btn) btn.click();
}

export function randomLightColor() {
  var letters = "BCDEF".split("");
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * letters.length)];
  }
  return color;
}

export async function now() {
  const r = await fetch(`https://bima-global.bimasoft.workers.dev/?_=/now`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  try {
    /** @type {{now:string}} */
    const json = await r.json();
    return json;
  } catch (error) {
    console.log(error);
    return { now: "" };
  }
}

/**
 *
 * @param {string} id0
 * @param {string} id1
 * @param {string} s
 * @param {string} parent
 * @returns
 */
export function createLine(id0, id1, s, parent = "container") {
  // delete previous line
  const prev = document.getElementById(s);
  if (prev) prev.remove();

  const radio1 = document.getElementById(id0);
  const radio2 = document.getElementById(id1);

  if (!radio1 || !radio2) return;
  //   get top offset
  const top1 = radio1.offsetTop + 6;
  const top2 = radio2.offsetTop + 6;

  // get left offset
  const left1 = radio1.offsetLeft + 8;
  const left2 = radio2.offsetLeft + 8;

  //   calculate angle
  const angle = Math.atan2(top2 - top1, left2 - left1) * (180 / Math.PI);

  // console.log({
  //   top1,
  //   top2,
  //   left1,
  //   left2,
  //   angle,
  // });

  // calculate distance
  const x = Math.sqrt(Math.pow(left2 - left1, 2) + Math.pow(top2 - top1, 2));

  // half height
  const y = (top2 - top1) / 2;
  // half x
  const x2 = x / 2;

  //   create line
  const line = document.createElement("div");
  line.id = s;
  line.classList.add("linepenjodohan");
  line.style.width = x + "px";
  line.style.height = "2px";

  //   random color
  line.style.backgroundColor = `#${Math.floor(
    Math.random() * 16777215
  ).toString(16)}`;

  radio1.style.backgroundColor = line.style.backgroundColor;
  radio1.style.borderColor = line.style.backgroundColor;
  radio2.style.backgroundColor = line.style.backgroundColor;
  radio2.style.borderColor = line.style.backgroundColor;

  line.style.transform = `rotate(${angle}deg)`;
  line.style.position = "absolute";
  line.style.top = `${top1}px`;
  line.style.left = `${left1}px`;
  line.style.transformOrigin = "0% 0%";
  line.style.pointerEvents = "none";
  /** @type {HTMLElement} */ (document.getElementById(parent)).appendChild(
    line
  );

  return () => {
    line.remove();
  };
}

/**
 *
 * @param {string} datestring
 * @param {"Asia/Jakarta" | "Asia/Makassar" | "Asia/Jayapura"} timezone
 * @returns {Date}
 */
export function newDate(datestring, timezone) {
  const d = new Date(datestring);

  let offset = 0;

  switch (timezone) {
    case "Asia/Jakarta":
      offset = -7;
      break;

    case "Asia/Makassar":
      offset = -8;
      break;

    case "Asia/Jayapura":
      offset = -9;
      break;

    default:
      break;
  }

  const hours = d.getHours();
  d.setHours(hours + offset);

  return d;
}

/**
 *
 * @param {string} token
 * @param {Uint8Array} secret
 * @returns
 */
async function verifyJWT(token, secret) {
  try {
    const { payload } = await jose.jwtVerify(token, secret);
    return {
      ...payload,
    };
  } catch (error) {
    return { status: "err", err: error.toString() };
  }
}

/**
 *
 * @param {*} data
 * @param {Uint8Array} secret
 * @returns
 */
async function generateJWT(data, secret) {
  const alg = "HS256";
  const jwt = await new jose.SignJWT(data)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .sign(secret);
  return jwt;
}

/**
 *
 * @param {string} secret
 * @returns
 */
function generateJWTSecret(secret) {
  const r = new TextEncoder().encode(secret);
  return r;
}

/**
 *
 * @param {import("next/server").NextRequest} req
 */
function getJWT(req) {
  console.log(req);
}

export const JWT = {
  verify: verifyJWT,
  generate: generateJWT,
  generateSecret: generateJWTSecret,
  get: getJWT,
};
