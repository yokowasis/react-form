// @ts-ignore
type NextRequest = import("next/server").NextRequest;

import { AES, PBKDF2, enc, lib } from "crypto-js";
import * as jose from "jose";
import { TOTP } from "totp-generator";

export function getVal(id: string) {
  if (typeof document === "undefined" || typeof window === "undefined")
    return "";
  const elem = document.getElementById(id) as HTMLInputElement;
  if (typeof elem === "undefined" || elem === null) return "";

  switch (elem.dataset.type) {
    default:
      return elem.value;
  }
}

export function generateSalt() {
  return "$2a$10$us4l1evreCGvANr2QiCz8O";
}

export const hashPassword = (
  password: string,
  passPhrase: string = "$2a$10$us4l1evreCGvANr2QiCz8O"
) => {
  const iv = enc.Hex.parse("00000000000000000000000000000000");
  const salt = {
    words: [1943688280, 3743628111, 93051141, 2405835587],
    sigBytes: 16,
  } as lib.WordArray;
  const key = PBKDF2(passPhrase, salt, {
    keySize: 256 / 32,
    iterations: 100,
  });
  return AES.encrypt(password, key, {
    iv,
  }).toString();
};

/**
 *
 * @param {string} passPhrase
 * @returns
 */
export function getToken(passPhrase: string = "123123") {
  return TOTP.generate(passPhrase.toUpperCase(), {
    period: 60 * 15,
  });
}

/**
 *
 * @param {string} id
 * @param {string} value
 * @returns
 */
export function setVal(id: string, value: string) {
  if (typeof document === "undefined" || typeof window === "undefined") return;
  const elem = document.getElementById(id) as HTMLInputElement;
  if (typeof elem === "undefined" || elem === null) return;

  switch (elem.dataset.type) {
    case "select":
      elem.value = value;
      elem.dispatchEvent(new Event("change"));
      break;
    default:
      elem.value = value;
      break;
  }
}

export function getAllVal() {
  /** @type {Object.<string,string>} */
  const hasil: { [s: string]: string } = {};
  document.querySelectorAll(".form-control").forEach((e) => {
    const elem = e as HTMLInputElement;
    // skip if file input
    if (elem.type === "file") return;
    hasil[elem.id] = getVal(elem.id);
  });
  return hasil;
}

/**
 *
 * @param {string} text
 * @returns
 */
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

/**
 *
 * @param {string} str
 * @returns
 */
export function capitalize(str: string) {
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
export function digitGrouping(num: number) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/**
 *
 * @param {number} num
 * @param {number} size
 * @returns
 */
export function paddingZero(num: number, size: number = 2) {
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
export function encodeVar(val: any, LOCAL_KEY: string) {
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
export function decodeVar(item: string, LOCAL_KEY: string) {
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
export function setStorageVar(key: string, val: any, LOCAL_KEY: string) {
  const s = encodeVar(val, LOCAL_KEY);
  localStorage.setItem(key, s);
}

/**
 *
 * @param {string} key
 * @param {string} LOCAL_KEY
 * @returns {* | undefined}
 */
export function getStorageVar(
  key: string,
  LOCAL_KEY: string = "123123"
): any | undefined {
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

/**
 *
 * @param {string} url
 * @returns {Promise<String>}
 */
export async function imgURLtoBase64(url: string): Promise<string> {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve) => {
    const reader = new FileReader() as any;
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      resolve(reader.result);
    };
  });
}

/**
 *
 * @param {string} htmlString
 * @returns {Promise<string>}
 */
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
          const reader = new FileReader() as any;
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            const base64String = reader.result.replace(/^data:.+;base64,/, "");
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
 * @param {"GET" | "POST" | "PUT" | "DELETE" | "PATCH"} method
 * @param {*} body
 * @param {string} token
 * @param {"application/json" | "application/x-www-form-urlencoded"} contentType
 * @returns {Promise<*>}
 */
export function rp(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "GET",
  body: any = {},
  token: string = "",
  contentType:
    | "application/json"
    | "application/x-www-form-urlencoded" = "application/json"
): Promise<any> {
  const localTokenJWT = localStorage.getItem("jwt");
  const localTokentoken = localStorage.getItem("token");

  const t = token || localTokenJWT || localTokentoken;

  /** @type {*} */
  let formBody: any;

  if (contentType === "application/json") {
    formBody = JSON.stringify(body);
  } else if (contentType === "application/x-www-form-urlencoded") {
    formBody = Object.keys(body)
      .map(
        (key) => encodeURIComponent(key) + "=" + encodeURIComponent(body[key])
      )
      .join("&");
  }

  // @ts-ignore
  return new Promise((resolve, reject) => {
    fetch(url, {
      method,
      headers: {
        Accept: "application/json",
        "Content-Type": contentType,
        Authorization: `Bearer ${t}`,
      },
      body: method !== "GET" ? formBody : undefined,
    })
      .then((response) => {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          return response.json();
        } else {
          return response.text();
        }
      })
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
export function showModal(id: string) {
  const btn = document.getElementById(`modalBtn-${id}`);
  if (btn) btn.click();
}

/**
 *
 * @param {string} id
 */
export function closeModal(id: string) {
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

export function randomDarkColor() {
  var letters = "0123456789ABCDEF".split("");
  var color = "#";
  for (var i = 0; i < 6; i++) {
    if (i === 0) {
      color += letters[Math.floor(Math.random() * 6)];
    } else {
      color += letters[Math.floor(Math.random() * letters.length)];
    }
  }
  return color;
}

export function randomDigit(digitCount = 6) {
  let num = Math.floor(Math.random() * 10 ** digitCount);
  return num.toString().padStart(digitCount, "0");
}

export function randomAlphaNumeric(length = 10) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let retVal = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

export async function now() {
  const r = await fetch(`https://globalvar.cbt.my.id/?_=/now`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  try {
    /** @type {{now:string}} */
    const json: { now: string } = await r.json();
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
 * @param {string} color
 * @returns
 */
export function createLine(
  id0: string,
  id1: string,
  s: string,
  parent: string = "container",
  color: string = ""
) {
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
  // @ts-ignore
  const y = (top2 - top1) / 2;
  // half x
  // @ts-ignore
  const x2 = x / 2;

  //   create line
  const line = document.createElement("div");
  line.id = s;
  line.classList.add("linepenjodohan");
  line.style.width = x + "px";
  line.style.height = "2px";

  if (color) {
    line.style.backgroundColor = color;
  } else {
    line.style.backgroundColor = `#${Math.floor(
      Math.random() * 16777215
    ).toString(16)}`;
  }

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
  (document.getElementById(parent) as HTMLElement).appendChild(line);

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
export function newDate(
  datestring: string,
  timezone: "Asia/Jakarta" | "Asia/Makassar" | "Asia/Jayapura"
): Date {
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
 * @returns {Promise<undefined | *>}
 */
async function verifyJWT(
  token: string,
  secret: Uint8Array
): Promise<undefined | any> {
  try {
    const { payload } = await jose.jwtVerify(token, secret);
    return {
      ...payload,
    };
  } catch (error) {
    return undefined;
  }
}

/**
 *
 * @param {*} data
 * @param {Uint8Array} secret
 * @returns
 */
async function generateJWT(data: any, secret: Uint8Array) {
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
function generateJWTSecret(secret: string) {
  const r = new TextEncoder().encode(secret);
  return r;
}

/**
 * Get JWT from Headers
 *
 * @param {NextRequest} req
 */
function getJWT(req: NextRequest) {
  const bearer = req.headers.get("Authorization");
  // get JWT
  if (bearer) {
    const jwt = bearer.replace("Bearer ", "");
    return jwt;
  } else {
    return undefined;
  }
}

/**
 * Khusus untuk backend / nodejs. Fungsi ini tidak bisa jalan di browser.
 *
 * @param {string} token
 * @returns
 */
function parseJwtNode(token: string) {
  // eslint-disable-next-line no-undef
  return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
}

export class Timeout {
  ids: any[];

  constructor() {
    this.ids = [];
  }

  /**
   *
   * @param {number} delay
   * @param {*} reason
   * @returns
   */
  set = (delay: number, reason: any) =>
    new Promise((resolve, reject) => {
      const id = setTimeout(() => {
        if (reason === undefined) resolve("timeout");
        else reject(reason);
        this.clear(id);
      }, delay);
      this.ids.push(id);
    });

  /**
   *
   * @param {*} promise
   * @param {number} delay
   * @param {*} reason
   * @returns
   */
  wrap = (promise: any, delay: number, reason: any) =>
    Promise.race([promise, this.set(delay, reason)]);

  /**
   *
   * @param  {...any} ids
   */
  clear = (...ids: any[]) => {
    this.ids = this.ids.filter((id) => {
      if (ids.includes(id)) {
        clearTimeout(id);
        return false;
      }
      return true;
    });
  };
}

export const JWT = {
  verify: verifyJWT,
  generate: generateJWT,
  generateSecret: generateJWTSecret,
  get: getJWT,
  parse: parseJwtNode,
  parseBrowser: parseJwt,
};
