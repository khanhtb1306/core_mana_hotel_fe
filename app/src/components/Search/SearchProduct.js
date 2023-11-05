import { useState } from "react";

function SearchProduct(props) {
  const products = props.goodsUnit.map((unit) => {
    return {
      goodsId: unit.goods.goodsId,
      goodsName: unit.goods.goodsName,
      goodsUnitName: unit.goodsUnitName,
      goodsUnitId: unit.goodsUnitId,
    };
  });
  const [rows, setRows] = useState(products);
  const [openSearchModal, setOpenSearchModal] = useState(false);
  const [goodsUnitId, setGoodsUnitId] = useState(null);
  
  const handleValueChange = (e) => {
    const value = e.target.value;
    const newRows = products.filter((pro) =>
      pro.goodsName.toLowerCase().includes(value.toLowerCase())
    );
    setRows(newRows);
  };

  const handleFocus = () => {
    setOpenSearchModal(true);
  };

  const handleBlur = () => {
    if (goodsUnitId) {
      props.handleProductClick(goodsUnitId);
      setRows(products.filter((pro) => pro.goodsUnitId !== goodsUnitId));
    }
    setGoodsUnitId(null);
    setOpenSearchModal(false);
  };

  return (
    <div className="relative">
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
        <div className="absolute bg-white rounded-lg max-h-96 w-full py-3 z-10 overflow-auto">
          {rows.length > 0 ? (
            rows.map((row, index) => (
              <div key={index}>
                <button
                  type="button"
                  className="w-full m-2 p-2 rounded-lg hover:bg-gray-300"
                  onMouseOver={() => {
                    setGoodsUnitId(row.goodsUnitId);
                  }}
                  onMouseLeave={() => {
                    setGoodsUnitId(null);
                  }}
                >
                  <h2 className="text-left">{`${row.goodsName} (${row.goodsUnitName})`}</h2>
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
