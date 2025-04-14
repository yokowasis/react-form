import { icons } from "./Types";

export default function I(props: { c: icons }) {
  return <i className={`bi-${props.c} mr-1`}></i>;
}
