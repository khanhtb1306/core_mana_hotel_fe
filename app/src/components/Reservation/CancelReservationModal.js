import { Form, useLoaderData } from "react-router-dom";
import Modal from "../UI/Modal";
import { useEffect, useState } from "react";
import { axiosPrivate } from "../../utils/axiosConfig";
import dayjs from "dayjs";

function CancelReservationModal(props) {
  const { listFunds } = useLoaderData();
  const [price, setPrice] = useState(0);
  const reservation = props.reservation;
  const day =
    dayjs(reservation.reservation.durationStart).diff(dayjs(), "day") > 0
      ? dayjs(reservation.reservation.durationStart).diff(dayjs(), "day")
      : 0;
  const total = listFunds.reduce((total, cur) => {
    return total + cur.value;
  }, 0);
  useEffect(() => {
    async function fetchListCustomers() {
      try {
        const response = await axiosPrivate.get(
          `reservation/calculate_deposit_cancel_reservation?deposit=${total}&number=${day}&reservationId=${reservation.reservation.reservationId}&checkFundBook=false`
        );
        setPrice(response.data.result);
      } catch (error) {
        console.log(error);
      }
    }
    fetchListCustomers();
  }, []);
  return (
    <Form method="PUT" onSubmit={props.onClose}>
      <Modal open={props.open} onClose={props.onClose} size="w-7/12 h-.5/6">
        <div className="p-2 w-full">
          <div className="mb-5">
            <h1 className="text-lg pb-5 font-bold">Huỷ đặt phòng</h1>
            <input
              type="hidden"
              name="isCancelReservation"
              defaultValue={true}
            />
            <input type="hidden" name="deposit" defaultValue={total} />
            <input type="hidden" name="number" defaultValue={day} />
            <input
              type="hidden"
              name="reservationId"
              defaultValue={reservation.reservation.reservationId}
            />
          </div>
          <div>Số tiền khách đặt cọc: {total.toLocaleString() + " VND"}</div>
          <div>Huỷ trước {day} ngày</div>
          <div>Số tiền trả khách: {price.toLocaleString() + " VND"}</div>
          <div>Bạn chắc chắn muốn huỷ đặt phòng?</div>
        </div>
      </Modal>
    </Form>
  );
}

export default CancelReservationModal;
