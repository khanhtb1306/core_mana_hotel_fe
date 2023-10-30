import { Form, useLoaderData } from "react-router-dom";
import Modal from "./Modal";
import ImageInput from "../UI/ImageInput";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { viVN } from "@mui/x-date-pickers/locales";
import { DateTimePicker } from "@mui/x-date-pickers";
import SearchCateRoom from "../Search/SearchCateRoom";
import { useState } from "react";

function PriceBookForm({ name, open, onClose, method, priceBook }) {
  console.log(priceBook);
  const { categories } = useLoaderData();
  console.log(categories);
  const priceBooks = categories.map((cate) => {
    if (priceBook) {
      const listPrice = [
        {
          id: 0,
          date: [0],
          priceByHour: cate.roomCategory.priceByHour,
          priceByDay: cate.roomCategory.priceByDay,
          priceByNight: cate.roomCategory.priceByNight,
        },
      ];
      return {
        roomCategoryId: cate.roomCategory.roomCategoryId,
        roomCategoryName: cate.roomCategory.roomCategoryName,
        listPrice: listPrice,
      };
    } else {
      return {};
    }
  });
  const [listPriceBook, setListPriceBook] = useState(priceBooks);
  const [categoriesAdd, setCategoriesAdd] = useState(
    categories.filter((cate) => {
      console.log(listPriceBook);
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
  return (
    <Form method={method} onSubmit={onClose} encType="multipart/form-data">
      <Modal open={open} onClose={onClose} size="w-8/12 h-.5/6">
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
                      <h2>Mã khách hàng</h2>
                    </td>
                    <td className="w-8/12">
                      <input
                        readOnly
                        className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                        type="text"
                        name="customerId"
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
                      name="customerName"
                      required
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
                        localeText={
                          viVN.components.MuiLocalizationProvider.defaultProps
                            .localeText
                        }
                      >
                        <DateTimePicker
                          ampm={false}
                          disablePast
                          sx={{
                            ".MuiInputBase-input": { padding: 1, width: 150 },
                          }}
                        />
                        <div className="px-2">đến</div>
                        <DateTimePicker
                          ampm={false}
                          disablePast
                          sx={{
                            ".MuiInputBase-input": { padding: 1, width: 150 },
                          }}
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
                      name="customerName"
                      required
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-5">
            <h2 className="px-4 py-2 bg-gray-200">Đơn vị tính</h2>
            <div className="flex px-4 py-4">
              <SearchCateRoom categories={categoriesAdd} />
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
                  {listPriceBook.map((priceBook) => (
                    <>
                      <tr className="border-t">
                        <td
                          className="py-2 px-4 w-3/12"
                          rowspan={priceBook.listPrice.length + 2}
                        >
                          <h2>{priceBook.roomCategoryName}</h2>
                          <p className="text-sm text-gray-500">
                            {priceBook.roomCategoryId}
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
                        <td className="py-2 px-4 w-2/12">
                          <div>
                            <input
                              className="border-0 border-b text-right border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                              type="number"
                              name="priceByHour"
                              defaultValue={priceBook.listPrice[0].priceByHour}
                              min={0}
                            />
                          </div>
                          <div>
                            <input
                              className="border-0 border-b text-right border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                              type="number"
                              name="priceByDay"
                              defaultValue={priceBook.listPrice[0].priceByDay}
                              min={0}
                            />
                          </div>
                          <div>
                            <input
                              className="border-0 border-b text-right border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                              type="number"
                              name="priceByNight"
                              defaultValue={priceBook.listPrice[0].priceByNight}
                              min={0}
                            />
                          </div>
                        </td>
                        <td className="py-2 px-4 w-2/12">
                          <button type="button">
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                      {priceBook.listPrice.map((prices) => (
                        <tr>
                          <td className="py-2 px-4 w-3/12 border-t">
                            <div className="">Mặc định</div>
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
                                name="priceByHour"
                                defaultValue={
                                  priceBook.listPrice[0].priceByHour
                                }
                                min={0}
                              />
                            </div>
                            <div>
                              <input
                                className="border-0 border-b text-right border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                                type="number"
                                name="priceByDay"
                                defaultValue={priceBook.listPrice[0].priceByDay}
                                min={0}
                              />
                            </div>
                            <div>
                              <input
                                className="border-0 border-b text-right border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                                type="number"
                                name="priceByNight"
                                defaultValue={
                                  priceBook.listPrice[0].priceByNight
                                }
                                min={0}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td className="border-t">
                          <div className="text-blue-500 p-2">
                            <button type="button">
                              <i className="fa-solid fa-plus pr-2"></i>Ngày lưu
                              trú
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
      </Modal>
    </Form>
  );
}

export default PriceBookForm;
