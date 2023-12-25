import { DataGrid } from "@mui/x-data-grid";
import ImageDisplay from "../UI/ImageDisplay";
import Modal from "../UI/Modal";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

function DetailsPriceBook(props) {
  const [openInfo, setOpenInfo] = useState(true);
  const [openListPrice, setOpenListPrice] = useState(false);

  const priceBook = props.priceBook;
  console.log(props.priceBook);

  const handleInfo = () => {
    setOpenInfo(true);
    setOpenListPrice(false);
  };

  const handleListPrice = () => {
    setOpenInfo(false);
    setOpenListPrice(true);
  };

  return (
    props.priceBook && (
      <Modal
        open={props.open}
        onClose={props.onClose}
        reset={props.onClose}
        button={true}
        size="w-8/12 h-.5/6"
      >
        <div className="p-2 w-full">
          <div className="mb-5">
            <h1 className="text-lg pb-5 font-bold">Thông tin hạng phòng</h1>
            <div className="flex w-5/12">
              <div className="w-6/12">
                <button
                  className={`border-0 border-b border-gray-500 w-full ${
                    openInfo ? "border-b-2 border-green-500 ring-0" : ""
                  }`}
                  onClick={handleInfo}
                >
                  Thông tin
                </button>
              </div>
              <div className="w-6/12">
                <button
                  className={`border-0 border-b border-gray-500 w-full ${
                    openListPrice ? "border-b-2 border-green-500 ring-0" : ""
                  }`}
                  onClick={handleListPrice}
                >
                  Giá phòng
                </button>
              </div>
            </div>
          </div>
          {openInfo ? (
            <>
              <div className="flex">
                <div className="w-5/12">
                  <table className="m-4 w-full">
                    <tbody>
                      <tr className="border-0 border-b">
                        <td className="w-5/12 pt-2">Mã bảng giá:</td>
                        <td className="w-7/12 pt-2">
                          {priceBook.PriceList.priceListId}
                        </td>
                      </tr>
                      <tr className="border-0 border-b">
                        <td className="w-5/12 pt-2">Tên bảng giá:</td>
                        <td className="w-7/12 pt-2">
                          {priceBook.PriceList.priceListName}
                        </td>
                      </tr>
                      <tr className="border-0 border-b">
                        <td className="w-5/12 pt-2">Trạng thái:</td>
                        <td className="w-7/12 pt-2">
                          {priceBook.PriceList.status === 1
                            ? "Đang hoạt động"
                            : "Ngừng hoạt động"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="w-7/12 mx-5">
                  <table className="m-4 w-full">
                    <tbody>
                      <tr className="border-0 border-b">
                        <td className="w-5/12 pt-2">Thời gian hiệu lực:</td>
                        <td className="w-7/12 pt-2">
                          {dayjs(priceBook.PriceList.effectiveTimeStart).format(
                            "DD/MM/YYYY"
                          )}
                          -
                          {dayjs(priceBook.PriceList.effectiveTimeEnd).format(
                            "DD/MM/YYYY"
                          )}
                        </td>
                      </tr>
                      <tr className="border-0 border-b">
                        <td className="w-5/12 pt-2">Ghi chú:</td>
                        <td className="w-7/12 pt-2">
                          {priceBook.PriceList.note}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : null}
          {openListPrice ? (
            <table className="min-w-full border border-gray-300 divide-y divide-gray-300">
              <thead className="bg-blue-100">
                <tr>
                  <td className="py-2 px-4 w-3/12">Hạng phòng</td>
                  <td className="py-2 px-4 w-3/12">Ngày lưu trú</td>
                  <td className="py-2 px-4 w-2/12">Loại giá</td>
                  <td className="py-2 px-4 w-4/12">Mức giá</td>
                </tr>
              </thead>
              <tbody>
                {priceBook.ListPriceListDetail.map((priceBook) => (
                  <>
                    <tr className="border-t">
                      <td
                        className="py-2 px-4 w-3/12"
                        rowSpan={
                          priceBook.PriceListDetailWithDayOfWeek.length + 1
                        }
                      >
                        <h2>{priceBook.RoomClass.roomCategoryName}</h2>
                        <p className="text-sm text-gray-500">
                          {priceBook.RoomClass.roomCategoryId}
                        </p>
                      </td>
                      <td className="py-2 px-4 w-3/12">
                        <div className="">Mặc định</div>
                      </td>
                      <td className="py-2 px-4 w-2/12">
                        <div className="pb-4">Giá giờ</div>
                        <div>Giá ngày</div>
                        <div className="pt-4">Giá đêm</div>
                      </td>
                      <td className="py-2 px-4 w-4/12">
                        <div className="pb-4">
                          {priceBook.RoomClass.priceByHour.toLocaleString()+ " VND "}
                        </div>
                        <div>{priceBook.RoomClass.priceByDay.toLocaleString()+ " VND "}</div>
                        <div className="pt-4">
                          {priceBook.RoomClass.priceByNight.toLocaleString()+ " VND "}
                        </div>
                      </td>
                    </tr>
                    {priceBook.PriceListDetailWithDayOfWeek.map((prices) => (
                      <tr>
                        <td className="py-2 px-4 w-3/12 border-t">
                          <div className="">
                            <div>
                              {prices.DayOfWeekList.map((day, index) => {
                                if (day === 8) {
                                  return "Chủ nhật";
                                }
                                if (index === prices.DayOfWeekList.length - 1) {
                                  return "Thứ " + day;
                                }
                                return "Thứ " + day + ", ";
                              })}
                            </div>
                            <div>
                              {dayjs(prices.PriceListDetail.timeApply).format("DD/MM/YYYY")}
                            </div>
                          </div>
                        </td>
                        <td className="py-2 px-4 w-2/12 border-t">
                          <div className="pb-4">Giá giờ</div>
                          <div>Giá ngày</div>
                          <div className="pt-4">Giá đêm</div>
                        </td>
                        <td className="py-2 px-4 w-2/12 border-t">
                          <div className="pb-4">
                            {prices.PriceListDetail.priceByHour.toLocaleString()+ " VND "}
                          </div>
                          <div>{prices.PriceListDetail.priceByDay.toLocaleString()+ " VND "}</div>
                          <div className="pt-4">
                            {prices.PriceListDetail.priceByNight.toLocaleString()+ " VND "}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          ) : null}
        </div>
      </Modal>
    )
  );
}

export default DetailsPriceBook;
