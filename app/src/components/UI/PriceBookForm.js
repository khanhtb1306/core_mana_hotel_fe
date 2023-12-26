import { Form, useLoaderData } from "react-router-dom";
import Modal from "./Modal";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { viVN } from "@mui/x-date-pickers/locales";
import { DatePicker, DateTimePicker } from "@mui/x-date-pickers";
import SearchCateRoom from "../Search/SearchCateRoom";
import { useState } from "react";
import DayInputForm from "./DayInputForm";
import Swal from "sweetalert2";
require("dayjs/locale/vi");

function PriceBookForm({ name, open, onClose, method, priceBook }) {
  const { categories, dataPriceBooks } = useLoaderData();
  const priceBooks = dataPriceBooks.result;
  const [namePrice, setNamePrice] = useState(
    priceBook ? priceBook.PriceList.priceListName : ""
  );
  let priceList = [];
  if (priceBook) {
    priceList = priceBook.ListPriceListDetail.map((price) => {
      const listPrice = price.PriceListDetailWithDayOfWeek.map((row) => {
        return {
          priceByHour: row.PriceListDetail.priceByHour,
          priceByDay: row.PriceListDetail.priceByDay,
          priceByNight: row.PriceListDetail.priceByNight,
          listDay: row.DayOfWeekList,
          timeApply: row.PriceListDetail.timeApply
            ? row.PriceListDetail.timeApply
            : null,
        };
      });
      return {
        roomCategoryId: price.RoomClass.roomCategoryId,
        roomCategoryName: price.RoomClass.roomCategoryName,
        defaultPrice: {
          priceByHour: price.RoomClass.priceByHour,
          priceByDay: price.RoomClass.priceByDay,
          priceByNight: price.RoomClass.priceByNight,
        },
        listPrice: listPrice,
      };
    });
  } else {
    priceList = categories.map((cate) => {
      return {
        roomCategoryId: cate.roomCategory.roomCategoryId,
        roomCategoryName: cate.roomCategory.roomCategoryName,
        defaultPrice: {
          priceByHour: cate.roomCategory.priceByHour,
          priceByDay: cate.roomCategory.priceByDay,
          priceByNight: cate.roomCategory.priceByNight,
        },
        listPrice: [],
      };
    });
  }

  const [listPriceBook, setListPriceBook] = useState(priceList);
  const [categoriesAdd, setCategoriesAdd] = useState(
    categories.filter((cate) => {
      if (listPriceBook.length > 0) {
        for (const prices of listPriceBook) {
          if (cate.roomCategory.roomCategoryId === prices.roomCategoryId) {
            return false;
          }
        }
      }
      return true;
    })
  );

  const [openNewDateModal, setOpenNewDateModal] = useState(false);
  const [openEditDateModal, setEditOpenDateModal] = useState(false);
  const [dayInput, setDayInput] = useState(null);
  const [dateStart, setDateStart] = useState(
    priceBook ? dayjs(priceBook.PriceList.effectiveTimeStart) : dayjs()
  );
  const [dateEnd, setDateEnd] = useState(
    priceBook
      ? dayjs(priceBook.PriceList.effectiveTimeEnd)
      : dayjs().add(1, "year")
  );

  const handleNewDayInput = (index, categoryRoomId) => {
    setDayInput([index, categoryRoomId]);
    setOpenNewDateModal(true);
  };

  const handleEditDayInput = (index, categoryRoomId) => {
    setDayInput([index, categoryRoomId]);
    setEditOpenDateModal(true);
  };

  const handeTimeDayAdd = (dayList, time) => {
    const priceBook = listPriceBook.find(
      (priceBook) => priceBook.roomCategoryId === dayInput[1]
    );
    const updatePrice = [
      ...priceBook.listPrice,
      {
        listDay: dayList,
        priceByHour: priceBook.defaultPrice.priceByHour,
        priceByDay: priceBook.defaultPrice.priceByDay,
        priceByNight: priceBook.defaultPrice.priceByNight,
        timeApply: time,
      },
    ];
    priceBook.listPrice = updatePrice;
  };

  const handeTimeDayDelete = () => {
    const priceBook = listPriceBook.find(
      (priceBook) => priceBook.roomCategoryId === dayInput[1]
    );
    const updatePrice = priceBook.listPrice
      .map((price, index) => {
        if (index !== dayInput[0]) {
          return price;
        }
      })
      .filter((item) => item !== undefined);
    priceBook.listPrice = updatePrice;
  };

  const handleCateRoomAdd = (categoryRoomId) => {
    setCategoriesAdd(
      categoriesAdd.filter(
        (cate) => cate.roomCategory.roomCategoryId !== categoryRoomId
      )
    );
    const cate = categoriesAdd.find(
      (cate) => cate.roomCategory.roomCategoryId === categoryRoomId
    );
    setListPriceBook([
      ...listPriceBook,
      {
        roomCategoryId: cate.roomCategory.roomCategoryId,
        roomCategoryName: cate.roomCategory.roomCategoryName,
        defaultPrice: {
          priceByHour: cate.roomCategory.priceByHour,
          priceByDay: cate.roomCategory.priceByDay,
          priceByNight: cate.roomCategory.priceByNight,
        },
        listPrice: [],
      },
    ]);
  };

  const handleCateRoomDelete = (roomCategoryId) => {
    setCategoriesAdd([
      ...categoriesAdd,
      categories.find(
        (cate) => cate.roomCategory.roomCategoryId === roomCategoryId
      ),
    ]);
    setListPriceBook(
      listPriceBook.filter(
        (priceBook) => priceBook.roomCategoryId !== roomCategoryId
      )
    );
  };

  let check = false;

  if (
    namePrice === "" ||
    (priceBooks.some((price) => price.PriceList.priceListName === namePrice) &&
      ((priceBook && namePrice !== priceBook.PriceList.priceListName) ||
        !priceBook)) ||
    listPriceBook.every((priceBook) => priceBook.listPrice.length <= 0)
  ) {
    check = false;
  } else {
    check = true;
  }

  return (
    <>
      <Form method={method} onSubmit={onClose}>
        <Modal
          open={open}
          onClose={onClose}
          size="w-10/12 h-.5/6"
          button={true}
        >
          <div className="p-2 w-full">
            <div>
              <h1 className="text-lg pb-5 font-bold">{name}</h1>
            </div>
            <div className="flex w-full">
              <table className="ml-auto w-4/12 mr-5">
                <tbody>
                  {method === "put" && (
                    <tr>
                      <td className="w-4/12">
                        <h2>Mã bảng giá</h2>
                      </td>
                      <td className="w-8/12">
                        <input
                          readOnly
                          className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                          type="text"
                          name="priceListId"
                          defaultValue={
                            priceBook ? priceBook.PriceList.priceListId : ""
                          }
                          required
                        />
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td className="w-4/12">
                      <h2>Tên bảng giá</h2>
                    </td>
                    <td className="w-8/12">
                      <input
                        className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                        type="text"
                        name="priceListName"
                        value={namePrice}
                        onChange={(e) => setNamePrice(e.target.value)}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
              <table className="mr-auto w-8/12">
                <tbody>
                  <tr>
                    <td className="w-3/12">
                      <h2>Hiệu lực</h2>
                    </td>
                    <td className="w-9/12 ">
                      <div className="inline-flex">
                        <LocalizationProvider
                          dateAdapter={AdapterDayjs}
                          adapterLocale="vi-VN"
                        >
                          <input
                            type="hidden"
                            name="effectiveTimeStart"
                            value={`${dateStart.year()}-${
                              dateStart.month() + 1
                            }-${dateStart.date()}`}
                          />
                          <DatePicker
                            sx={{
                              ".MuiInputBase-input": { padding: 1, width: 150 },
                            }}
                            value={dateStart}
                            onChange={(value) => setDateStart(value)}
                            format="DD/MM/YYYY"
                          />
                          <div className="px-2">đến</div>
                          <input
                            type="hidden"
                            name="effectiveTimeEnd"
                            value={`${dateEnd.year()}-${
                              dateEnd.month() + 1
                            }-${dateEnd.date()}`}
                          />
                          <DatePicker
                            sx={{
                              ".MuiInputBase-input": { padding: 1, width: 150 },
                            }}
                            value={dateEnd}
                            onChange={(value) => {
                              setDateEnd(value);
                            }}
                            format="DD/MM/YYYY"
                          />
                        </LocalizationProvider>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="w-3/12">
                      <h2>Ghi chú</h2>
                    </td>
                    <td className="w-9/12">
                      <input
                        className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                        type="text"
                        name="note"
                        defaultValue={priceBook ? priceBook.PriceList.note : ""}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-5">
              <h2 className="px-4 py-2 bg-gray-200">Danh sách phòng</h2>
              <div className="flex px-4 py-4">
                <SearchCateRoom
                  categories={categoriesAdd}
                  clickCateRoom={handleCateRoomAdd}
                />
              </div>
              <div className="px-4">
                <table className="min-w-full border border-gray-300 divide-y divide-gray-300">
                  <thead className="bg-blue-100">
                    <tr>
                      <td className="py-2 px-4 w-3/12">Hạng phòng</td>
                      <td className="py-2 px-4 w-3/12">Ngày lưu trú</td>
                      <td className="py-2 px-4 w-2/12">Loại giá</td>
                      <td className="py-2 px-4 w-2/12">Mức giá</td>
                      <td className="py-2 px-4 w-2/12"></td>
                    </tr>
                  </thead>
                  <tbody>
                    <input
                      type="hidden"
                      name="listCateRoomId"
                      value={listPriceBook
                        .map((priceBook) => priceBook.roomCategoryId)
                        .toString()}
                    />
                    {listPriceBook.map((priceBook, index) => (
                      <>
                        <tr className="border-t">
                          <td
                            className="py-2 px-4 w-3/12"
                            rowSpan={priceBook.listPrice.length + 2}
                          >
                            <div>
                              <h2>{priceBook.roomCategoryName}</h2>
                              <p className="text-sm text-gray-500">
                                {priceBook.roomCategoryId}
                              </p>
                            </div>
                          </td>
                          <td className="py-2 px-4 w-3/12">
                            <div className="">Mặc định</div>
                          </td>
                          <td className="py-2 px-4 w-2/12">
                            <div className="pb-4">Giá giờ</div>
                            <div>Giá ngày</div>
                            <div className="pt-4">Giá đêm</div>
                          </td>
                          <td className="py-2 px-4 w-2/12">
                            <div>
                              <input
                                readOnly
                                className="border-0 border-b text-right border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                                type="number"
                                name="priceByHour"
                                defaultValue={
                                  priceBook.defaultPrice.priceByHour
                                }
                                min={0}
                              />
                            </div>
                            <div>
                              <input
                                readOnly
                                className="border-0 border-b text-right border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                                type="number"
                                name="priceByDay"
                                defaultValue={priceBook.defaultPrice.priceByDay}
                                min={0}
                              />
                            </div>
                            <div>
                              <input
                                readOnly
                                className="border-0 border-b text-right border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                                type="number"
                                name="priceByNight"
                                defaultValue={
                                  priceBook.defaultPrice.priceByNight
                                }
                                min={0}
                              />
                            </div>
                          </td>
                          <td
                            className="pl-20 w-2/12"
                            rowSpan={priceBook.listPrice.length + 2}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                handleCateRoomDelete(priceBook.roomCategoryId)
                              }
                            >
                              <i className="fa-solid fa-trash fa-lg"></i>
                            </button>
                          </td>
                        </tr>
                        <input
                          type="hidden"
                          name={`${priceBook.roomCategoryId}`}
                          value={priceBook.listPrice.length}
                        />
                        {priceBook.listPrice.map((prices, index) => (
                          <tr key={index}>
                            <td className="py-2 px-4 w-3/12 border-t">
                              <div className="">
                                <button
                                  type="button"
                                  className="pr-2"
                                  onClick={() => {
                                    handleEditDayInput(
                                      index,
                                      priceBook.roomCategoryId
                                    );
                                  }}
                                >
                                  <i className="fa-solid fa-pen"></i>
                                </button>
                                <input
                                  type="hidden"
                                  name={`dayOfWeek-${priceBook.roomCategoryId}-${index}`}
                                  value={prices.listDay.toString()}
                                />
                                <input
                                  type="hidden"
                                  name={`timeApply-${priceBook.roomCategoryId}-${index}`}
                                  value={prices.timeApply}
                                />
                                {prices.listDay.map((day, index) => {
                                  if (day == 8) {
                                    return "Chủ nhật";
                                  }
                                  if (index === prices.listDay.length - 1) {
                                    return "Thứ " + day;
                                  }
                                  return "Thứ " + day + ", ";
                                })}
                              </div>
                              <div>
                                {prices.timeApply &&
                                  dayjs(prices.timeApply).format("DD/MM/YYYY")}
                              </div>
                            </td>
                            <td className="py-2 px-4 w-2/12 border-t">
                              <div className="pb-4">Giá giờ</div>
                              <div>Giá ngày</div>
                              <div className="pt-4">Giá đêm</div>
                            </td>
                            <td className="py-2 px-4 w-2/12 border-t">
                              <div>
                                <input
                                  className="border-0 border-b text-right border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                                  type="number"
                                  name={`priceByHour-${priceBook.roomCategoryId}-${index}`}
                                  defaultValue={prices.priceByHour}
                                  min={0}
                                />
                              </div>
                              <div>
                                <input
                                  className="border-0 border-b text-right border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                                  type="number"
                                  name={`priceByDay-${priceBook.roomCategoryId}-${index}`}
                                  defaultValue={prices.priceByDay}
                                  min={0}
                                />
                              </div>
                              <div>
                                <input
                                  className="border-0 border-b text-right border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                                  type="number"
                                  name={`priceByNight-${priceBook.roomCategoryId}-${index}`}
                                  defaultValue={prices.priceByNight}
                                  min={0}
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td className="border-t">
                            <div className="text-blue-500 p-2">
                              <button
                                type="button"
                                onClick={() =>
                                  handleNewDayInput(
                                    priceBook.listPrice.length + 1,
                                    priceBook.roomCategoryId
                                  )
                                }
                              >
                                <i className="fa-solid fa-plus pr-2"></i>Ngày
                                lưu trú
                              </button>
                            </div>
                          </td>
                          <td className="border-t"></td>
                          <td className="border-t"></td>
                        </tr>
                      </>
                    ))}
                  </tbody>
                </table>
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
                    if (namePrice === "") {
                      message = "Không được để trống tên bảng giá";
                    } else if (
                      priceBooks.some(
                        (price) => price.PriceList.priceListName === namePrice
                      ) &&
                      ((priceBook &&
                        namePrice !== priceBook.PriceList.priceListName) ||
                        !priceBook)
                    ) {
                      message = "Không được trùng tên với bảng giá";
                    } else if (
                      listPriceBook.every(
                        (priceBook) => priceBook.listPrice.length <= 0
                      )
                    ) {
                      message = "Chưa có bất kỳ thay đổi giá hạng phòng nào";
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
                  onClose();
                }}
              >
                Bỏ qua
              </button>
            </div>
          </div>
        </Modal>
      </Form>
      {openEditDateModal && dayInput && (
        <DayInputForm
          name="Chỉnh sửa điều kiện lưu trú"
          open={openEditDateModal}
          onClose={() => setEditOpenDateModal(false)}
          listTimeDay={listPriceBook
            .filter((priceBook) => priceBook.roomCategoryId === dayInput[1])
            .map((dayTime) => dayTime.listPrice[dayInput[0]])}
          deleteTimeDay={handeTimeDayDelete}
          dayInWeek={listPriceBook.find(
            (priceBook) => priceBook.roomCategoryId === dayInput[1]
          )}
        />
      )}
      {openNewDateModal && (
        <DayInputForm
          name="Chỉnh sửa điều kiện lưu trú"
          open={openNewDateModal}
          onClose={() => setOpenNewDateModal(false)}
          listTimeDay={null}
          addTimeDay={handeTimeDayAdd}
          dayInWeek={listPriceBook.find(
            (priceBook) => priceBook.roomCategoryId === dayInput[1]
          )}
        />
      )}
    </>
  );
}

export default PriceBookForm;
