import { useState } from "react";

function Button(props) {
  const [showAction, setShowAction] = useState(false);
  const list = props.names.map((item) => (
    <div key={item.name} className="py-2 px-4 hover:bg-gray-200" onClick={item.action}>
      <i className={`${item.icon} pr-4`}></i>
      {item.name}
      <br />
    </div>
  ));

  return (
    <div
      className="ml-auto"
      onMouseMove={() => setShowAction(true)}
      onMouseOut={() => setShowAction(false)}
    >
      <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700">
        <i className={`${props.iconAction} pr-2`}></i>
        {props.action}
      </button>
      {showAction ? (
        <>
          <div className="absolute bg-white ml-auto w-60 py-3 z-10">
            {list}
          </div>
        </>
      ) : null}
    </div>
  );
}

export default Button;
