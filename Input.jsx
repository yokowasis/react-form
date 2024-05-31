import { useEffect, useState } from "react";
import "./Input.scss";
import I from "./I";
import { getVal, setVal, slugify } from "./Fn";
import React from "react";

/**
 * @typedef AppProps
 * @type {{
 *   type: "text"  | "select" | "password" | "checkbox" | "textarea" | "radio" | "time" | "uploadimage" | "number" | "date";
 *   id: string;
 *   label?: string;
 *   labelClass?: string;
 *   placeholder?: string;
 *   iconAfter?: import("./Types").icons;
 *   iconBefore?: import("./Types").icons;
 *   checked?: string[];
 *   isChecked?: boolean;
 *   inline?: boolean;
 *   data?: string[];
 *   dataLabels?: string[];
 *   onPaste?: (e: ClipboardEvent) => void;
 *   rows?: number;
 *   value?: string;
 *   style?: React.CSSProperties;
 *   readonly?: boolean;
 *   dataShowAll?: boolean;
 *   multiSelect?: boolean;
 *   description?: string;
 *   mb?: 0 | 1 | 2 | 3 | 4 | 5;
 *   onBlur?: (e: any) => void;
 *   onChange?: (e: any) => void;
 * }}
 */

/**
 *
 * @param {AppProps} props
 * @returns
 */
export default function Input(props) {
  const [filteredData, setFilteredData] = useState(
    /** @type {string[]} */([]),
  );

  function showPassword() {
    const input = /** @type {HTMLInputElement} */ (
      document.getElementById(props.id)
    );
    if (input.type === "password") {
      input.type = "text";
    } else {
      input.type = "password";
    }
  }

  useEffect(() => {
    if (props.type === "select") {
      if (props.value) setVal(props.id, props.value);
    } else {
      setVal(props.id, props.value || "");
    }
  }, [props.value]);

  return props.type === "text" ||
    props.type === "number" ||
    props.type === "time" ||
    props.type === "password" ||
    props.type === "date" ? (
    <div
      style={{ position: "relative" }}
      className={`mb-${props?.mb && props.mb >= 0 ? props.mb : 3}`}
    >
      {props.label ? (
        <div className={props.labelClass}>
          <label htmlFor={`${props.id}`}>{props.label}</label>
        </div>
      ) : (
        <></>
      )}
      <div className="input-group">
        {props.iconBefore ? (
          <>
            <div className="input-group-prepend">
              <span className="input-group-text">
                <I c={props.iconBefore} />
              </span>
            </div>
          </>
        ) : (
          <></>
        )}

        <input
          style={{ ...props.style }}
          type={props.type}
          className="form-control"
          placeholder={props.placeholder}
          autoComplete={"off"}
          id={props.id}
          onBlur={props.onBlur}
          readOnly={props.readonly}
          onPaste={(e) => {
            if (props.onPaste) props.onPaste(/** @type {*} */(e));
          }}
          onFocus={() => {
            if (props.dataShowAll) {
              setFilteredData(props.data || []);
            }
          }}
          onChange={(e) => {
            /** @type {{ value: string }} */
            const target = /** @type {*} */ (e.target);
            const val = /** @type {string} */ (target.value);
            setVal(props.id, val);
            if (val === "") {
              if (props.dataShowAll) {
                setFilteredData(props.data || []);
              } else {
                setFilteredData([]);
              }
            } else {
              setFilteredData(
                /** @type {string[]} */
                props.data?.filter((item) =>
                  item.toLowerCase().includes(target.value.toLowerCase()),
                )
              )
            }
          }}
        />
        {props.type === "password" ? (
          <>
            <div
              className="input-group-append showPasswordWrapper"
              onClick={showPassword}
            >
              <span className="input-group-text">
                <i className={`bi-eye-fill`}></i>
              </span>
            </div>
          </>
        ) : props.iconAfter ? (
          <>
            <div className="input-group-append">
              <span className="input-group-text">
                <I c={props.iconAfter} />
              </span>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
      {filteredData && filteredData.length > 0 ? (
        <>
          <div
            className={"bg-light w-100 border"}
            style={{
              position: "absolute",
              maxHeight: 200,
              overflowY: "scroll",
              zIndex: 999,
            }}
          >
            {filteredData.map((item, i) => (
              <div
                key={i}
                onClick={() => {
                  if (props.multiSelect) {
                    const val = getVal(props.id);
                    const vals = val.split(",");

                    if (vals.length === 1) {
                      setVal(props.id, `${item},`);
                    } else {
                      //pop the last item
                      vals.pop();
                      vals.push(item);
                      setVal(props.id, vals.join(",") + ",");
                    }
                  } else {
                    setVal(props.id, item);
                  }
                  setFilteredData([]);
                }}
                className={"autoInputChildren p-2"}
              >
                {props.dataLabels?.[i] || item}
              </div>
            ))}
          </div>
        </>
      ) : (
        <></>
      )}
      {props.description ? (
        <div
          className="fs-08 mt-1"
          dangerouslySetInnerHTML={{ __html: props.description }}
        ></div>
      ) : (
        <></>
      )}
    </div>
  ) : props.type === "radio" ? (
    <div className={"form-group"}>
      {props.label ? (
        <>
          <div className={"mb-1"}>{props.label}</div>
        </>
      ) : (
        <></>
      )}
      {props.data?.map((item, i) => (
        <div className="form-check" key={i}>
          <input
            className="form-check-input"
            type="radio"
            name={props.id}
            id={`radio-${props.id}-${slugify(item)}`}
            value={item}
            checked={props.value === item}
            onChange={props.onChange}
          />
          <label
            style={{ cursor: "pointer" }}
            className="form-check-label"
            htmlFor={`radio-${props.id}-${slugify(item)}`}
          >
            {props.dataLabels?.[i] ? (
              <div
                dangerouslySetInnerHTML={{ __html: props.dataLabels[i] }}
              ></div>
            ) : (
              <>{item}</>
            )}
          </label>
        </div>
      ))}
      {props.description ? (
        <div
          className="fs-08 mt-1"
          dangerouslySetInnerHTML={{ __html: props.description }}
        ></div>
      ) : (
        <></>
      )}
    </div>
  ) : props.type === "textarea" ? (
    <div
      className="form-group"
      style={{ display: props.inline ? "inline-block" : "block" }}
    >
      {props.label ? (
        <>
          <label className={"mb-1"} htmlFor={props.id}>
            {props.label}
          </label>
        </>
      ) : (
        <></>
      )}
      <textarea
        onBlur={props.onBlur}
        className={"form-control"}
        id={props.id}
        rows={props.rows || 3}
        style={{ ...props.style }}
        placeholder={props.placeholder}
        readOnly={props.readonly}
        onPaste={(e) => {
          if (props.onPaste) props.onPaste(/** @type {*} */(e));
        }}
      >
        {props.value}
      </textarea>
      {
        props.description ? (
          <div
            className="fs-08 mt-1"
            dangerouslySetInnerHTML={{ __html: props.description }}
          ></div>
        ) : (
          <></>
        )
      }
    </div >
  ) : props.type === "checkbox" ? (
    <div className={`mb-${props.mb && props.mb >= 0 ? props.mb : 3}`}>
      {props.label ? (
        <>
          <div className={"mb-1"}>{props.label}</div>
        </>
      ) : (
        <></>
      )}
      {props.data?.map((item, i) => (
        <div className="form-check" key={i}>
          <input
            className="form-check-input"
            type="checkbox"
            name={`checkbox-${props.id}-${slugify(item)}`}
            id={`checkbox-${props.id}-${slugify(item)}`}
            value={item}
            checked={props.isChecked || props.checked?.includes(item)}
            onChange={props.onChange}
          />
          <label
            className="form-check-label"
            htmlFor={`checkbox-${props.id}-${slugify(item)}`}
          >
            {props.dataLabels?.[i] || item}
          </label>
        </div>
      ))}
      {props.description ? (
        <div
          className="fs-08 mt-1"
          dangerouslySetInnerHTML={{ __html: props.description }}
        ></div>
      ) : (
        <></>
      )}
    </div>
  ) : props.type === "uploadimage" ? (
    <>
      <div
        style={{ position: "relative" }}
        className={`mb-${props.mb && props.mb >= 0 ? props.mb : 3}`}
      >
        {props.label ? (
          <div className={props.labelClass}>
            <label htmlFor={`${props.id}`}>{props.label}</label>
          </div>
        ) : (
          <></>
        )}
        <div className="input-group">
          {props.iconBefore ? (
            <>
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <I c={props.iconBefore} />
                </span>
              </div>
            </>
          ) : (
            <></>
          )}

          <input
            style={{ ...props.style }}
            type={props.type}
            className="form-control"
            placeholder={props.placeholder}
            autoComplete={"off"}
            id={props.id}
            readOnly
          />
          <div className="input-group-append">
            <button
              className="input-group-text btn-danger btn"
              onClick={() => {
                const s = /** @type {HTMLInputElement} */ (
                  document.getElementById(props.id)
                );
                s.value = "";
                setVal(props.id, "");
              }}
            >
              <I c="trash" />
            </button>
            <button
              className="input-group-text btn-primary btn"
              onClick={() => {
                const input = /** @type {HTMLInputElement} */ (
                  document.getElementById(`${props.id}-selector`)
                );
                input.click();
              }}
            >
              <input
                type="file"
                className="d-none"
                id={`${props.id}-selector`}
                onChange={async (e) => {
                  setVal(props.id, "Uploading...");
                  /** @type {{ files: FileList }} */
                  const target = /** @type {*} */ (e.target);
                  if (!target) {
                    setVal(props.id, "");
                    return;
                  }
                  const file = target.files[0];
                  const ext = file.name.split(".").pop();
                  const filename = `${props.id}-${Date.now()}.${ext}`;
                  await fetch(
                    `https://admin.cbt.my.id/?cbtindex=1&_=/bunnys3/add&filekey=${filename}`,
                    {
                      headers: {
                        "Content-Type": "application/octet-stream",
                        Accept: "application/json",
                      },
                      method: "POST",
                      body: file,
                    },
                  );
                  setVal(props.id, `https://bima-s3.b-cdn.net/${filename}`);
                }}
              />
              <I c={"upload"} /> <span className="ml-2">Upload</span>
            </button>
          </div>
        </div>
        {props.description ? (
          <div
            className="fs-08 mt-1"
            dangerouslySetInnerHTML={{ __html: props.description }}
          ></div>
        ) : (
          <></>
        )}
      </div>
    </>
  ) : props.type === "select" ? (
    <>
      <div
        style={{ position: "relative" }}
        className={`mb-${props.mb && props.mb >= 0 ? props.mb : 3}`}
      >
        {props.label ? (
          <div className={props.labelClass}>
            <label htmlFor={`${props.id}`}>{props.label}</label>
          </div>
        ) : (
          <></>
        )}
        <div className="input-group">
          {props.iconBefore ? (
            <>
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <I c={props.iconBefore} />
                </span>
              </div>
            </>
          ) : (
            <></>
          )}

          <select
            className="form-control"
            id={props.id}
            placeholder={props.placeholder}
          >
            {props.data?.map((item, i) => (
              <option key={item} value={item}>
                {props.dataLabels?.[i] || item}
              </option>
            ))}
          </select>

          {props.iconAfter ? (
            <>
              <div className="input-group-append">
                <span className="input-group-text">
                  <I c={props.iconAfter} />
                </span>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
        {props.description ? (
          <div
            className="mt-1 ml-2"
            style={{ fontSize: ".8rem" }}
            dangerouslySetInnerHTML={{ __html: props.description }}
          ></div>
        ) : (
          <></>
        )}
      </div>
    </>
  ) : (
    <></>
  );
}
