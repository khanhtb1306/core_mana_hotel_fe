import { useState } from "react";
import FilterSearch from "../../components/FilterSearch";
import FilterStatus from "../../components/FilterStatus";
import RoomRootLayout from "../RoomRootLayout";

const DUMMY_CATEGORY_ROOM = [
  {
    id: "Double Bedroom",
    name: "Phong 1 giuong doi cho 2 nguoi",
    amount: "2",
    priceHour: 180000,
    priceDay: 720000,
    priceNight: 720000,
    status: "Dang kinh doanh",
  },
  {
    id: "Double Bedroom",
    name: "Phong 1 giuong doi cho 2 nguoi 3 nguoi 4 nguoi 5 nguoi 6 nguoi ",
    amount: "2",
    priceHour: 180000,
    priceDay: 720000,
    priceNight: 720000,
    status: "Dang kinh doanh",
  },
];

function CategoryManagementPage() {
  const all = ["Tat ca", "Tang 1", "Tang 2"];
  const [showNew, setShowNew] = useState(false);

  const listCate = DUMMY_CATEGORY_ROOM.map((item) => (
    <tr key={item.id} className="border-gray-300 border even:bg-white">
      <td className="p-2">
        <input type="checkbox" className="w-5 h-5 border-gray-300 focus:ring-green-200 text-green-500" />
      </td>
      <td className="p-2">{item.id}</td>
      <td className="p-2">{item.name}</td>
      <td className="p-2">{item.amount}</td>
      <td className="p-2">{item.priceHour}</td>
      <td className="p-2">{item.priceDay}</td>
      <td className="p-2">{item.priceNight}</td>
      <td className="p-2">{item.status}</td>
    </tr>
  ));

  console.log(listCate);

  return (
    <>
      <div className="flex">
        <div className="w-2/12 mr-10 ml-10 mt-5">
          <FilterSearch
            name="Tìm kiếm"
            subName="Tìm kiếm hạng phòng"
            all={all}
          />
          <FilterSearch name="Hang phong" subName="Tìm kiếm hạng phòng" />
          <FilterStatus />
        </div>

        <div className="w-10/12 pt-5 pl-5 mr-10">
          <div className="flex">
            <h1 className="text-4xl">Hạng phòng & Phòng</h1>
            <div
              className="ml-auto"
              onMouseMove={() => setShowNew(true)}
              onMouseOut={() => setShowNew(false)}
            >
              <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700">
                <i className="fa-solid fa-plus pr-2"></i>
                Thêm mới
              </button>
              {showNew ? (
                <>
                  <div className="absolute bg-white ml-auto w-40 py-3">
                    <div className="py-2 px-4 hover:bg-gray-200">
                      <i className="fa-solid fa-plus pr-4"></i>
                      Hạng phòng
                    </div>
                    <div className="py-2 px-4 hover:bg-gray-200">
                      <i className="fa-solid fa-plus pr-4"></i>
                      Phòng
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </div>
          <RoomRootLayout />
          <table className="table-auto w-full">
            <thead className="bg-blue-200">
              <tr className="border-blue-300 border">
                <td className="p-2">
                  <input type="checkbox"  className="w-5 h-5 border-gray-300 focus:ring-green-200 text-green-500" />
                </td>
                <td className="p-2">Mã hạng phòng</td>
                <td className="p-2">Tên hạng phòng</td>
                <td className="p-2">SL phòng</td>
                <td className="p-2">Giá theo giờ</td>
                <td className="p-2">Giá theo ngày</td>
                <td className="p-2">Giá qua đêm</td>
                <td className="p-2">Trạng thái</td>
              </tr>
            </thead>
            <tbody>
              {listCate}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default CategoryManagementPage;
