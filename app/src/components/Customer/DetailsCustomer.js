import { DataGrid } from "@mui/x-data-grid";
import ImageDisplay from "../UI/ImageDisplay";
import Modal from "../UI/Modal";
import { useEffect, useState } from "react";
import { axiosConfig, axiosPrivate } from "../../utils/axiosConfig";

function DetailsCustomer(props) {
  const [openInfo, setOpenInfo] = useState(true);
  const [openTrans, setOpenTrans] = useState(false);
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    async function fetchCategory() {
      try {
        const response = await axiosPrivate.get("customer/" + props.customerId);
        setCustomer(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchCategory();
  }, []);

  const handleInfo = () => {
    setOpenInfo(true);
    setOpenTrans(false);
  };

  const handleTrans = () => {
    setOpenInfo(false);
    setOpenTrans(true);
  };

  const columns = [
    { field: "code", headerName: "Mã hoá đơn", width: 150 },
    { field: "time", headerName: "Thời gian", width: 200 },
    { field: "receptionist", headerName: "Thu ngân", width: 150 },
    { field: "sum", headerName: "Tổng cộng", width: 150 },
  ];

  const rows = [
    {
      id: 1,
      code: "HD000001",
      time: "26/09/2023 10:00",
      receptionist: "tien",
      sum: "1,000,000",
    },
  ];

  let formattedDate = "";
  let gender = "";
  if (customer) {
    const dateNow = new Date(customer.dob);
    const year = dateNow.getFullYear();
    const month = String(dateNow.getMonth() + 1).padStart(2, "0");
    const day = String(dateNow.getDate()).padStart(2, "0");
    formattedDate = `${year}-${month}-${day}`;
    gender = customer.gender;
  }

  return (
    customer && (
      <Modal
        open={props.open}
        onClose={props.onClose}
        reset={props.onClose}
        button={true}
        size="w-8/12 h-4/6"
      >
        <div className="p-2 w-full">
          <div className="mb-5">
            <h1 className="text-lg pb-5 font-bold">Thông tin khách hàng</h1>
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
              {/* <div className="w-6/12">
                <button
                  className={`border-0 border-b border-gray-500 w-full ${
                    openTrans ? "border-b-2 border-green-500 ring-0" : ""
                  }`}
                  onClick={handleTrans}
                >
                  Thẻ kho
                </button>
              </div> */}
            </div>
          </div>
          {openInfo ? (
            <>
              <div className="flex">
                <div className="w-4/12">
                  <ImageDisplay
                    image1={customer.image ? `data:image/png;base64,${customer.image}` : null}
                  />
                </div>
                <div className="w-8/12 mx-5">
                  <table className="m-4 w-full">
                    <tbody>
                      <tr className="border-0 border-b">
                        <td className="w-5/12 pt-2">Mã khách hàng:</td>
                        <td className="w-7/12 pt-2">{customer.customerId}</td>
                      </tr>
                      <tr className="border-0 border-b">
                        <td className="w-5/12 pt-2">Tên khách hàng:</td>
                        <td className="w-7/12 pt-2">{customer.customerName}</td>
                      </tr>
                      <tr className="border-0 border-b">
                        <td className="w-5/12 pt-2">Nhóm khách hàng:</td>
                        <td className="w-7/12 pt-2">
                          {customer.customerGroup.customerGroupName}
                        </td>
                      </tr>
                      <tr className="border-0 border-b">
                        <td className="w-5/12 pt-2">Chứng minh nhân dân:</td>
                        <td className="w-7/12 pt-2">{customer.identity}</td>
                      </tr>
                      <tr className="border-0 border-b">
                        <td className="w-5/12 pt-2">Địa chỉ:</td>
                        <td className="w-7/12 pt-2">{customer.address}</td>
                      </tr>
                      <tr className="border-0 border-b">
                        <td className="w-5/12 pt-2">Năm sinh:</td>
                        <td className="w-7/12 pt-2">{formattedDate}</td>
                      </tr>
                      <tr className="border-0 border-b">
                        <td className="w-5/12 pt-2">Điện thoại</td>
                        <td className="w-7/12 pt-2">{customer.phoneNumber}</td>
                      </tr>
                      <tr className="border-0 border-b">
                        <td className="w-5/12 pt-2">Quốc gia</td>
                        <td className="w-7/12 pt-2">{customer.nationality}</td>
                      </tr>
                      <tr className="border-0 border-b">
                        <td className="w-5/12 pt-2">Giới tính:</td>
                        <td className="w-7/12 pt-2">{gender ? "Nam giới" : "Nữ giới"}</td>
                      </tr>
                      <tr className="border-0 border-b">
                        <td className="w-5/12 pt-2">Mã số thuế</td>
                        <td className="w-7/12 pt-2">{customer.taxCode}</td>
                      </tr>
                      <tr className="border-0 border-b">
                        <td className="w-5/12 pt-2">Thư điện tử</td>
                        <td className="w-7/12 pt-2">{customer.email}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : null}
          {openTrans ? (
            <>
              <DataGrid
                columns={columns}
                rows={rows}
                initialState={{
                  pagination: { paginationModel: { pageSize: 5 } },
                }}
                pageSizeOptions={[5, 10, 25]}
              />
            </>
          ) : null}
        </div>
      </Modal>
    )
  );
}

export default DetailsCustomer;
