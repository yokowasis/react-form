/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { icons } from "./Types";
import "./Input.scss";
import I from "./I";
import { slugify } from "./Fn";
import React from "react";

type AppProps = {
  type:
    | "text"
    | "select"
    | "password"
    | "checkbox"
    | "textarea"
    | "radio"
    | "time"
    | "uploadimage"
    | "number"
    | "date";
  id: string;
  label?: string;
  labelClass?: string;
  placeholder?: string;
  iconAfter?: icons;
  iconBefore?: icons;
  checked?: string[];
  isChecked?: boolean;
  inline?: boolean;
  data?: string[];
  dataLabels?: string[];
  rows?: number;
  value?: string;
  style?: React.CSSProperties;
  readonly?: boolean;
  dataShowAll?: boolean;
  description?: string;
  mb?: 0 | 1 | 2 | 3 | 4 | 5;
  onBlur?: (e: any) => void;
  onChange?: (e: any) => void;
};

export default function Input(props: AppProps) {
  const [filteredData, setFilteredData] = useState<string[]>([]);
  const [value, setValue] = useState("");

  function showPassword() {
    const input = document.getElementById(props.id) as HTMLInputElement;
    if (input.type === "password") {
      input.type = "text";
    } else {
      input.type = "password";
    }
  }

  useEffect(() => {
    setValue(props.value || "");
  }, [props.value]);

  return props.type === "text" ||
    props.type === "number" ||
    props.type === "time" ||
    props.type === "password" ||
    props.type === "date" ? (
    <div
      style={{ position: "relative" }}
      className={`mb-${props.mb >= 0 ? props.mb : 3}`}
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
          value={value}
          onBlur={props.onBlur}
          readOnly={props.readonly}
          onFocus={() => {
            if (props.dataShowAll) {
              setFilteredData(props.data || []);
            }
          }}
          onChange={(e) => {
            const target = e.target as any as { value: string };
            const val = target.value as string;
            setValue(val);
            if (val === "") {
              if (props.dataShowAll) {
                setFilteredData(props.data || []);
              } else {
                setFilteredData([]);
              }
            } else {
              setFilteredData(
                props.data?.filter((item) =>
                  item.toLowerCase().includes(target.value.toLowerCase())
                ) as string[]
              );
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
            style={{ position: "absolute" }}
          >
            {filteredData.map((item, i) => (
              <div
                key={i}
                onClick={() => {
                  setValue(item);
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
      >
        {props.value}
      </textarea>
      {props.description ? (
        <div
          className="fs-08 mt-1"
          dangerouslySetInnerHTML={{ __html: props.description }}
        ></div>
      ) : (
        <></>
      )}
    </div>
  ) : props.type === "checkbox" ? (
    <div className={`mb-${props.mb >= 0 ? props.mb : 3}`}>
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
        className={`mb-${props.mb >= 0 ? props.mb : 3}`}
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
            value={value}
            readOnly
          />
          <div className="input-group-append">
            <button
              className="input-group-text btn-danger btn"
              onClick={() => {
                const s = document.getElementById(props.id) as HTMLInputElement;
                s.value = "";
                setValue("");
              }}
            >
              <I c="trash" />
            </button>
            <button
              className="input-group-text btn-primary btn"
              onClick={() => {
                const input = document.getElementById(
                  `${props.id}-selector`
                ) as HTMLInputElement;
                input.click();
              }}
            >
              <input
                type="file"
                className="d-none"
                id={`${props.id}-selector`}
                onChange={async (e) => {
                  setValue("Uploading...");
                  const target = e.target as any as { files: FileList };
                  if (!target) {
                    setValue("");
                    return;
                  }
                  const file = target.files[0];
                  const ext = file.name.split(".").pop();
                  const filename = `${props.id}-${Date.now()}.${ext}`;
                  await fetch(
                    `https://cbtadmin.bimasoft.workers.dev/?cbtindex=1&_=/s3/add&filekey=${filename}`,
                    {
                      headers: {
                        "Content-Type": "application/octet-stream",
                        Accept: "application/json",
                      },
                      method: "POST",
                      body: file,
                    }
                  );
                  setValue(`https://s3.app.web.id/${filename}`);
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
        className={`mb-${props.mb >= 0 ? props.mb : 3}`}
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
