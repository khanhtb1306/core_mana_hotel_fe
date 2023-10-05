function FilterSearch(props) {
  let list = "";
  if (props.all) {
    list = props.all.map((name) => <p key={name}>{name}</p>);
  }
  return (
    <>
      <div className="p-5 shadow-md mb-10 bg-white">
        <h3 className="pb-5">{props.name}</h3>
        <input
          className="w-full py-2 px-3 text-gray-700 border-0 border-b focus:border-b-2 focus:border-green-500 focus:ring-0 "
          id="username"
          type="text"
          placeholder={props.subName}
        />
        <div className="pt-5">{list}</div>
      </div>
    </>
  );
}

export default FilterSearch;
