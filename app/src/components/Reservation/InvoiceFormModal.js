import { useState } from "react";
import SearchProduct from "../Search/SearchProduct";
import Modal from "../UI/Modal";
import { useLoaderData } from "react-router-dom";

function InvoiceFormModal(props) {
  const { goodsUnit } = useLoaderData();
  const [isGoods, setIsGoods] = useState(true);
  const invoice = props.invoice;
  const productUnit = goodsUnit.filter((unit) => unit.goods.goodsCategory);
  const service = goodsUnit.filter((unit) => !unit.goods.goodsCategory);
  let array = [];
  if (invoice) {
    array = goodsUnit
      .filter((unit) => {
        for (const stock of invoice.listInventoryCheckDetails) {
          if (stock.goods.goodsId === unit.goods.goodsId && unit.isDefault) {
            return true;
          }
        }
        return false;
      })
      .map((unit) => {
        return {
          ...unit,
          number: 1,
        };
      });
  }
  const [products, setProducts] = useState(array);

  const handleProductClick = (goodsUnitId) => {
    const index = products.findIndex(
      (unit) => unit.goodsUnitId === goodsUnitId
    );
    if (index !== -1) {
      products[index].number++;
      setProducts([...products]);
    } else {
      const updateProducts = [
        ...products,
        {
          ...goodsUnit.find((unit) => unit.goodsUnitId === goodsUnitId),
          number: 1,
        },
      ];
      setProducts(updateProducts);
    }
  };

  const handleProductDelete = (goodsUnitId) => {
    const updateProducts = products.filter(
      (unit) => unit.goodsUnitId !== goodsUnitId
    );
    setProducts(updateProducts);
  };

  return (
    <Modal open={props.open} onClose={props.onClose} size="w-10/12 h-.5/6">
      <div className="p-2 w-full">
        <div className="mb-5">
          <h1 className="text-lg pb-5 font-bold">{props.name}</h1>
        </div>
        <div className="flex">
          <div className="w-5/12 bg-gray-200 rounded-lg p-2">
            <SearchProduct
              goodsUnit={goodsUnit}
              handleProductClick={handleProductClick}
            />
            <div className="flex mt-2">
              <button
                type="button"
                className={`p-2 rounded-lg ${
                  isGoods
                    ? "text-white bg-green-500"
                    : "text-gray-600 bg-gray-300"
                }`}
                onClick={() => setIsGoods(true)}
              >
                Sản phẩm
              </button>
              <button
                type="button"
                className={`p-2 rounded-lg ${
                  isGoods
                    ? "text-gray-600 bg-gray-300"
                    : "text-white bg-green-500"
                }`}
                onClick={() => setIsGoods(false)}
              >
                Dịch vụ
              </button>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-4">
              {isGoods ? (
                <>
                  {productUnit.map((unit) => {
                    return (
                      <button
                        type="button"
                        key={unit.goodsUnitId}
                        className="text-left"
                        onClick={() => handleProductClick(unit.goodsUnitId)}
                      >
                        <div className="flex">
                          <img
                            src={unit.goods.image}
                            alt={unit.goods.goodsName}
                            className="w-10 h-10"
                          />
                          <div>
                            <p>
                              {unit.goods.goodsName +
                                " (" +
                                unit.goodsUnitName +
                                ")"}
                            </p>
                            <p className="text-sm text-gray-500">
                              {unit.goods.goodsId}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </>
              ) : (
                <>
                  {service.map((unit) => {
                    return (
                      <button
                        type="button"
                        key={unit.goodsUnitId}
                        className="text-left"
                        onClick={() => handleProductClick(unit.goodsUnitId)}
                      >
                        <div className="flex">
                          <img
                            src={unit.goods.image}
                            alt={unit.goods.goodsName}
                            className="w-10 h-10"
                          />
                          <div>
                            <p>
                              {unit.goods.goodsName +
                                " (" +
                                unit.goodsUnitName +
                                ")"}
                            </p>
                            <p className="text-sm text-gray-500">
                              {unit.goods.goodsId}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </>
              )}
            </div>
          </div>
          <div className="w-7/12 mx-5">
            {products.map((unit) => {
              return (
                <div className="flex border mb-2 rounded p-2">
                  <div className="w-4/12">
                    {unit.goods.goodsName + " (" + unit.goodsUnitName + ")"}
                  </div>
                  <div className="w-2/12">
                    <input
                      type="number"
                      className="w-16"
                      name="goods"
                      value={unit.number}
                      onChange={(e) => {
                        const index = products.findIndex(
                          (u) => u.goodsUnitId === unit.goodsUnitId
                        );
                        if (index !== -1) {
                          products[index].number = e.target.value;
                          setProducts([...products]);
                        }
                      }}
                    />
                  </div>
                  <div className="w-2/12">{unit.price.toLocaleString()}</div>
                  <div className="w-3/12">
                    {(unit.price * unit.number).toLocaleString()}
                  </div>
                  <div className="w-1/12">
                    <button
                      type="button"
                      onClick={() => handleProductDelete(unit.goodsUnitId)}
                    >
                      <i className="fa-solid fa-trash fa-lg"></i>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default InvoiceFormModal;
