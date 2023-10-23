import { useState } from "react";

function SearchProduct(props) {
  const products = props.products;
  console.log(products);
  const [rows, setRows] = useState(products);
  const [openSearchModal, setOpenSearchModal] = useState(false);
  const handleValueChange = (e) => {
    const value = e.target.value;
    const newRows = products.filter(
      (pro) =>
        pro.goods.goodsName.includes(value) || pro.goods.goodsId.includes(value)
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
    <div className="p-3">
      <div className="w-full shadow-md rounded-lg inline-flex bg-white hover:border hover:border-green-500">
        <i className="pl-4 fa-solid fa-magnifying-glass my-auto"></i>
        <input
          className="rounded-lg border-0 w-full focus:ring-0"
          placeholder="Tìm theo tên, mã hàng hoá"
          onChange={handleValueChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>
      {openSearchModal && (
        <div className="absolute bg-white rounded-lg max-h-96 w-3/12 py-3 z-10 overflow-auto">
          {rows.length > 0 ? (
            rows.map((row, index) => (
              <div key={index} className="m-2 p-2 rounded-lg hover:bg-gray-300">
                <button type="button" className="w-full">
                  <h2 className="text-left">{`${row.goods.goodsName} (${row.listGoodsUnit[0].goodsUnitName})`}</h2>
                  <div className="flex text-sm text-gray-500">
                    <p>{row.goods.goodsId}</p>
                    <p className="ml-auto">{row.listGoodsUnit[0].price}</p>
                  </div>
                </button>
              </div>
            ))
          ) : (
            <div className="p-4">
              <p className="text-gray-500 text-center">
                Không tìm thấy hàng hoá phù hợp
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchProduct;
