import { DataGrid } from "@mui/x-data-grid";
import ImageDisplay from "../UI/ImageDisplay";
import Modal from "../UI/Modal";
import { useEffect, useState } from "react";
import { axiosConfig, axiosPrivate } from "../../utils/axiosConfig";

function DetailsStaff(props) {
  const [openInfo, setOpenInfo] = useState(true);
  const [openTrans, setOpenTrans] = useState(false);
  const [staff, setStaff] = useState(null);

  useEffect(() => {
    async function fetchCategory() {
      try {
        const response = await axiosPrivate.get("staff/" + props.StaffId);
        setStaff(response.data.result);
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

  let formattedDate = "";
  let gender = "";
  if (staff) {
    const dateNow = new Date(staff.dob);
    const year = dateNow.getFullYear();
    const month = String(dateNow.getMonth() + 1).padStart(2, "0");
    const day = String(dateNow.getDate()).padStart(2, "0");
    formattedDate = `${year}-${month}-${day}`;
    gender = staff.gender;
  }

  return (
    staff && (
      <Modal
        open={props.open}
        onClose={props.onClose}
        reset={props.onClose}
        button={true}
        size="w-8/12 h-6/6"
      >
        <div className="p-2 w-full">
          <div className="mb-5">
            <h1 className="text-lg pb-5 font-bold">Thông tin nhân viên</h1>
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
            </div>
          </div>
          {openInfo ? (
            <>
              <div className="flex">
                <div className="w-4/12">
                  <ImageDisplay
                    image1={staff.image ? `data:image/png;base64,${staff.image}` : null}
                  />
                </div>
                <div className="w-8/12 mx-5">
                  <table className="m-4 w-full">
                    <tbody>
                      <tr className="border-0 border-b">
                        <td className="w-5/12 pt-2">Mã nhân viên:</td>
                        <td className="w-7/12 pt-2">{staff.staffId}</td>
                      </tr>
                      <tr className="border-0 border-b">
                        <td className="w-5/12 pt-2">Tên nhân viên:</td>
                        <td className="w-7/12 pt-2">{staff.staffName}</td>
                      </tr>
                      <tr className="border-0 border-b">
                        <td className="w-5/12 pt-2">Tên đăng nhập</td>
                        <td className="w-7/12 pt-2">
                          {staff.username}
                        </td>
                      </tr>
                      {/* <tr className="border-0 border-b">
                        <td className="w-5/12 pt-2">Mật khẩu</td>
                        <td className="w-7/12 pt-2">{staff.password}</td>
                      </tr> */}
                      <tr className="border-0 border-b">
                        <td className="w-5/12 pt-2">Chức danh</td>
                        <td className="w-7/12 pt-2">Nhân viên </td>
                      </tr>
                      <tr className="border-0 border-b">
                        <td className="w-5/12 pt-2">Tình trạng</td>
                        <td className="w-7/12 pt-2">{staff.status}</td>
                      </tr>
                      <tr className="border-0 border-b">
                        <td className="w-5/12 pt-2">Năm sinh:</td>
                        <td className="w-7/12 pt-2">{formattedDate}</td>
                      </tr>
                      <tr className="border-0 border-b">
                        <td className="w-5/12 pt-2">Địa chỉ:</td>
                        <td className="w-7/12 pt-2">{staff.address}</td>
                      </tr>
                      
                      <tr className="border-0 border-b">
                        <td className="w-5/12 pt-2">Email:</td>
                        <td className="w-7/12 pt-2">{staff.email}</td>
                      </tr>
                      <tr className="border-0 border-b">
                        <td className="w-5/12 pt-2">Giới tính:</td>
                        <td className="w-7/12 pt-2">{gender ? "Nam giới" : "Nữ giới"}</td>
                      </tr>
                      <tr className="border-0 border-b">
                        <td className="w-5/12 pt-2">Identity</td>
                        <td className="w-7/12 pt-2">{staff.identity}</td>
                      </tr>
                      {/* <tr className="border-0 border-b">
                        <td className="w-5/12 pt-2">Mã số thuế</td>
                        <td className="w-7/12 pt-2">{staff.taxCode}</td>
                      </tr> */}
                      <tr className="border-0 border-b">
                        <td className="w-5/12 pt-2">Điện thoại</td>
                        <td className="w-7/12 pt-2">{staff.phoneNumber}</td>
                      </tr>
                      {/* <tr className="border-0 border-b">
                        <td className="w-5/12 pt-2">Ảnh</td>
                        <td className="w-7/12 pt-2">{Staff.nationality}</td>
                      </tr> */}
                      <tr className="border-0 border-b">
                        <td className="w-5/12 pt-2">Phòng ban</td>
                        <td className="w-7/12 pt-2">{staff.department.departmentName}</td>
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

export default DetailsStaff;
