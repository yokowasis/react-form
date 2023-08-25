import { icons } from "./Types";

export default function I(props: { c: icons }) {
  return <i className={`bi-${props.c}`}></i>;
}
