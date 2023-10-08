import { useState } from "react";
import { Link } from "react-router-dom";

function ButtonHeader(props) {
  const [showAction, setShowAction] = useState(false);
  const list = props.list.map((item) => (
    <div key={item.name} className={`${item.isActive ? "bg-blue-500" : "hover:bg-blue-500"}`}>
      <div className="py-2 px-4">
        <Link to={item.link}>
          <i className={`${item.icon} pr-4`}></i>
          {item.name}
          <br />
        </Link>
      </div>
    </div>
  ));

  return (
    <div className={`${props.isActive ? "bg-blue-800" : "hover:bg-blue-800"}`}>
      <div
        className="text-white"
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
    </div>
  );
}

export default ButtonHeader;
