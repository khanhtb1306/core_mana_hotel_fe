import { useState } from "react";
import { Link } from "react-router-dom";

function ButtonHeader(props) {
  const [showAction, setShowAction] = useState(false);
  const list = props.list.map((item) => (
    <div className="py-2 px-4 hover:bg-blue-500">
      <Link>
        <i class={`${item.icon} pr-4`}></i>
        {item.name}
        <br />
      </Link>
    </div>
  ));

  return (
    <div
      className="text-white hover:bg-blue-800"
      onMouseMove={() => setShowAction(true)}
      onMouseOut={() => setShowAction(false)}
    >
      <li className="p-4">
        <Link to="#" className="text-white">
          <i className={`${props.icon} pr-3`}></i>
          {props.name}
        </Link>
      </li>
      {showAction && (
        <div className="absolute bg-blue-800 ml-auto w-60 py-3 z-10">
          {list}
        </div>
      )}
    </div>
  );
}

export default ButtonHeader;
