import { useEffect, useState, useRef } from "react";
import SelectRoom from "../Reservation/SelectRoom";
import SearchCustomer from "../Search/SearchCustomer";
import { redirect, useActionData, useLoaderData } from "react-router-dom";
import { MenuItem, Select } from "@mui/material";
import AddRoom from "../Reservation/AddRoom";
import RemoveRoom from "../Reservation/RemoveRoom";
import AddInvoice from "../Reservation/AddInvoice";
import { axiosPrivate } from "../../utils/axiosConfig";
import { Form } from "react-router-dom";
import ViewInvoice from "../Reservation/ViewInvoice";
import dayjs from "dayjs";
import EditInvoice from "../Reservation/EditInvoice";
import StatusInvoice from "../Reservation/StatusInvoice";
import CancelInvoice from "../Reservation/CancelInvoice";
import VisitorModal from "../Reservation/VisitorModal";
import PaymentModal from "../Reservation/PaymentModal";
import ReceiveRoomModal from "../Reservation/ReceiveRoomModal";
import PayRoomModal from "../Reservation/PayRoomModal";
import Swal from "sweetalert2";
import ChangeRoomModal from "../Reservation/ChangeRoomModal";
import { useReactToPrint } from "react-to-print";
import { jwtDecode } from "jwt-decode";
import CancelReservationModal from "../Reservation/CancelReservationModal";

function ReservationForm(props) {
  const {
    customers,
    prices,
    categories,
    listSurchage,
    check,
    invoices,
    invoiceReservation,
    listQR,
  } = useLoaderData();
  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const printInvoiceRef = useRef();
  const printBookingRef = useRef();
  const actionData = useActionData();
  const reservation = props.reservation;
  const isDone =
    reservation && reservation.listReservationDetails.length > 0
      ? reservation.listReservationDetails.every(
          (details) => details.status === "DONE"
        )
      : false;
  let priceAll = 0;
  let priceDiscount = reservation
    ? invoiceReservation.reduce((sum, inv) => {
        return (sum += inv.Invoice.discount);
      }, 0)
    : 0;
  let priceOtherFee = reservation
    ? invoiceReservation.reduce((sum, inv) => {
        return (sum += inv.Invoice.priceOther);
      }, 0)
    : 0;
  // console.log(invoices);
  // console.log(reservation);
  // console.log(categories);
  // console.log(listQR);
  const dayInWeek = ["2", "3", "4", "5", "6", "7", "8"];
  const pricesMore = prices.map((price) => {
    // console.log(price);
    const addClassRooms = categories
      .filter(
        (cate) =>
          !price.ListPriceListDetail.map(
            (row) => row.RoomClass.roomCategoryId
          ).includes(cate.roomCategory.roomCategoryId)
      )
      .map((cate) => {
        return {
          PriceListDetailWithDayOfWeek: [
            {
              DayOfWeekList: dayInWeek,
              PriceListDetail: {
                priceByDay: cate.roomCategory.priceByDay,
                priceByHour: cate.roomCategory.priceByHour,
                priceByNight: cate.roomCategory.priceByNight,
                timeApply: null,
              },
            },
          ],
          RoomClass: cate.roomCategory,
        };
      });
    const classRooms = price.ListPriceListDetail.map((priceDetails) => {
      const dayWithPriceBook = priceDetails.PriceListDetailWithDayOfWeek.reduce(
        (all, cur) => {
          return all.concat(cur.DayOfWeekList);
        },
        []
      );
      const dayWithoutPriceBook = dayInWeek.filter(
        (day) => !dayWithPriceBook.includes(day)
      );
      // console.log(priceDetails);
      let newPriceDetails = priceDetails.PriceListDetailWithDayOfWeek;
      if (dayWithoutPriceBook.length > 0) {
        const cate = categories.find(
          (cate) =>
            cate.roomCategory.roomCategoryId ===
            priceDetails.RoomClass.roomCategoryId
        );
        newPriceDetails = [
          ...newPriceDetails,
          {
            DayOfWeekList: dayWithoutPriceBook,
            PriceListDetail: {
              priceByDay: cate.roomCategory.priceByDay,
              priceByHour: cate.roomCategory.priceByHour,
              priceByNight: cate.roomCategory.priceByNight,
              timeApply: null,
            },
          },
        ];
      }
      return {
        PriceListDetailWithDayOfWeek: newPriceDetails,
        RoomClass: priceDetails.RoomClass,
      };
    });
    return {
      ListPriceListDetail: classRooms.concat(addClassRooms),
      PriceList: price.PriceList,
    };
  });
  const allPrices = [
    {
      ListPriceListDetail: categories.map((cate) => {
        return {
          PriceListDetailWithDayOfWeek: [
            {
              DayOfWeekList: ["2", "3", "4", "5", "6", "7", "8"],
              PriceListDetail: {
                priceByDay: cate.roomCategory.priceByDay,
                priceByHour: cate.roomCategory.priceByHour,
                priceByNight: cate.roomCategory.priceByNight,
                timeApply: null,
              },
            },
          ],
          RoomClass: cate.roomCategory,
        };
      }),
      PriceList: {
        priceListId: "0",
        priceListName: "Bảng giá chung",
        effectiveTimeStart: "2000-08-02T17:00:00.000+00:00",
        effectiveTimeEnd: "3000-08-02T17:00:00.000+00:00",
        note: "",
      },
    },
    ...pricesMore,
  ];
  // console.log(allPrices);
  const [openAddRoomModal, setOpenAddRoomModal] = useState(false);
  const [openAddInvoiceModal, setOpenAddInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  // console.log(selectedInvoice);
  const [openViewInvoiceModal, setOpenViewInvoiceModal] = useState(false);
  const [openEditInvoiceModal, setOpenEditInvoiceModal] = useState(false);
  const [openStatusInvoiceModal, setOpenStatusInvoiceModal] = useState(false);
  const [openDeleteInvoiceModal, setOpenDeleteInvoiceModal] = useState(false);
  const [removeRoomModal, setRemoveRoomModal] = useState(null);
  const [listCustomers, setListCustomers] = useState(null);
  const [openVisitorModal, setOpenVisitorModal] = useState(false);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [openCancelReservationModal, setOpenCancelReservationModal] =
    useState(false);
  const [customer, setCustomer] = useState(
    reservation
      ? reservation.reservation.customer.customerId === "C000000"
        ? null
        : reservation.reservation.customer
      : null
  );
  const [openReceiveModal, setOpenReceiveModal] = useState(false);
  const [openChangeModal, setOpenChangeModal] = useState(false);
  const [openPayModal, setOpenPayModal] = useState(false);
  // console.log(customer);
  let priceByCateRoom = null;
  let priceById = null;
  if (reservation) {
    priceById = allPrices.find(
      (price) =>
        price.PriceList.priceListId ===
        reservation.reservation.priceList.priceListId
    );
    if (!priceById) {
      priceById = allPrices[0];
    }
    if (reservation.listReservationDetails.length > 0) {
      priceByCateRoom = priceById.ListPriceListDetail.find(
        (details) =>
          details.RoomClass.roomCategoryId ===
          reservation.listReservationDetails[0].room.roomCategory.roomCategoryId
      ).PriceListDetailWithDayOfWeek;
    }
  }
  // console.log(priceByCateRoom);
  // console.log(listInvoices);
  const [roomActive, setRoomActive] = useState(
    reservation && reservation.listReservationDetails > 0
      ? reservation.listReservationDetails[0]
      : null
  );
  // console.log(roomActive);
  useEffect(() => {
    async function fetchRoomActive() {
      try {
        if (actionData) {
          //Notify error info of rooms in reservation
          if (
            actionData.listRoom &&
            actionData.listRoom.find((room) => !room.success)
          ) {
            // console.log(actionData.listRoom);
            setOpenAddInvoiceModal(false);
            setOpenAddRoomModal(false);
            setOpenDeleteInvoiceModal(false);
            setOpenEditInvoiceModal(false);
            setOpenPayModal(false);
            setOpenPaymentModal(false);
            setOpenReceiveModal(false);
            setOpenStatusInvoiceModal(false);
            setOpenViewInvoiceModal(false);
            setOpenVisitorModal(false);
            setOpenChangeModal(false);
            Swal.fire({
              position: "bottom",
              html: `<div class="text-sm">${actionData.listRoom
                .filter((room) => !room.success)
                .map((room) => {
                  return `<button type="button" class="px-4 py-2 mt-2 rounded-lg bg-red-800 text-white">${room.displayMessage}.</button>`;
                })}</div>`,
              showConfirmButton: false,
              background: "transparent",
              backdrop: "none",
              timer: 2500,
            });
          }
          //Notify add list room succeess
          if (actionData.listAddingRoom) {
            // console.log(actionData.listAddingRoom);
            Swal.fire({
              position: "bottom",
              html: `<div class="text-sm">${actionData.listAddingRoom.map(
                (room) => {
                  return `<button type="button" class="px-4 py-2 mt-2 rounded-lg bg-green-800 text-white">${room.displayMessage}</button>`;
                }
              )}</div>`,
              showConfirmButton: false,
              background: "transparent",
              backdrop: "none",
              timer: 2500,
            });
          }
          //Notify receive invoice
          if (actionData.checkinRoom) {
            const bgColor = actionData.checkinRoom.success
              ? "bg-green-800"
              : "bg-red-800";
            Swal.fire({
              position: "bottom",
              html: `<div class="text-sm"><button type="button" class="px-4 py-2 mt-2 rounded-lg ${bgColor} text-white">${actionData.checkinRoom.displayMessage}</button>`,
              showConfirmButton: false,
              background: "transparent",
              backdrop: "none",
              timer: 2500,
            });
          }
          //Notify pay room
          if (actionData.checkoutRoom) {
            const nameRoom = reservation.listReservationDetails.find(
              (details) =>
                details.reservationDetailId === actionData.checkoutRoom.result
            );
            const bgColor = actionData.checkoutRoom.success
              ? "bg-green-800"
              : "bg-red-800";
            const message = actionData.checkoutRoom.success
              ? "trả phòng thành công!"
              : "đang trùng lịch đặt phòng.";
            Swal.fire({
              position: "bottom",
              html: `<div class="text-sm"><button type="button" class="px-4 py-2 mt-2 rounded-lg ${bgColor} text-white">Phòng ${nameRoom.room.roomName} ${message}</button>`,
              showConfirmButton: false,
              background: "transparent",
              backdrop: "none",
              timer: 2500,
            });
          }
          //Notify add invoice
          if (actionData.isAddInvoice) {
            if (actionData.isAddInvoice.data.success) {
              Swal.fire({
                position: "bottom",
                html: `<div class="text-sm"><button type="button" class="px-4 py-2 mt-2 rounded-lg bg-green-800 text-white">Thêm hoá đơn thành công</button>`,
                showConfirmButton: false,
                background: "transparent",
                backdrop: "none",
                timer: 2500,
              });
            } else {
              Swal.fire({
                position: "bottom",
                html: `<div class="text-sm"><button type="button" class="px-4 py-2 mt-2 rounded-lg bg-red-800 text-white">Thêm hoá đơn thất bại</button>`,
                showConfirmButton: false,
                background: "transparent",
                backdrop: "none",
                timer: 2500,
              });
            }
          }
          //Notify edit invoice
          if (actionData.isEditInvoice) {
            if (actionData.isEditInvoice.data.success) {
              Swal.fire({
                position: "bottom",
                html: `<div class="text-sm"><button type="button" class="px-4 py-2 mt-2 rounded-lg bg-green-800 text-white">Cập nhật hoá đơn thành công</button>`,
                showConfirmButton: false,
                background: "transparent",
                backdrop: "none",
                timer: 2500,
              });
            } else {
              Swal.fire({
                position: "bottom",
                html: `<div class="text-sm"><button type="button" class="px-4 py-2 mt-2 rounded-lg bg-red-800 text-white">Cập nhật hoá đơn thất bại</button>`,
                showConfirmButton: false,
                background: "transparent",
                backdrop: "none",
                timer: 2500,
              });
            }
          }
          //Notify status invoice
          if (actionData.isStatusInvoice) {
            if (actionData.isStatusInvoice.data.success) {
              Swal.fire({
                position: "bottom",
                html: `<div class="text-sm"><button type="button" class="px-4 py-2 mt-2 rounded-lg bg-green-800 text-white">${actionData.status} hoá đơn thành công</button>`,
                showConfirmButton: false,
                background: "transparent",
                backdrop: "none",
                timer: 2500,
              });
            } else {
              Swal.fire({
                position: "bottom",
                html: `<div class="text-sm"><button type="button" class="px-4 py-2 mt-2 rounded-lg bg-red-800 text-white">${actionData.status} hoá đơn thất bại</button>`,
                showConfirmButton: false,
                background: "transparent",
                backdrop: "none",
                timer: 2500,
              });
            }
          }
          //Notify cancel invoice
          if (actionData.isCancelInvoice) {
            if (actionData.isCancelInvoice.data.success) {
              Swal.fire({
                position: "bottom",
                html: `<div class="text-sm"><button type="button" class="px-4 py-2 mt-2 rounded-lg bg-green-800 text-white">Huỷ hoá đơn thành công</button>`,
                showConfirmButton: false,
                background: "transparent",
                backdrop: "none",
                timer: 2500,
              });
            } else {
              Swal.fire({
                position: "bottom",
                html: `<div class="text-sm"><button type="button" class="px-4 py-2 mt-2 rounded-lg bg-red-800 text-white">Huỷ hoá đơn thất bại</button>`,
                showConfirmButton: false,
                background: "transparent",
                backdrop: "none",
                timer: 2500,
              });
            }
          }
          //Notify remove room
          if (actionData.removeRoom) {
            if (actionData.removeRoom.data.success) {
              setRoomActive(null);
              Swal.fire({
                position: "bottom",
                html: `<div class="text-sm"><button type="button" class="px-4 py-2 mt-2 rounded-lg bg-green-800 text-white">Xoá phòng thành công</button>`,
                showConfirmButton: false,
                background: "transparent",
                backdrop: "none",
                timer: 2500,
              });
            } else {
              Swal.fire({
                position: "bottom",
                html: `<div class="text-sm"><button type="button" class="px-4 py-2 mt-2 rounded-lg bg-red-800 text-white">Xoá phòng thất bại</button>`,
                showConfirmButton: false,
                background: "transparent",
                backdrop: "none",
                timer: 2500,
              });
            }
          }

          //Notify change room
          if (actionData.changeRoom) {
            if (actionData.changeRoom) {
              Swal.fire({
                position: "bottom",
                html: `<div class="text-sm"><button type="button" class="px-4 py-2 mt-2 rounded-lg bg-green-800 text-white">Thay đổi phòng thành công</button>`,
                showConfirmButton: false,
                background: "transparent",
                backdrop: "none",
                timer: 2500,
              });
            } else {
              Swal.fire({
                position: "bottom",
                html: `<div class="text-sm"><button type="button" class="px-4 py-2 mt-2 rounded-lg bg-red-800 text-white">Thay đổi phòng thất bại</button>`,
                showConfirmButton: false,
                background: "transparent",
                backdrop: "none",
                timer: 2500,
              });
            }
          }
          //Notify edit customer
          if (actionData.editCustomer) {
            if (actionData.editCustomer) {
              setCustomer(
                customers.find(
                  (cus) => cus.customerId === actionData.editCustomer.customerId
                )
              );
              Swal.fire({
                position: "bottom",
                html: `<div class="text-sm"><button type="button" class="px-4 py-2 mt-2 rounded-lg bg-green-800 text-white">Chỉnh sửa thông tin khách hàng thành công</button>`,
                showConfirmButton: false,
                background: "transparent",
                backdrop: "none",
                timer: 2500,
              });
            } else {
              Swal.fire({
                position: "bottom",
                html: `<div class="text-sm"><button type="button" class="px-4 py-2 mt-2 rounded-lg bg-red-800 text-white">Chỉnh sửa thông tin khách hàng thất bại</button>`,
                showConfirmButton: false,
                background: "transparent",
                backdrop: "none",
                timer: 2500,
              });
            }
          }

          //Notify add customer
          if (actionData.addCustomer) {
            console.log(actionData);
            if (actionData.addCustomer) {
              setCustomer(
                customers.find(
                  (cus) => cus.customerId === actionData.addCustomer.customerId
                )
              );
              Swal.fire({
                position: "bottom",
                html: `<div class="text-sm"><button type="button" class="px-4 py-2 mt-2 rounded-lg bg-green-800 text-white">Thêm thông tin khách hàng thành công</button>`,
                showConfirmButton: false,
                background: "transparent",
                backdrop: "none",
                timer: 2500,
              });
            } else {
              Swal.fire({
                position: "bottom",
                html: `<div class="text-sm"><button type="button" class="px-4 py-2 mt-2 rounded-lg bg-red-800 text-white">Thêm thông tin khách hàng thất bại</button>`,
                showConfirmButton: false,
                background: "transparent",
                backdrop: "none",
                timer: 2500,
              });
            }
          }

          //Notify add deposit
          if (actionData.addDeposit) {
            if (actionData.addDeposit.data.success) {
              Swal.fire({
                position: "bottom",
                html: `<div class="text-sm"><button type="button" class="px-4 py-2 mt-2 rounded-lg bg-green-800 text-white">Thêm tiền cọc thành công</button>`,
                showConfirmButton: false,
                background: "transparent",
                backdrop: "none",
                timer: 2500,
              });
            } else {
              Swal.fire({
                position: "bottom",
                html: `<div class="text-sm"><button type="button" class="px-4 py-2 mt-2 rounded-lg bg-red-800 text-white">Thêm tiền cọc thất bại</button>`,
                showConfirmButton: false,
                background: "transparent",
                backdrop: "none",
                timer: 2500,
              });
            }
          }

          //Notify not customer
          if (actionData.isNotCustomer) {
            Swal.fire({
              position: "bottom",
              html: `<div class="text-sm"><button type="button" class="px-4 py-2 mt-2 rounded-lg bg-red-800 text-white">Bạn cần phải chọn khách hàng</button>`,
              showConfirmButton: false,
              background: "transparent",
              backdrop: "none",
              timer: 2500,
            });
            setOpenAddInvoiceModal(false);
            setOpenAddRoomModal(false);
            setOpenDeleteInvoiceModal(false);
            setOpenEditInvoiceModal(false);
            setOpenPayModal(false);
            setOpenPaymentModal(false);
            setOpenReceiveModal(false);
            setOpenStatusInvoiceModal(false);
            setOpenViewInvoiceModal(false);
            setOpenVisitorModal(false);
            setOpenChangeModal(false);
          }

          //Notify add deposit
          if (actionData.isCreateInvoiceRoom) {
            if (actionData.isCreateInvoiceRoom) {
              Swal.fire({
                position: "bottom",
                html: `<div class="text-sm"><button type="button" class="px-4 py-2 mt-2 rounded-lg bg-green-800 text-white">Tạo hoá đơn thành công</button>`,
                showConfirmButton: false,
                background: "transparent",
                backdrop: "none",
                timer: 2500,
              });
            } else {
              Swal.fire({
                position: "bottom",
                html: `<div class="text-sm"><button type="button" class="px-4 py-2 mt-2 rounded-lg bg-red-800 text-white">Tạo hoá đơn thất bại</button>`,
                showConfirmButton: false,
                background: "transparent",
                backdrop: "none",
                timer: 2500,
              });
            }
            setOpenPaymentModal(true);
          }

          //Notify add deposit
          if (actionData.isDoneReservation) {
            if (actionData.isDoneReservation) {
              Swal.fire({
                position: "bottom",
                html: `<div class="text-sm"><button type="button" class="px-4 py-2 mt-2 rounded-lg bg-green-800 text-white">Tạo hoá đơn thành công</button>`,
                showConfirmButton: false,
                background: "transparent",
                backdrop: "none",
                timer: 2500,
              });
            } else {
              Swal.fire({
                position: "bottom",
                html: `<div class="text-sm"><button type="button" class="px-4 py-2 mt-2 rounded-lg bg-red-800 text-white">Tạo hoá đơn thất bại</button>`,
                showConfirmButton: false,
                background: "transparent",
                backdrop: "none",
                timer: 2500,
              });
            }
          }
        }
        if (reservation && reservation.listReservationDetails.length > 0) {
          let roomAc = null;
          if (roomActive) {
            roomAc = reservation.listReservationDetails.find(
              (details) =>
                details.reservationDetailId === roomActive.reservationDetailId
            );
          } else {
            roomAc = reservation.listReservationDetails[0];
          }

          setRoomActive(
            roomAc ? roomAc : reservation.listReservationDetails[0]
          );
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchRoomActive();
  }, [reservation]);
  // console.log(roomActive);
  const [priceBook, setPriceBook] = useState(priceById);
  let price = priceByCateRoom;

  const handlePriceBookChange = (event) => {
    const priceById = allPrices.find(
      (price) => price.PriceList.priceListId === event.target.value
    );
    if (roomActive) {
      price = priceById.ListPriceListDetail.find(
        (details) =>
          details.RoomClass.roomCategoryId ===
          roomActive.room.roomCategory.roomCategoryId
      ).PriceListDetailWithDayOfWeek;
    }
    setPriceBook(priceById);
  };

  useEffect(() => {
    async function fetchListCustomers() {
      try {
        if (reservation && roomActive) {
          const listCustomers = await axiosPrivate.get(
            "reservation-detail/list-customers/" +
              roomActive.reservationDetailId
          );
          setListCustomers(listCustomers.data.result);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchListCustomers();
  }, [actionData, roomActive]);

  const handleRoomChange = (room) => {
    price = priceBook.ListPriceListDetail.find(
      (details) =>
        details.RoomClass.roomCategoryId ===
        room.room.roomCategory.roomCategoryId
    ).PriceListDetailWithDayOfWeek;

    setRoomActive(room);
  };

  const handleCustomerClick = (customerId) => {
    setCustomer(customers.find((cus) => cus.customerId === customerId));
  };

  const handleCustomerRemove = () => {
    setCustomer(null);
  };

  const handleInvoicePrint = useReactToPrint({
    content: () => printInvoiceRef.current,
  });

  const handleBookingPrint = useReactToPrint({
    content: () => printBookingRef.current,
  });

  // console.log(customers);
  return (
    <>
      <div className="px-4 w-full py-2 print:hidden">
        <div className="flex">
          <SearchCustomer
            customers={customers.filter((customer) => customer.isCustomer)}
            customer={customer}
            handleCustomerClick={handleCustomerClick}
            handleCustomerRemove={handleCustomerRemove}
            disable={isDone}
          />
          <button
            type="button"
            className="ml-4 rounded-lg px-2 border bg-white hover:border-green-500"
          >
            <i className="fa-solid fa-user-tie ml-2"></i>
            <span className="mx-2">
              {reservation ? reservation.reservation.totalAdults : 0}
            </span>
            {" | "}
            <i className="fa-solid fa-child ml-2"></i>
            <span className="mx-2">
              {reservation ? reservation.reservation.totalChildren : 0}
            </span>
          </button>
          <div className="ml-auto">
            <Select
              sx={{ width: 200, height: 40, backgroundColor: "white" }}
              value={
                priceBook
                  ? priceBook.PriceList.priceListId
                  : allPrices[0].PriceList.priceListId
              }
              onChange={handlePriceBookChange}
              disabled={isDone}
            >
              {allPrices.map((price) => {
                const details = price.PriceList;
                return (
                  <MenuItem
                    key={details.priceListId}
                    value={details.priceListId}
                  >
                    {details.priceListName}
                  </MenuItem>
                );
              })}
            </Select>
          </div>
        </div>
      </div>
      {reservation ? (
        <>
          <Form method="PUT" className="h-[45rem] px-5 print:hidden">
            <div className="flex my-auto rounded-lg py-2">
              {reservation.listReservationDetails.length > 0 && roomActive && (
                <div className="px-2 py-1 mr-2 rounded-lg bg-white">
                  {reservation.listReservationDetails.map((room, index) => {
                    let status = 3;
                    if (room.status === "CHECK_IN") {
                      status = 2;
                    } else if (room.status === "BOOKING") {
                      status = 1;
                    }
                    return status === 1 ? (
                      <button
                        key={index}
                        type="button"
                        className={`pl-2 pr-1 py-1 ${
                          room.reservationDetailId ===
                          roomActive.reservationDetailId
                            ? "bg-orange-500 text-white"
                            : "text-orange-500 hover:bg-orange-200"
                        } rounded`}
                        onClick={() => {
                          handleRoomChange(room);
                        }}
                      >
                        {room.room.roomName}
                        <i
                          className="fa-solid fa-xmark ml-1 p-1 px-1.5 hover:bg-orange-300 hover:rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            setRemoveRoomModal(room);
                          }}
                        ></i>
                      </button>
                    ) : status === 2 ? (
                      <button
                        key={index}
                        type="button"
                        className={`px-2 py-1 ${
                          room.reservationDetailId ===
                          roomActive.reservationDetailId
                            ? "bg-green-500 text-white"
                            : "text-green-500 hover:bg-green-200"
                        } rounded`}
                        onClick={() => {
                          handleRoomChange(room);
                        }}
                      >
                        {room.room.roomName}
                      </button>
                    ) : (
                      <button
                        key={index}
                        type="button"
                        className={`px-2 py-1 ${
                          room.reservationDetailId ===
                          roomActive.reservationDetailId
                            ? "bg-gray-500 text-white"
                            : "text-gray-500 hover:bg-gray-200"
                        } rounded`}
                        onClick={() => {
                          handleRoomChange(room);
                        }}
                      >
                        {room.room.roomName}
                      </button>
                    );
                  })}
                </div>
              )}
              {!isDone && (
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg text-green-500 hover:bg-green-100"
                  onClick={() => {
                    if (customer) {
                      setOpenAddRoomModal(true);
                    } else {
                      Swal.fire({
                        position: "bottom",
                        html: `<div class="text-sm"><button type="button" class="px-4 py-2 mt-2 rounded-lg bg-red-800 text-white">Bạn cần phải chọn khách hàng</button>`,
                        showConfirmButton: false,
                        background: "transparent",
                        backdrop: "none",
                        timer: 2000,
                      });
                    }
                  }}
                >
                  <i className="fa-solid fa-circle-plus pr-2"></i>
                  Phòng
                </button>
              )}

              {reservation.listReservationDetails.length === 0 && (
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg text-red-500 hover:bg-red-100"
                  onClick={() => setOpenCancelReservationModal(true)}
                >
                  <i className="fa-solid fa-trash pr-2"></i>
                  Huỷ đặt phòng
                </button>
              )}
              {roomActive && roomActive.status === "BOOKING" && (
                <>
                  <button
                    className="px-4 py-2 ml-auto rounded-lg text-white bg-green-500 hover:bg-green-600"
                    onClick={() => {
                      setOpenReceiveModal(true);
                    }}
                  >
                    Nhận phòng
                  </button>
                  <button
                    className="px-4 py-2 ml-2 rounded-lg text-white bg-gray-500 hover:bg-gray-600"
                    onClick={() => {
                      setOpenChangeModal(true);
                    }}
                  >
                    Đổi phòng
                  </button>
                </>
              )}
              {roomActive && roomActive.status === "CHECK_IN" && (
                <>
                  <button
                    className="px-4 py-2 ml-auto rounded-lg text-white bg-blue-500 hover:bg-blue-600"
                    onClick={() => {
                      setOpenPayModal(true);
                    }}
                  >
                     Trả phòng
                  </button>
                  <button
                    className="px-4 py-2 ml-2 rounded-lg text-white bg-gray-500 hover:bg-gray-600"
                    onClick={() => {
                      setOpenChangeModal(true);
                    }}
                  >
                    Đổi phòng
                  </button>
                </>
              )}
              {roomActive &&
                (roomActive.status === "CHECK_OUT" ||
                  roomActive.status === "DONE") && <></>}
            </div>
            {roomActive && listCustomers && (
              <>
                <input type="hidden" name="isReservation" defaultValue={true} />
                <input
                  type="hidden"
                  name="reservationId"
                  defaultValue={reservation.reservation.reservationId}
                />
                {customer && (
                  <input
                    type="hidden"
                    name="customerId"
                    value={customer.customerId}
                    onChange={() => console.log()}
                  />
                )}
                <input
                  type="hidden"
                  name="priceListId"
                  value={priceBook.PriceList.priceListId}
                  onChange={() => console.log()}
                />
                <input
                  type="hidden"
                  name="numberRoom"
                  defaultValue={reservation.listReservationDetails.length}
                />
                <div className="w-full py-2 h-5/6 overflow-y-auto">
                  {reservation.listReservationDetails.map((room, index) => {
                    return (
                      <div
                        key={index}
                        className={`${
                          roomActive.reservationDetailId !==
                            room.reservationDetailId && "hidden"
                        }`}
                      >
                        <SelectRoom
                          room={room}
                          listRoomByRes={reservation.listReservationDetails.filter(
                            (res) => res.room.roomId !== room.room.roomId
                          )}
                          index={index}
                          price={
                            priceBook.ListPriceListDetail.find(
                              (details) =>
                                details.RoomClass.roomCategoryId ===
                                room.room.roomCategory.roomCategoryId
                            ).PriceListDetailWithDayOfWeek
                          }
                          visitors={listCustomers}
                          handleVisitModalOpen={() => setOpenVisitorModal(true)}
                        />
                      </div>
                    );
                  })}
                  {invoices.find(
                    (invoice) =>
                      invoice.ReservationDetailId ===
                      roomActive.reservationDetailId
                  ) && (
                    <div className="bg-white p-4 mt-4 flex">
                      <div className="w-3/12">Mã hoá đơn</div>
                      <div className="w-3/12">Trạng thái</div>
                      <div className="w-3/12">Tổng tiền</div>
                      <div className="w-3/12">Hoạt động</div>
                    </div>
                  )}
                  {invoices.find(
                    (invoice) =>
                      invoice.ReservationDetailId ===
                      roomActive.reservationDetailId
                  ) &&
                    invoices
                      .find(
                        (invoice) =>
                          invoice.ReservationDetailId ===
                          roomActive.reservationDetailId
                      )
                      .listOrderByReservationDetailId.map((invoice, index) => {
                        if (
                          roomActive.status === "CHECK_OUT" ||
                          roomActive.status === "DONE"
                        ) {
                          if (
                            invoice.order.status === "CONFIRMED" ||
                            invoice.order.status === "PAID"
                          ) {
                            return (
                              <div
                                key={index}
                                className="bg-white p-4 mt-1 flex"
                              >
                                <div className="w-3/12">
                                  {invoice.order.orderId}
                                </div>
                                <div
                                  className={`w-3/12 ${
                                    invoice.order.status === "UNCONFIRMED" &&
                                    "text-orange-500"
                                  } ${
                                    invoice.order.status === "CONFIRMED" &&
                                    "text-blue-500"
                                  } ${
                                    invoice.order.status === "PAID" &&
                                    "text-green-500"
                                  } ${
                                    invoice.order.status === "CANCEL_ORDER" &&
                                    "text-gray-500"
                                  }`}
                                >
                                  {invoice.order.status === "UNCONFIRMED" &&
                                    "Chưa xác nhận"}
                                  {invoice.order.status === "CONFIRMED" &&
                                    "Xác nhận"}
                                  {invoice.order.status === "PAID" &&
                                    "Đã thanh toán"}
                                  {invoice.order.status === "CANCEL_ORDER" &&
                                    "Huỷ hoá đơn"}
                                </div>
                                <div className="w-3/12">
                                  {invoice.order.totalPay.toLocaleString()}
                                </div>
                                <div className="w-3/12">
                                  <button
                                    type="button"
                                    className="mr-4 px-1 rounded-full hover:bg-gray-200"
                                    onClick={() => {
                                      setSelectedInvoice(invoice);
                                      setOpenViewInvoiceModal(true);
                                    }}
                                  >
                                    <i className="fa-solid fa-eye"></i>
                                  </button>
                                  <button
                                    type="button"
                                    className="mr-4 px-1 rounded-full hover:bg-gray-200"
                                    onMouseOver={() => {
                                      setSelectedInvoice(invoice);
                                    }}
                                    onMouseLeave={() => {
                                      setSelectedInvoice(null);
                                    }}
                                    onClick={handleInvoicePrint}
                                  >
                                    <i className="fa-solid fa-print"></i>
                                  </button>
                                  {invoice.order.status === "UNCONFIRMED" &&
                                    (roomActive.status === "CHECK_IN" ||
                                      roomActive.status === "BOOKING") && (
                                      <>
                                        <button
                                          type="button"
                                          className="mr-4 px-1 rounded-full hover:bg-gray-200"
                                          onClick={() => {
                                            // console.log(invoice);
                                            setSelectedInvoice(invoice);
                                            setOpenEditInvoiceModal(true);
                                          }}
                                        >
                                          <i className="fa-solid fa-pen"></i>
                                        </button>
                                        <button
                                          className="mr-4 px-1 rounded-full hover:bg-gray-200"
                                          onClick={() => {
                                            setSelectedInvoice(invoice);
                                            setOpenStatusInvoiceModal(true);
                                          }}
                                        >
                                          <i className="fa-solid fa-check"></i>
                                        </button>
                                        <button
                                          className="mr-4 px-1 rounded-full hover:bg-gray-200"
                                          onClick={() => {
                                            setSelectedInvoice(invoice);
                                            setOpenDeleteInvoiceModal(true);
                                          }}
                                        >
                                          <i className="fa-solid fa-trash"></i>
                                        </button>
                                      </>
                                    )}
                                  {invoice.order.status === "CONFIRMED" &&
                                    (roomActive.status === "CHECK_IN" ||
                                      roomActive.status === "BOOKING") && (
                                      <button
                                        className="mr-4 px-1 rounded-full hover:bg-gray-200"
                                        onClick={() => {
                                          setSelectedInvoice(invoice);
                                          setOpenStatusInvoiceModal(true);
                                        }}
                                      >
                                        <i className="fa-solid fa-check"></i>
                                      </button>
                                    )}
                                </div>
                              </div>
                            );
                          }
                        } else {
                          return (
                            <div key={index} className="bg-white p-4 mt-1 flex">
                              <div className="w-3/12">
                                {invoice.order.orderId}
                              </div>
                              <div
                                className={`w-3/12 ${
                                  invoice.order.status === "UNCONFIRMED" &&
                                  "text-orange-500"
                                } ${
                                  invoice.order.status === "CONFIRMED" &&
                                  "text-blue-500"
                                } ${
                                  invoice.order.status === "PAID" &&
                                  "text-green-500"
                                } ${
                                  invoice.order.status === "CANCEL_ORDER" &&
                                  "text-gray-500"
                                }`}
                              >
                                {invoice.order.status === "UNCONFIRMED" &&
                                  "Chưa xác nhận"}
                                {invoice.order.status === "CONFIRMED" &&
                                  "Xác nhận"}
                                {invoice.order.status === "PAID" &&
                                  "Đã thanh toán"}
                                {invoice.order.status === "CANCEL_ORDER" &&
                                  "Huỷ hoá đơn"}
                              </div>
                              <div className="w-3/12">
                                {invoice.order.totalPay.toLocaleString()}
                              </div>
                              <div className="w-3/12">
                                <button
                                  type="button"
                                  className="mr-4 px-1 rounded-full hover:bg-gray-200"
                                  onClick={() => {
                                    setSelectedInvoice(invoice);
                                    setOpenViewInvoiceModal(true);
                                  }}
                                >
                                  <i className="fa-solid fa-eye"></i>
                                </button>
                                <button
                                  type="button"
                                  className="mr-4 px-1 rounded-full hover:bg-gray-200"
                                  onMouseOver={() => {
                                    setSelectedInvoice(invoice);
                                  }}
                                  onMouseLeave={() => {
                                    setSelectedInvoice(null);
                                  }}
                                  onClick={handleInvoicePrint}
                                >
                                  <i className="fa-solid fa-print"></i>
                                </button>
                                {invoice.order.status === "UNCONFIRMED" &&
                                  (roomActive.status === "CHECK_IN" ||
                                    roomActive.status === "BOOKING") && (
                                    <>
                                      <button
                                        type="button"
                                        className="mr-4 px-1 rounded-full hover:bg-gray-200"
                                        onClick={() => {
                                          // console.log(invoice);
                                          setSelectedInvoice(invoice);
                                          setOpenEditInvoiceModal(true);
                                        }}
                                      >
                                        <i className="fa-solid fa-pen"></i>
                                      </button>
                                      <button
                                        className="mr-4 px-1 rounded-full hover:bg-gray-200"
                                        onClick={() => {
                                          setSelectedInvoice(invoice);
                                          setOpenStatusInvoiceModal(true);
                                        }}
                                      >
                                        <i className="fa-solid fa-check"></i>
                                      </button>
                                      <button
                                        className="mr-4 px-1 rounded-full hover:bg-gray-200"
                                        onClick={() => {
                                          setSelectedInvoice(invoice);
                                          setOpenDeleteInvoiceModal(true);
                                        }}
                                      >
                                        <i className="fa-solid fa-trash"></i>
                                      </button>
                                    </>
                                  )}
                                {invoice.order.status === "CONFIRMED" &&
                                  (roomActive.status === "CHECK_IN" ||
                                    roomActive.status === "BOOKING") && (
                                    <button
                                      className="mr-4 px-1 rounded-full hover:bg-gray-200"
                                      onClick={() => {
                                        setSelectedInvoice(invoice);
                                        setOpenStatusInvoiceModal(true);
                                      }}
                                    >
                                      <i className="fa-solid fa-check"></i>
                                    </button>
                                  )}
                              </div>
                            </div>
                          );
                        }
                      })}
                  {roomActive &&
                    (roomActive.status === "CHECK_IN" ||
                      roomActive.status === "BOOKING") && (
                      <button
                        className="rounded p-2 mt-2 text-white bg-green-500"
                        onClick={() => setOpenAddInvoiceModal(true)}
                      >
                        <i className="fa-solid fa-plus mr-2"></i>Tạo hoá đơn
                      </button>
                    )}
                </div>
                <div className="w-full py-2 h-.5/6 flex">
                  {reservation.listReservationDetails.every(
                    (details) => details.status === "BOOKING"
                  ) && (
                    <div>
                      <button
                        type="button"
                        onClick={() => setOpenCancelReservationModal(true)}
                      >
                        <i className="fa-solid fa-trash fa-lg"></i>
                      </button>
                    </div>
                  )}
                  <div className="ml-auto">
                    <button
                      type="button"
                      className="px-4 py-2 bg-white border border-green-500 rounded-lg text-green-500 mr-2 hover:bg-gray-100"
                      onClick={handleBookingPrint}
                    >
                      In
                    </button>
                  </div>
                  {!isDone && (
                    <div>
                      <button className="px-4 py-2 bg-white border border-green-500 rounded-lg text-green-500 mr-2 hover:bg-gray-100">
                        Lưu
                      </button>
                    </div>
                  )}
                  <div>
                    <button
                      type={
                        reservation.listReservationDetails.every(
                          (details) =>
                            details.status === "CHECK_OUT" ||
                            details.status === "DONE"
                        )
                          ? "button"
                          : ""
                      }
                      className="px-4 py-2 bg-green-500 rounded-lg text-white mr-2 hover:bg-green-600"
                      onClick={() => {
                        setOpenPaymentModal(true);
                      }}
                    >
                      Thanh toán
                    </button>
                  </div>
                </div>
              </>
            )}
          </Form>
          {openAddRoomModal && (
            <AddRoom
              open={openAddRoomModal}
              onClose={() => setOpenAddRoomModal(false)}
              reservationId={reservation.reservation.reservationId}
              listPrice={priceBook.ListPriceListDetail}
            />
          )}
          {openAddInvoiceModal && (
            <AddInvoice
              open={openAddInvoiceModal}
              onClose={() => {
                setOpenAddInvoiceModal(false);
              }}
              reservationDetail={roomActive}
            />
          )}
          {roomActive &&
            invoices.find(
              (invoice) =>
                invoice.ReservationDetailId === roomActive.reservationDetailId
            ) && (
              <div className="hidden">
                <div ref={printInvoiceRef}>
                  {invoices
                    .find(
                      (invoice) =>
                        invoice.ReservationDetailId ===
                        roomActive.reservationDetailId
                    )
                    .listOrderByReservationDetailId.map((invoice) => {
                      return (
                        <div
                          className={`${
                            selectedInvoice
                              ? selectedInvoice.order.orderId ===
                                invoice.order.orderId
                                ? ""
                                : "hidden"
                              : "hidden"
                          } m-10`}
                        >
                          <p>Tên khách sạn: Khách sạn Văn Lâm</p>
                          <p>Điện thoại: 0981987625</p>
                          <p>Địa chỉ: </p>
                          <div className="mt-4 border-t border-black border-dotted">
                            Ngày xuất HĐ: {dayjs().format("DD/MM/YYYY HH:mm")}
                          </div>
                          <div className="mt-4">
                            <div className="font-bold text-center">
                              <h2>HOÁ ĐƠN BÁN HÀNG</h2>
                              <p className="text-sm">{invoice.order.orderId}</p>
                            </div>
                            <div>
                              <p>
                                Khách hàng:{" "}
                                {customer ? customer.customerName : "Khách lẻ"}
                              </p>
                              <p>Phòng: {roomActive.room.roomName}</p>
                              <p>Lễ tân: {decodedToken.sub}</p>
                            </div>
                            {invoice.listOrderDetailByOrder.length > 0 && (
                              <table className="my-5 text-center min-w-full border border-gray-300 divide-y divide-gray-300">
                                <thead>
                                  <tr>
                                    <td>Nội dung</td>
                                    <td>Đơn vị</td>
                                    <td>SL</td>
                                    <td>Thành tiền</td>
                                  </tr>
                                </thead>
                                <tbody>
                                  {invoice.listOrderDetailByOrder.map(
                                    (goods, index) => {
                                      return (
                                        <tr key={index}>
                                          <td>
                                            {goods.orderDetail.goods.goodsName}
                                          </td>
                                          <td>
                                            {
                                              goods.orderDetail.goodsUnit
                                                .goodsUnitName
                                            }
                                          </td>
                                          <td>{goods.orderDetail.quantity}</td>
                                          <td>{goods.orderDetail.price}</td>
                                        </tr>
                                      );
                                    }
                                  )}
                                </tbody>
                              </table>
                            )}
                            <div className="flex">
                              <div className="ml-auto mr-10">Tổng cộng: </div>
                              <div className="w-32 text-right">
                                {invoice.order.totalPay.toLocaleString()}
                              </div>
                            </div>
                            <div className="text-right mt-5 mr-20 h-20">
                              Ký tên xác nhận
                            </div>
                          </div>
                          <div className="flex mt-10">
                            <img
                              className="mx-auto w-90 h-96"
                              src={`https://img.vietqr.io/image/${
                                listQR[0].bankId
                              }-${
                                listQR[0].bankAccountNumber
                              }-print.jpg?amount=${
                                invoice.order.totalPay
                              }&addInfo=${"MGD" + invoice.order.orderId}`}
                            />
                          </div>
                          <div className="text-center text-sm">
                            Cảm ơn và hẹn gặp lại
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          {selectedInvoice && openViewInvoiceModal && (
            <ViewInvoice
              open={openViewInvoiceModal}
              onClose={() => setOpenViewInvoiceModal(false)}
              invoice={selectedInvoice}
            />
          )}
          {selectedInvoice && openEditInvoiceModal && (
            <EditInvoice
              open={openEditInvoiceModal}
              onClose={() => setOpenEditInvoiceModal(false)}
              invoice={selectedInvoice}
              reservationDetail={roomActive}
            />
          )}
          {selectedInvoice && openStatusInvoiceModal && (
            <StatusInvoice
              open={openStatusInvoiceModal}
              onClose={() => setOpenStatusInvoiceModal(false)}
              invoice={selectedInvoice}
              transactionCode={"MGD" + selectedInvoice.order.orderId}
            />
          )}
          {selectedInvoice && openDeleteInvoiceModal && (
            <CancelInvoice
              open={openDeleteInvoiceModal}
              onClose={() => setOpenDeleteInvoiceModal(false)}
              invoice={selectedInvoice}
            />
          )}
          {listCustomers && openVisitorModal && (
            <VisitorModal
              open={openVisitorModal}
              onClose={() => setOpenVisitorModal(false)}
              room={roomActive}
              check={check}
              visitors={listCustomers}
            />
          )}
          {removeRoomModal && (
            <RemoveRoom
              open={removeRoomModal ? true : false}
              onClose={() => setRemoveRoomModal(null)}
              room={removeRoomModal}
            />
          )}
          {openPaymentModal && (
            <PaymentModal
              open={openPaymentModal}
              onClose={() => setOpenPaymentModal(false)}
              reservation={reservation}
              invoices={invoices}
            />
          )}
        </>
      ) : (
        <>
          <div className="flex">
            <button
              className="mx-auto mt-10 text-green-500 px-4 py-2 rounded-lg border border-green-500 hover:bg-green-100"
              type="button"
              onClick={() => {
                if (customer) {
                  setOpenAddRoomModal(true);
                } else {
                  Swal.fire({
                    position: "bottom",
                    html: `<div class="text-sm"><button type="button" class="px-4 py-2 mt-2 rounded-lg bg-red-800 text-white">Bạn cần phải chọn khách hàng</button>`,
                    showConfirmButton: false,
                    background: "transparent",
                    backdrop: "none",
                    timer: 2000,
                  });
                }
              }}
            >
              <i className="fa-solid fa-plus mr-2"></i>
              Phòng
            </button>
          </div>
          {openAddRoomModal && (
            <AddRoom
              open={openAddRoomModal}
              onClose={() => setOpenAddRoomModal(false)}
              addReservation={true}
              priceListId={
                priceBook
                  ? priceBook.PriceList.priceListId
                  : allPrices[0].PriceList.priceListId
              }
              customerId={customer ? customer.customerId : null}
              listPrice={
                priceBook
                  ? priceBook.ListPriceListDetail
                  : allPrices[0].ListPriceListDetail
              }
            />
          )}
        </>
      )}
      {reservation && (
        <div className="hidden">
          <div ref={printBookingRef}>
            <div className="m-10">
              <p>Tên khách sạn: Khách sạn Văn Lâm</p>
              <p>Điện thoại: 0981987625</p>
              <p>Địa chỉ: </p>
              <div className="mt-4 border-t border-black border-dotted">
                Ngày xuất HĐ: {dayjs().format("DD/MM/YYYY HH:mm")}
              </div>
              <div className="mt-4">
                <div className="font-bold text-center">
                  <h2>HOÁ ĐƠN ĐẶT PHÒNG</h2>
                </div>
                <div>
                  <p>
                    Khách hàng: {reservation.reservation.customer.customerName}
                  </p>
                  <p>Lễ tân: {decodedToken.sub}</p>
                </div>
                <table className="text-left min-w-full divide-y divide-gray-300">
                  <thead className="">
                    <tr className="border border-black">
                      <td className="px-4 py-2 text-center border-r border-black">
                        Thông tin phòng
                      </td>
                      <td className="px-4 py-2">Thành tiền</td>
                    </tr>
                  </thead>
                  <tbody>
                    {reservation.listReservationDetails.map(
                      (details, index) => {
                        let priceRoom = details.price;
                        let listGoods = [];
                        const invoiceByDetails = invoices.find(
                          (invoice) =>
                            invoice.ReservationDetailId ===
                            details.reservationDetailId
                        );
                        if (invoiceByDetails) {
                          invoiceByDetails.listOrderByReservationDetailId
                            .flatMap((group) => group.listOrderDetailByOrder)
                            .map((cur) => {
                              const productIndex =
                                listGoods.length > 0
                                  ? listGoods.findIndex(
                                      (a) =>
                                        cur.orderDetail.goodsUnit
                                          .goodsUnitId ===
                                        a.goodsUnit.goodsUnitId
                                    )
                                  : -1;
                              if (productIndex !== -1) {
                                listGoods[productIndex] = {
                                  ...listGoods[productIndex],
                                  quantity:
                                    listGoods[productIndex].quantity +
                                    cur.orderDetail.quantity,
                                };
                              } else {
                                listGoods.push(cur.orderDetail);
                              }
                            });
                        }
                        let surcharge = [];
                        listSurchage.map((sur) => {
                          if (
                            sur.length > 0 &&
                            sur[0].reservationDetail.reservationDetailId ===
                              details.reservationDetailId
                          ) {
                            surcharge = sur;
                          }
                        });
                        return (
                          <tr className="border border-black">
                            <td className="px-4 py-2 border-r border-black">
                              <h2 className="flex">
                                <div className="mr-4">{index + 1}.</div>
                                <div className="font-bold">
                                  {details.room.roomCategory.roomCategoryName}
                                </div>
                                <div className="ml-2 px-2 rounded">
                                  {details.room.roomName}
                                </div>
                                <div className="ml-auto text-right">
                                  {details.price.toLocaleString() + " VND"}
                                </div>
                              </h2>
                              {surcharge.length > 0 && (
                                <div className="ml-2 mt-2 text-xs">
                                  {surcharge.map((sur) => {
                                    priceRoom += sur.value;
                                    return (
                                      <div>
                                        {sur.note +
                                          ": " +
                                          sur.value.toLocaleString() +
                                          " " +
                                          sur.typeValue}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                              {listGoods.length > 0 && (
                                <div className="mt-2 text-xs text-center">
                                  <h3 className="ml-2 font-medium mb-1">
                                    Hàng hoá đã mua
                                  </h3>
                                  <div className="flex ">
                                    <div className="w-3/12">
                                      Tên sản phẩm/dịch vụ
                                    </div>
                                    <div className="w-3/12 text-right">
                                      Số lượng
                                    </div>
                                    <div className="w-3/12 text-right">Giá</div>
                                    <div className="w-3/12 text-right">
                                      Tổng tiền
                                    </div>
                                  </div>
                                  {listGoods.map((good) => {
                                    priceRoom +=
                                      good.goodsUnit.price * good.quantity;
                                    return (
                                      <div className="flex">
                                        <div className="w-3/12 text-left">
                                          {good.goods.goodsName +
                                            "(" +
                                            good.goodsUnit.goodsUnitName +
                                            ")"}
                                        </div>
                                        <div className="w-3/12 text-right">
                                          {good.quantity}
                                        </div>
                                        <div className="w-3/12 text-right">
                                          {good.goodsUnit.price.toLocaleString() +
                                            " VND"}
                                        </div>
                                        <div className="w-3/12 text-right">
                                          {(
                                            good.goodsUnit.price * good.quantity
                                          ).toLocaleString() + " VND"}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </td>
                            <td className="px-2 py-1 font-bold text-right">
                              {priceRoom.toLocaleString() + " VND"}
                            </td>
                            <div className="hidden">
                              {(priceAll += priceRoom)}
                            </div>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
                <div className="flex mt-4">
                  <div className="ml-auto mr-10">Tổng tiền hoá đơn: </div>
                  <div className="w-32 text-right">
                    {priceAll.toLocaleString() + " VND"}
                  </div>
                </div>
                <div className="flex mt-2">
                  <div className="ml-auto mr-10">Giảm giá: </div>
                  <div className="w-32 text-right">
                    {priceDiscount.toLocaleString() + " VND"}
                  </div>
                </div>
                <div className="flex mt-2">
                  <div className="ml-auto mr-10">Phí khác: </div>
                  <div className="w-32 text-right">
                    {priceOtherFee.toLocaleString() + " VND"}
                  </div>
                </div>
                <div className="flex mt-2">
                  <div className="ml-auto mr-10">Tổng cộng: </div>
                  <div className="w-32 text-right">
                    {(
                      priceAll -
                      priceDiscount +
                      priceOtherFee
                    ).toLocaleString() + " VND"}
                  </div>
                </div>
              </div>
              <div className="text-center mt-10 text-sm">
                Cảm ơn và hẹn gặp lại
              </div>
            </div>
          </div>
        </div>
      )}
      {openReceiveModal && (
        <ReceiveRoomModal
          open={openReceiveModal}
          onClose={() => setOpenReceiveModal(false)}
          roomActive={roomActive}
          price={
            priceBook.ListPriceListDetail.find(
              (details) =>
                details.RoomClass.roomCategoryId ===
                roomActive.room.roomCategory.roomCategoryId
            ).PriceListDetailWithDayOfWeek
          }
        />
      )}
      {openPayModal && (
        <PayRoomModal
          open={openPayModal}
          onClose={() => setOpenPayModal(false)}
          roomActive={roomActive}
          price={
            priceBook.ListPriceListDetail.find(
              (details) =>
                details.RoomClass.roomCategoryId ===
                roomActive.room.roomCategory.roomCategoryId
            ).PriceListDetailWithDayOfWeek
          }
        />
      )}
      {openChangeModal && (
        <ChangeRoomModal
          open={openChangeModal}
          onClose={() => setOpenChangeModal(false)}
          roomActive={roomActive}
          price={
            priceBook.ListPriceListDetail.find(
              (details) =>
                details.RoomClass.roomCategoryId ===
                roomActive.room.roomCategory.roomCategoryId
            ).PriceListDetailWithDayOfWeek
          }
        />
      )}
      {openCancelReservationModal && (
        <CancelReservationModal
          open={openCancelReservationModal}
          onClose={() => setOpenCancelReservationModal(false)}
          reservation={reservation}
        />
      )}
    </>
  );
}

export default ReservationForm;
