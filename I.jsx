import React from "react";

/**
 *
 * @param {{ c: import("./Types").icons }} props
 * @returns
 */
export default function I(props) {
  return <i className={`bi-${props.c} mr-1`}></i>;
}
