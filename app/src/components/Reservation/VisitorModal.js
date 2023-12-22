import dayjs from "dayjs";
import Modal from "../UI/Modal";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import AddOrEditVisitor from "./AddOrEditVisitor";
import DeleteVisitor from "./DeleteVisitor";
import { Checkbox, FormControlLabel } from "@mui/material";
import { axiosPrivate } from "../../utils/axiosConfig";
import { Form } from "react-router-dom";

function VisitorModal(props) {
  const room = props.room;
  const visitors = props.visitors;
  const adultVisitors = visitors.filter(
    (visitor) => dayjs().diff(dayjs(visitor.customer.dob), "year") >= 16
  );
  const childrenVisitors = visitors.filter(
    (visitor) => dayjs().diff(dayjs(visitor.customer.dob), "year") < 16
  );
  const customer = visitors.find((visitor) => visitor.customer.isCustomer);
  const check = !props.check || customer !== undefined;
  const maxAdults = room.room.roomCategory.numMaxOfAdults;
  const maxChildren = room.room.roomCategory.numMaxOfChildren;
  const adults = room.room.roomCategory.numOfAdults;
  const children = room.room.roomCategory.numOfChildren;
  const curAdults = adultVisitors.length;
  const curChildren = childrenVisitors.length;

  const [openAddVisitorModal, setOpenAddVisitorModal] = useState(false);
  const [openEditVisitorModal, setOpenEditVisitorModal] = useState(false);
  const [openDeleteVisitorModal, setOpenDeleteVisitorModal] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState(null);

  const columns = [
    { field: "fullName", headerName: "Họ và tên", width: 200 },
    { field: "age", headerName: "Tuổi tác", width: 150 },
    { field: "timeStay", headerName: "Thời gian lưu trú", width: 350 },
    {
      field: "action",
      headerName: "Hoạt động",
      type: "actions",
      width: 150,
      getActions: (params) => {
        const row = params.row;
        return [
          <GridActionsCellItem
            icon={<i className="fa-solid fa-pen p-1"></i>}
            label="Chỉnh sửa"
            onClick={() => {
              setSelectedVisitor(
                visitors.find(
                  (visitor) => visitor.reservationDetailCustomerId === row.id
                )
              );
              setOpenEditVisitorModal(true);
            }}
          />,
          <GridActionsCellItem
            icon={<i className="fa-solid fa-trash p-1"></i>}
            label="Xoá"
            onClick={() => {
              setSelectedVisitor(
                visitors.find(
                  (visitor) => visitor.reservationDetailCustomerId === row.id
                )
              );
              setOpenDeleteVisitorModal(true);
            }}
          />,
        ];
      },
    },
  ];

  const rows = visitors
    .filter((visitor) => !visitor.customer.isCustomer)
    .map((visitor) => {
      const age = dayjs().diff(dayjs(visitor.customer.dob), "year") + " tuổi";
      let checkin = dayjs();
      let checkout = dayjs();
      if (visitor.reservationDetail.status === "BOOKING") {
        checkin = dayjs(visitor.reservationDetail.checkInEstimate).format(
          "DD MMM YYYY, HH:mm"
        );
        checkout = dayjs(visitor.reservationDetail.checkOutEstimate).format(
          "DD MMM YYYY, HH:mm"
        );
      } else if (visitor.reservationDetail.status === "CHECK_IN") {
        checkin = dayjs(visitor.reservationDetail.checkInActual).format(
          "DD MMM YYYY, HH:mm"
        );
        checkout = dayjs(visitor.reservationDetail.checkOutEstimate).format(
          "DD MMM YYYY, HH:mm"
        );
      } else {
        checkin = dayjs(visitor.reservationDetail.checkInActual).format(
          "DD MMM YYYY, HH:mm"
        );
        checkout = dayjs(visitor.reservationDetail.checkOutActual).format(
          "DD MMM YYYY, HH:mm"
        );
      }
      return {
        key: visitor.reservationDetailCustomerId,
        id: visitor.reservationDetailCustomerId,
        fullName: visitor.customer.customerName,
        age: age,
        timeStay: checkin + " - " + checkout,
      };
    });
  return (
    <>
      <Modal
        open={props.open}
        onClose={props.onClose}
        button={true}
        size="w-8/12 h-.5/6"
      >
        <div className="p-2 w-full">
          <div className="mb-3">
            <h1 className="text-lg pb-5 font-bold">
              Khách lưu trú - {room.room.roomName}
            </h1>
          </div>
          <div className="flex text-sm mb-2">
            <h2 className="font-bold mr-8">Số lượng khách hiện tại</h2>
            <p className="mr-8">
              Người lớn: {curAdults} / {maxAdults}
            </p>
            <p>
              Trẻ em: {curChildren} / {maxChildren}
            </p>
          </div>
          <div className="flex text-sm mb-2">
            <h2 className="font-bold mr-8">Số lượng khách tiêu chuẩn</h2>
            <p className="mr-8">Người lớn: {adults}</p>
            <p>Trẻ em: {children}</p>
          </div>
          {check && (
            <Form method="POST">
              <div className="flex text-sm mb-2">
                {customer ? (
                  <>
                    <input
                      type="hidden"
                      name="isRemoveCustomerToVisitor"
                      defaultValue={true}
                    />
                    <input
                      type="hidden"
                      name="reservationDetailCustomerId"
                      defaultValue={customer.reservationDetailCustomerId}
                    />
                    <button className="text-white border py-.5 px-1 rounded bg-red-500 hover:bg-red-600">
                      <i className="fa-solid fa-x"></i>
                    </button>
                    <div className="my-auto ml-2">
                      Xoá người đặt phòng ra khỏi phòng
                    </div>
                  </>
                ) : (
                  curAdults < maxAdults && (
                    <>
                      <input
                        type="hidden"
                        name="isAddCustomerToVisitor"
                        defaultValue={true}
                      />
                      <input
                        type="hidden"
                        name="reservationDetailId"
                        defaultValue={room.reservationDetailId}
                      />
                      <input
                        type="hidden"
                        name="customerId"
                        defaultValue={room.reservation.customer.customerId}
                      />
                      <button className="text-white border py-.5 px-1 rounded bg-green-500 hover:bg-green-600">
                        <i className="fa-solid fa-check"></i>
                      </button>
                      <div className="my-auto ml-2">
                        Thêm người đặt phòng vào trong phòng
                      </div>
                    </>
                  )
                )}
              </div>
            </Form>
          )}

          <div className="flex text-sm">
            <h2 className="font-bold">Thông tin chi tiết</h2>
            {(curAdults < maxAdults || curChildren < maxChildren) && (
              <button
                type="button"
                className="ml-auto mb-4 text-white border py-1 px-3 rounded bg-green-500 hover:bg-green-600"
                onClick={() => setOpenAddVisitorModal(true)}
              >
                <i className="fa-solid fa-plus mr-2"></i>
                Thêm khách lưu trú
              </button>
            )}
          </div>
          <div>
            <DataGrid
              columns={columns}
              rows={rows}
              initialState={{
                pagination: { paginationModel: { pageSize: 5 } },
              }}
              pageSizeOptions={[5, 10, 25]}
            />
          </div>
        </div>
        <div className="flex pt-5">
          <div className="ml-auto">
            <button
              type="button"
              className="bg-green-500 mr-2 py-2 px-6 text-white rounded hover:bg-green-600"
              onClick={() => props.onClose()}
            >
              Xong
            </button>
          </div>
        </div>
      </Modal>
      {openAddVisitorModal && (
        <AddOrEditVisitor
          open={openAddVisitorModal}
          onClose={() => setOpenAddVisitorModal(false)}
          name="Thêm khách lưu trú"
          method="POST"
          canAddAdult={curAdults < maxAdults}
          canAddChildren={curChildren < maxChildren}
          visitor={null}
          reservationDetail={room}
        />
      )}
      {selectedVisitor && openEditVisitorModal && (
        <AddOrEditVisitor
          open={openEditVisitorModal}
          onClose={() => setOpenEditVisitorModal(false)}
          name="Chỉnh sửa khách lưu trú"
          method="PUT"
          canAddAdult={curAdults < maxAdults}
          canAddChildren={curChildren < maxChildren}
          visitor={selectedVisitor.customer}
          reservationDetail={room}
        />
      )}
      {selectedVisitor && openDeleteVisitorModal && (
        <DeleteVisitor
          open={openDeleteVisitorModal}
          onClose={() => setOpenDeleteVisitorModal(false)}
          visitor={selectedVisitor}
        />
      )}
    </>
  );
}

export default VisitorModal;
