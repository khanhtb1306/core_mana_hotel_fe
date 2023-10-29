import { useState } from "react";
import { Tooltip } from "react-tooltip";
import NewCustomer from "../Customer/NewCustomer";

function SearchCateRoom(props) {
  const categories = props.categories;
  console.log(categories);
  const [rows, setRows] = useState(categories);
  const [openSearchModal, setOpenSearchModal] = useState(false);

  const handleValueChange = (e) => {
    const value = e.target.value;
    const newRows = categories.filter((pro) =>
      pro.goodsName.toLowerCase().includes(value.toLowerCase())
    );
    setRows(newRows);
  };

  const handleFocus = () => {
    setOpenSearchModal(true);
  };

  const handleBlur = () => {
    setOpenSearchModal(false);
  };

  return (
    <div className="relative w-6/12">
      <div className="w-full shadow-md rounded-lg inline-flex bg-white hover:border hover:border-green-500">
        <i className="pl-4 fa-solid fa-magnifying-glass my-auto"></i>
        <input
          className="rounded-lg border-0 w-full focus:ring-0"
          placeholder="Thêm hạng phòng vào bảng giá"
          onChange={handleValueChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>
      {openSearchModal && (
        <div className="absolute bg-white rounded-lg max-h-96 w-full py-3 overflow-auto">
          {rows.length > 0 ? (
            rows.map((row, index) => (
              <div key={index} className="m-2 p-2 rounded-lg hover:bg-gray-300">
                <button type="button" className="w-full text-left">
                  <h2>{row.roomCategory.roomCategoryName}</h2>
                  <p className="text-sm text-gray-500">{row.roomCategory.roomCategoryId}</p>
                </button>
              </div>
            ))
          ) : (
            <div className="p-4">
              <p className="text-gray-500 text-center">
                Không tìm thấy hạng phòng phù hợp
              </p>
            </div>
          )}
        </div>
      )}
      <Tooltip anchorSelect=".add-customer" place="right">
        Thêm khách hàng
      </Tooltip>
    </div>
  );
}

export default SearchCateRoom;
