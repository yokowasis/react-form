import { useState } from "react";
import { icons } from "./Types";
import "./Input.scss";
import I from "./I";
import { slugify } from "./Fn";

type AppProps = {
  type: "text" | "select" | "password" | "checkbox" | "textarea" | "radio";
  id: string;
  label?: string;
  labelClass?: string;
  placeholder?: string;
  iconAfter?: icons;
  iconBefore?: icons;
  checked?: boolean;
  data?: string[];
  rows?: number;
  value?: string;
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

  return props.type === "text" || props.type === "password" ? (
    <div style={{ position: "relative" }} class={"mb-3"}>
      {props.label ? (
        <div className={props.labelClass}>
          <label for={`${props.id}`}>{props.label}</label>
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
          type={props.type}
          className="form-control"
          placeholder={props.placeholder}
          autocomplete={"off"}
          id={props.id}
          value={value}
          onChange={(e) => {
            const target = e.target as any as { value: string };
            const val = target.value as string;
            setValue(val);
            if (val === "") {
              setFilteredData([]);
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
            {filteredData.map((item) => (
              <div
                onClick={() => {
                  setValue(item);
                  setFilteredData([]);
                }}
                className={"autoInputChildren p-2"}
              >
                {item}
              </div>
            ))}
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  ) : props.type === "radio" ? (
    <div className={"mb-3"}>
      {props.label ? (
        <>
          <div className={"mb-1"}>{props.label}</div>
        </>
      ) : (
        <></>
      )}
      {props.data?.map((item) => (
        <div class="form-check">
          <input
            class="form-check-input"
            type="radio"
            name={props.id}
            id={`radio-${props.id}-${slugify(item)}`}
            value={item}
            checked={props.value === item}
          />
          <label
            class="form-check-label"
            for={`radio-${props.id}-${slugify(item)}`}
          >
            {item}
          </label>
        </div>
      ))}
    </div>
  ) : props.type === "textarea" ? (
    <div className={"mb-3"}>
      <div class="form-group">
        {props.label ? (
          <>
            <label for={props.id}>{props.label}</label>
          </>
        ) : (
          <></>
        )}
        <textarea
          class="form-control"
          id={props.id}
          rows={props.rows || 3}
        ></textarea>
      </div>
    </div>
  ) : props.type === "checkbox" ? (
    <>
      <div class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          value=""
          id={props.id}
          checked={props.checked}
          onChange={props.onChange}
        />
        {props.label ? (
          <>
            <label class="form-check-label" for={props.id}>
              {props.label}
            </label>
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  ) : props.type === "select" ? (
    <>
      <div style={{ position: "relative" }} class={"mb-3"}>
        {props.label ? (
          <div className={props.labelClass}>
            <label for={`${props.id}`}>{props.label}</label>
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
            {props.data?.map((item) => (
              <option>{item}</option>
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
      </div>
    </>
  ) : (
    <></>
  );
}
