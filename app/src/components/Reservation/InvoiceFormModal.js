import { useState } from "react";
import SearchProduct from "../Search/SearchProduct";
import Modal from "../UI/Modal";
import { Form, useLoaderData } from "react-router-dom";
import Swal from "sweetalert2";

function InvoiceFormModal(props) {
  const { goodsUnit } = useLoaderData();
  const goodsActiveUnit = goodsUnit.filter((unit) => unit.goods.status === 1);
  const [isGoods, setIsGoods] = useState(true);
  const invoice = props.invoice;
  const reservationDetail = props.reservationDetail;
  // console.log(reservationDetail);
  // console.log(invoice);
  // console.log(goodsActiveUnit);
  const productUnit = goodsActiveUnit.filter(
    (unit) => unit.goods.inventory > 0 && unit.goods.goodsCategory
  );
  const service = goodsActiveUnit.filter((unit) => !unit.goods.goodsCategory);
  let array = [];
  if (invoice) {
    array = goodsActiveUnit
      .filter((unit) => {
        for (const stock of invoice.listOrderDetailByOrder) {
          if (stock.orderDetail.goodsUnit.goodsUnitId === unit.goodsUnitId) {
            return true;
          }
        }
        return false;
      })
      .map((unit, index) => {
        return {
          ...unit,
          number: invoice.listOrderDetailByOrder.find(
            (good) =>
              good.orderDetail.goodsUnit.goodsUnitId === unit.goodsUnitId
          ).orderDetail.quantity,
        };
      });
    // console.log(array);
  }
  const [products, setProducts] = useState(array);
  // console.log(products);

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
          ...goodsActiveUnit.find((unit) => unit.goodsUnitId === goodsUnitId),
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

  const groupDefautProduct = products.reduce((product, cur) => {
    const defaultGood = goodsActiveUnit.find(
      (unit) => unit.isDefault && unit.goods.goodsId === cur.goods.goodsId
    );
    const exchange = cur.cost / defaultGood.cost;
    const exist = product.find(
      (pro) => pro.goods.goodsId === cur.goods.goodsId
    );
    if (exist) {
      return [
        {
          ...exist,
          number: exist.number + exchange * cur.number,
        },
      ];
    } else {
      return [
        ...product,
        {
          ...defaultGood,
          number: exchange * cur.number,
        },
      ];
    }
  }, []);
  // console.log(groupDefautProduct);

  let check = false;

  if (
    products.length <= 0 ||
    products.some((product) => product.number <= 0) ||
    groupDefautProduct.some(
      (product) => product.goods.inventory < product.number
    )
  ) {
    check = false;
  } else {
    check = true;
  }

  return (
    <Form method={props.method} onSubmit={props.onClose}>
      <Modal
        open={props.open}
        onClose={props.onClose}
        size="w-10/12 h-.5/6"
        button={true}
      >
        <div className="p-2 w-full">
          <div className="mb-5">
            <h1 className="text-lg pb-5 font-bold">{props.name}</h1>
            <input type="hidden" name="isInvoice" defaultValue={true} />
            {invoice && (
              <input
                type="hidden"
                name="orderId"
                defaultValue={invoice.order.orderId}
              />
            )}
            <input
              type="hidden"
              name="reservationDetailId"
              defaultValue={reservationDetail.reservationDetailId}
            />
            <input
              type="hidden"
              name="totalPay"
              value={products.reduce(
                (sum, item) => sum + item.price * item.number,
                0
              )}
              onChange={() => 1}
            />
            <input
              type="hidden"
              name="length"
              value={products.length}
              onChange={() => 1}
            />
          </div>
          <div className="flex">
            <div className="w-5/12 bg-gray-200 rounded-lg p-2">
              <SearchProduct
                goodsUnit={goodsActiveUnit.filter(
                  (unit) =>
                    unit.goods.inventory > 0 || unit.goods.inventory === null
                )}
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
                              src={`data:image/png;base64,${unit.goods.image}`}
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
                              src={`data:image/png;base64,${unit.goods.image}`}
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
              {products.map((unit, index) => {
                return (
                  <div key={index} className="flex border mb-2 rounded p-2">
                    <input
                      type="hidden"
                      name={`goodsId${index}`}
                      defaultValue={unit.goods.goodsId}
                    />
                    <input
                      type="hidden"
                      name={`goodsUnitId${index}`}
                      defaultValue={unit.goodsUnitId}
                    />
                    <input
                      type="hidden"
                      name={`price${index}`}
                      defaultValue={unit.price}
                    />
                    <div className="w-4/12">
                      {unit.goods.goodsName + " (" + unit.goodsUnitName + ")"}
                    </div>
                    <div className="w-2/12">
                      <input
                        type="number"
                        className="w-16"
                        name={`number${index}`}
                        value={unit.number}
                        onChange={(e) => {
                          const index = products.findIndex(
                            (u) => u.goodsUnitId === unit.goodsUnitId
                          );
                          if (index !== -1) {
                            products[index].number = Number(e.target.value);
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
        <div className="flex pt-5">
          <div className="ml-auto">
            <button
              type={check ? "" : "button"}
              className="bg-green-500 mr-10 py-2 px-6 text-white rounded hover:bg-green-600"
              onClick={() => {
                if (!check) {
                  let message = "";
                  if (products.length <= 0) {
                    message = "Cần thêm hàng hoá hoặc dịnh vụ để tạo đơn";
                  } else if (products.some((product) => product.number <= 0)) {
                    message = "Số lượng hàng hoá hoặc dịch vụ phải lớn hơn 0";
                  } else if (
                    groupDefautProduct.some(
                      (product) => product.goods.inventory < product.number
                    )
                  ) {
                    message = "Đã quá số lượng trong kho đối với";
                    groupDefautProduct.map((product) => {
                      if (product.goods.inventory < product.number) {
                        message += " " + product.goods.goodsName;
                      }
                    });
                  }
                  Swal.fire({
                    position: "bottom",
                    html: `<div class="text-sm"><button type="button" class="px-4 py-2 mt-2 rounded-lg bg-red-800 text-white">${message}</button>`,
                    showConfirmButton: false,
                    background: "transparent",
                    backdrop: "none",
                    timer: 2000,
                  });
                }
              }}
            >
              Lưu
            </button>
            <button
              type="button"
              className="bg-gray-400 py-2 px-6 text-white rounded hover:bg-gray-500"
              onClick={() => {
                props.onClose();
              }}
            >
              Bỏ qua
            </button>
          </div>
        </div>
      </Modal>
    </Form>
  );
}

export default InvoiceFormModal;
