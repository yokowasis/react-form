import { icons } from "./Types";

type AppProps = {
  type: "text" | "select";
  id: string;
  label?: string;
  labelClass?: string;
  placeholder?: string;
  iconAfter?: icons;
  iconBefore?: icons;
  data?:
    | {
        label: string;
        value: string;
      }[]
    | string[];
};

export default function Input(props: AppProps) {
  return props.type === "text" ? (
    <>
      {props.label ? (
        <div className={props.labelClass}>
          <label for={`${props.id}`}>{props.label}</label>
        </div>
      ) : (
        <></>
      )}
      <div class="input-group mb-3">
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
    </>
  ) : props.type === "select" ? (
    <div class="form-group">
      <label for="exampleFormControlSelect1">Example select</label>
      <select class="form-control" id={props.id}>
        {props.data?.map((item) =>
          typeof item === "string" ? (
            <option>{item}</option>
          ) : (
            <option value={item.value}>{item.label}</option>
          )
        )}
      </select>
    </div>
  ) : (
    <></>
  );
}
