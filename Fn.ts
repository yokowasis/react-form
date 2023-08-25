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
