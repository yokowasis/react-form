import { useState } from "react";
import { icons } from "./Types";
import "./Input.scss";
import I from "./I";

type AppProps = {
  type: "text" | "select" | "password";
  id: string;
  label?: string;
  labelClass?: string;
  placeholder?: string;
  iconAfter?: icons;
  iconBefore?: icons;
  data?: string[];
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
