import { createPortal } from "react-dom";

function Portal({ children, elementId }) {
  return createPortal(children, document.getElementById(elementId));
}

export default Portal;
