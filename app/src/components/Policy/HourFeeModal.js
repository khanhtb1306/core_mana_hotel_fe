import { DataGrid } from "@mui/x-data-grid";
import Modal from "../UI/Modal";
import { useState } from "react";

function HourFeeModal(props) {
  const categories = props.categories;
  console.log(props.listSoonCheckin);
  console.log(props.listLateCheckout);
  const listDefaultHourFee = categories.map((category, i) => {
    const listSoonCheckinByCateId =
      props.listSoonCheckin.LIST_EARLIER_OVERTIME_SURCHARGE_DETAIL.filter(
        (checkin) =>
          checkin.roomCategory.roomCategoryId ===
          category.roomCategory.roomCategoryId
      );
    let listCheckin = [];
    if (listSoonCheckinByCateId.length > 0) {
      listCheckin = listSoonCheckinByCateId.map((checkin) => {
        return {
          key: i,
          hour: checkin.from,
          price: checkin.value,
        };
      });
    } else {
      listCheckin = [
        {
          key: i,
          hour: 1,
          price: 0,
        },
      ];
    }
    const listLateCheckoutByCateId =
      props.listLateCheckout.LIST_LATER_OVERTIME_SURCHARGE_DETAIL.filter(
        (checkout) =>
          checkout.roomCategory.roomCategoryId ===
          category.roomCategory.roomCategoryId
      );
    let listCheckout = [];
    if (listLateCheckoutByCateId.length > 0) {
      listCheckout = listLateCheckoutByCateId.map((checkout) => {
        return {
          key: i,
          hour: checkout.from,
          price: checkout.value,
        };
      });
    } else {
      listCheckout = [
        {
          key: i,
          hour: 1,
          price: 0,
        },
      ];
    }
    return {
      roomCategoryId: category.roomCategory.roomCategoryId,
      listCheckin: listCheckin,
      listCheckout: listCheckout,
    };
  });

  const [listHourFee, setListHourFee] = useState(listDefaultHourFee);

  const handleSoonCheckinAdd = (category) => {
    const newHour = {
      hour: category.listCheckin[category.listCheckin.length - 1].hour + 1,
      price: 0,
    };
    const updateListHourFee = listHourFee.map((cate, i) => {
      if (cate.roomCategoryId === category.roomCategoryId) {
        return {
          key: i,
          ...cate,
          listCheckin: [...cate.listCheckin, newHour],
        };
      } else {
        return {
          key: i,
          ...cate,
        };
      }
    });
    setListHourFee(updateListHourFee);
  };

  const handleSoonCheckinRemove = (category, i) => {
    const updateListHourFee = listHourFee.map((cate) => {
      if (cate.roomCategoryId === category.roomCategoryId) {
        return {
          key: i,
          ...cate,
          listCheckin: cate.listCheckin.filter((checkin, index) => index !== i),
        };
      } else {
        return {
          key: i,
          ...cate,
        };
      }
    });
    setListHourFee(updateListHourFee);
  };

  const handleLateCheckoutAdd = (category) => {
    const newHour = {
      hour: category.listCheckout[category.listCheckout.length - 1].hour + 1,
      price: 0,
    };
    const updateListHourFee = listHourFee.map((cate, i) => {
      if (cate.roomCategoryId === category.roomCategoryId) {
        return {
          key: i,
          ...cate,
          listCheckout: [...cate.listCheckout, newHour],
        };
      } else {
        return {
          key: i,
          ...cate,
        };
      }
    });
    setListHourFee(updateListHourFee);
  };

  const handleLateCheckoutRemove = (category, i) => {
    const updateListHourFee = listHourFee.map((cate) => {
      if (cate.roomCategoryId === category.roomCategoryId) {
        return {
          key: i,
          ...cate,
          listCheckout: cate.listCheckout.filter(
            (checkin, index) => index !== i
          ),
        };
      } else {
        return {
          key: i,
          ...cate,
        };
      }
    });
    setListHourFee(updateListHourFee);
  };

  return (
    <Modal open={props.open} onClose={props.onClose} size="w-10/12 h-.5/6">
      <div className="p-2 w-full">
        <div className="mb-5">
          <h1 className="text-lg pb-5 font-bold">Thiết lập phụ thu thêm giờ</h1>
        </div>
        <table className="min-w-full border border-gray-300 divide-y divide-gray-300">
          <thead className="bg-blue-100">
            <tr>
              <td className="py-2 px-4 w-2/12">Mã hạng phòng</td>
              <td className="py-2 px-4 w-2/12">Tên hạng phòng</td>
              <td className="py-2 px-4 w-1/12">Loại giá</td>
              <td className="py-2 px-4 w-1/12">Mức giá</td>
              <td className="py-2 px-4 w-3/12">Giá nhận sớm</td>
              <td className="py-2 px-4 w-3/12">Giá trả muộn</td>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => {
              const cate = listHourFee.find(
                (hourFee) =>
                  hourFee.roomCategoryId ===
                  category.roomCategory.roomCategoryId
              );
              return (
                <tr key={index} className="border border-gray-300">
                  <td className="py-2 px-4">
                    <div>
                      <h2>{category.roomCategory.roomCategoryId}</h2>
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div>{category.roomCategory.roomCategoryName}</div>
                  </td>
                  <td className="py-2 px-4">
                    <div className="pb-4">Giá giờ</div>
                    <div>Giá ngày</div>
                    <div className="pt-4">Giá đêm</div>
                  </td>
                  <td className="py-2 px-4">
                    <div className="pb-4">
                      {category.roomCategory.priceByHour.toLocaleString()}
                    </div>
                    <div>
                      {category.roomCategory.priceByDay.toLocaleString()}
                    </div>
                    <div className="pt-4">
                      {category.roomCategory.priceByNight.toLocaleString()}
                    </div>
                  </td>
                  <td>
                    {cate.listCheckin.map((checkin, index) => {
                      return (
                        <div>
                          Từ giờ thứ
                          <input
                            className="border-0 border-b border-gray-500 w-16 focus:border-b-2 focus:border-green-500 focus:ring-0"
                            type="number"
                            name="123"
                            value={checkin.hour}
                            onChange={(e) => {
                              const i = index;
                              const check = cate.listCheckin.map(
                                (checkin, index) => {
                                  if (index === i) {
                                    return {
                                      hour: Number(e.target.value),
                                      price: checkin.price,
                                    };
                                  } else {
                                    return checkin;
                                  }
                                }
                              );
                              const updateListHourFee = listHourFee.map((c) => {
                                if (c.roomCategoryId === cate.roomCategoryId) {
                                  return {
                                    ...cate,
                                    listCheckin: check,
                                  };
                                } else {
                                  return {
                                    ...c,
                                  };
                                }
                              });
                              setListHourFee(updateListHourFee);
                            }}
                            min={
                              index > 0
                                ? cate.listCheckin[index - 1].hour + 1
                                : 1
                            }
                            max={
                              index < cate.listCheckin.length - 1
                                ? cate.listCheckin[index + 1].hour - 1
                                : 5
                            }
                          />
                          giá
                          <input
                            className="border-0 border-b border-gray-500 w-28 focus:border-b-2 focus:border-green-500 focus:ring-0"
                            type="number"
                            name="123"
                            value={checkin.price}
                            onChange={(e) => {
                              const i = index;
                              const check = cate.listCheckin.map(
                                (checkin, index) => {
                                  if (index === i) {
                                    return {
                                      hour: checkin.hour,
                                      price: Number(e.target.value),
                                    };
                                  } else {
                                    return checkin;
                                  }
                                }
                              );
                              const updateListHourFee = listHourFee.map((c) => {
                                if (c.roomCategoryId === cate.roomCategoryId) {
                                  return {
                                    ...cate,
                                    listCheckin: check,
                                  };
                                } else {
                                  return {
                                    ...c,
                                  };
                                }
                              });
                              setListHourFee(updateListHourFee);
                            }}
                            min={0}
                          />
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() =>
                                handleSoonCheckinRemove(cate, index)
                              }
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          )}
                        </div>
                      );
                    })}
                    {cate.listCheckin[cate.listCheckin.length - 1].hour < 5 && (
                      <div className="text-center mt-2">
                        <button
                          type="button"
                          className="text-blue-500"
                          onClick={() => handleSoonCheckinAdd(cate)}
                        >
                          <i className="fa-solid fa-plus mr-2"></i>
                          Thêm giờ
                        </button>
                      </div>
                    )}
                  </td>
                  <td>
                    {cate.listCheckout.map((checkout, index) => {
                      return (
                        <div>
                          Từ giờ thứ
                          <input
                            className="border-0 border-b border-gray-500 w-16 focus:border-b-2 focus:border-green-500 focus:ring-0"
                            type="number"
                            name="price"
                            value={checkout.hour}
                            onChange={(e) => {
                              const i = index;
                              const check = cate.listCheckout.map(
                                (checkin, index) => {
                                  if (index === i) {
                                    return {
                                      hour: Number(e.target.value),
                                      price: checkin.price,
                                    };
                                  } else {
                                    return checkin;
                                  }
                                }
                              );
                              const updateListHourFee = listHourFee.map((c) => {
                                if (c.roomCategoryId === cate.roomCategoryId) {
                                  return {
                                    ...cate,
                                    listCheckout: check,
                                  };
                                } else {
                                  return {
                                    ...c,
                                  };
                                }
                              });
                              setListHourFee(updateListHourFee);
                            }}
                            min={
                              index > 0
                                ? cate.listCheckout[index - 1].hour + 1
                                : 1
                            }
                            max={
                              index < cate.listCheckout.length - 1
                                ? cate.listCheckout[index + 1].hour - 1
                                : 5
                            }
                          />
                          giá
                          <input
                            className="border-0 border-b border-gray-500 w-28 focus:border-b-2 focus:border-green-500 focus:ring-0"
                            type="number"
                            name="123"
                            value={checkout.price}
                            onChange={(e) => {
                              const i = index;
                              const check = cate.listCheckout.map(
                                (checkin, index) => {
                                  if (index === i) {
                                    return {
                                      hour: checkin.hour,
                                      price: Number(e.target.value),
                                    };
                                  } else {
                                    return checkin;
                                  }
                                }
                              );
                              const updateListHourFee = listHourFee.map((c) => {
                                if (c.roomCategoryId === cate.roomCategoryId) {
                                  return {
                                    ...cate,
                                    listCheckout: check,
                                  };
                                } else {
                                  return {
                                    ...c,
                                  };
                                }
                              });
                              setListHourFee(updateListHourFee);
                            }}
                            min={0}
                          />
                          {index > 0 && (
                            <button type="button">
                              <i
                                className="fa-solid fa-trash"
                                onClick={() =>
                                  handleLateCheckoutRemove(cate, index)
                                }
                              ></i>
                            </button>
                          )}
                        </div>
                      );
                    })}
                    {cate.listCheckout[cate.listCheckout.length - 1].hour <
                      5 && (
                      <div className="text-center mt-2">
                        <button
                          type="button"
                          className="text-blue-500"
                          onClick={() => handleLateCheckoutAdd(cate)}
                        >
                          <i className="fa-solid fa-plus mr-2"></i>
                          Thêm giờ
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Modal>
  );
}

export default HourFeeModal;
