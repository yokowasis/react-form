import { useState } from "react";
import { icons } from "./Types";
import "./Input.scss";

type AppProps = {
  type: "text" | "select";
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

  return props.type === "text" ? (
    <div style={{ position: "relative" }} class={"mb-3"}>
      {props.label ? (
        <div className={props.labelClass}>
          <label for={`${props.id}`}>{props.label}</label>
        </div>
      ) : (
        <></>
      )}
      <div class="input-group">
        {props.iconBefore ? (
          <>
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i className={`bi-${props.iconBefore}`}></i>
              </span>
            </div>
          </>
        ) : (
          <></>
        )}

        <input
          type="text"
          class="form-control"
          placeholder={props.placeholder}
          id={props.id}
          value={value}
          onfocusout={() => {
            if (props.data?.length) {
              // make sure value is in props.data
              if (props.data.includes(value)) {
                setValue(value);
              } else {
                setValue("");
              }
            }
          }}
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
        {props.iconAfter ? (
          <>
            <div class="input-group-append">
              <span class="input-group-text">
                <i className={`bi-${props.iconAfter}`}></i>
              </span>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
      {filteredData.length > 0 ? (
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
    <div class="form-group">
      <label for="exampleFormControlSelect1">Example select</label>
      <select class="form-control" id={props.id}>
        {props.data?.map((item) => (
          <option>{item}</option>
        ))}
      </select>
    </div>
  ) : (
    <></>
  );
}
