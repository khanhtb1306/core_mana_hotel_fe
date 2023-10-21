function ButtonClick(props) {
  return (
    <div className="ml-auto">
      <button
        type="button"
        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700"
        onClick={props.action}
      >
        <i className={`${props.iconAction} pr-2`}></i>
        {props.name}
      </button>
    </div>
  );
}

export default ButtonClick;
