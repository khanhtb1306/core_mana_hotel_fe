import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

function ButtonHeader(props) {
  const [showAction, setShowAction] = useState(false);
  const list = props.list.map((item) => (
    <div key={item.name} className={`${item.isActive ? "bg-blue-500" : "hover:bg-blue-500"}`}>
      <div className="py-2 px-4">
        <NavLink to={item.link} className="p-4">
          <i className={`${item.icon} pr-4`}></i>
          {item.name}
          <br />
        </NavLink>
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
          <NavLink to="#" className="text-white p-4">
            <i className={`${props.icon} pr-3`}></i>
            {props.name}
          </NavLink>
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
