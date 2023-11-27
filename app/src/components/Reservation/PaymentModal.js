import { Form } from "react-router-dom";
import Modal from "../UI/Modal";

function PaymentModal(props) {
  const reservation = props.reservation;
  console.log(reservation);
  return (
    <Form onSubmit={() => props.onClose()}>
      <div
        onClick={props.onClose}
        className={`fixed inset-0 flex justify-center items-center transition-colors overflow-auto z-10 ${
          props.open ? "visible bg-black/20" : "invisible"
        }`}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`bg-white absolute top-0 right-0 rounded-xl shadow p-6 transition-all w-8/12 h-full ${
            props.open ? "scale-100 opacity-100" : "scale-125 opacity-0"
          }`}
        >
          <button
            type="button"
            onClick={() => {
              props.onClose();
            }}
            className={`absolute top-2 right-2 p-1 rounded-lg text-gray-400 bg-white hover:bg-gray-50 hover:text-gray-600`}
          >
            <i className="fa-solid fa-x"></i>
          </button>
          <div className="p-2 w-full">
            <h1 className="text-lg pb-10 font-bold">
              Thanh toán{" "}
              {reservation.reservation.reservationId +
                " - " +
                reservation.reservation.customer.customerName}
            </h1>
            <div className="ml-auto w-full">123</div>
          </div>
          <div className="flex pt-5">
            <div className="mb-auto ml-auto">
              <button
                className="bg-white border border-green-500 text-green-500 mr-10 py-2 px-6 rounded hover:bg-green-200"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
}

export default PaymentModal;
