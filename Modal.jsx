import React from "react";
import { closeModal } from "./Fn";

/**
 *
 * @param {{
 * id: string;
 * children: React.ReactNode;
 * title: string;
 * confirmFunc?: (closeModal: () => void) => void;
 * }} props
 * @returns
 */
export default function Modal(props) {
  const close = () => {
    closeModal(props.id);
  };

  return (
    <>
      <button
        type="button"
        className="d-none"
        data-toggle="modal"
        id={`modalBtn-${props.id}`}
        data-target={`#${props.id}`}
      >
        Launch demo modal
      </button>

      <div
        className="modal fade"
        id={props.id}
        tabIndex={-1}
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {props.title}
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                id={`modalBtnClose-${props.id}`}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">{props.children}</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  if (props.confirmFunc) props.confirmFunc(close);
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
