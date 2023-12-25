import { Form } from "react-router-dom";
import Modal from "./Modal";
function TransactionForm({ open, onClose, transaction, name }) {
    let formattedDate = null;
    const dateNow = new Date(transaction.Invoice.createdDate);
    const year = dateNow.getFullYear();
    const month = String(dateNow.getMonth() + 1).padStart(2, "0");
    const day = String(dateNow.getDate()).padStart(2, "0");
    formattedDate = `${year}-${month}-${day}`;
    return (
        <div >
            <Modal open={open} onClose={onClose} reset={onClose} button={true} size="w-8/12 h-.5/6">
                <div className="mx-10 my-3" >
                    <div>
                        <h1 className="text-lg pb-5 font-bold">{name}</h1>
                    </div>
                    <div className="">
                        <div className="flex flex-row mb-3 border-0  ">
                            <div className="basis-1/2 flex flex-row  ">
                                <div className="w-3/12 basis-1/4">
                                    <h2 className="">Mã hóa đơn: </h2>
                                </div>
                                <div className="w-9/12  basis-3/4 border-0 border-b border-gray-500">
                                    <div className="w-9/12 ">
                                        {transaction.Invoice.invoiceId}
                                    </div>
                                </div>
                            </div>
                            <div className="basis-1/2 flex flex-row ms-5 ">
                                <div className="w-3/12 basis-1/4">
                                    <h2 className="">Thời gian: </h2>
                                </div>
                                <div className="w-9/12  basis-3/4 border-0 border-b border-gray-500">
                                    <div className="w-9/12 ">
                                        {formattedDate}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row mb-3 ">
                            <div className="basis-1/2 flex flex-row  ">
                                <div className="w-3/12 basis-1/4">
                                    <h2 className="">Khách hàng: </h2>
                                </div>
                                <div className="w-9/12  basis-3/4 border-0 border-b border-gray-500">
                                    <div className="w-9/12 ">
                                        {transaction.Invoice.customer.customerName}
                                    </div>
                                </div>
                            </div>
                            <div className="basis-1/2 flex flex-row ms-5  ">
                                <div className="w-3/12 basis-1/4">
                                    <h2 className="">Trạng thái: </h2>
                                </div>
                                <div className="w-9/12  basis-3/4 border-0 border-b border-gray-500" >
                                    <div className="w-9/12 ">
                                        {transaction.Invoice.status}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row mb-3">
                            <div className="basis-1/2 flex flex-row  ">
                                <div className="w-3/12 basis-1/4">
                                    <h2 className="">Nhân viên: </h2>
                                </div>
                                <div className="w-9/12  basis-3/4 border-0 border-b border-gray-500">
                                    <div className="w-9/12 ">
                                        {transaction.Invoice.staff.staffName}
                                    </div>
                                </div>
                            </div>
                            <div className="basis-1/2 flex flex-row ms-5 ">
                                <div className="w-3/12 basis-1/4">
                                    <h2 className="">Ghi chú: </h2>
                                </div>
                                <div className="w-9/12  basis-3/4 border-b border-gray-500">
                                    <div className="w-9/12">
                                        {transaction.Invoice.note}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row mb-3 ">
                            <div className="basis-1/2 flex flex-row   ">
                                <div className="w-3/12 basis-1/4">
                                    <h2 className="">Giá khác: </h2>
                                </div>
                                <div className="w-9/12  basis-3/4 border-0 border-b border-gray-500">
                                    <div className="w-9/12 ">
                                        {transaction.Invoice.priceOther}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="border border-slate-300 ">Thông tin phòng</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border border-slate-300 ">
                                    {transaction.ListReservationOfInvoice.map((data, index) => (
                                        <>
                                            <div className="bg-sky-300 flex justify-between mt-3" key={index}>
                                                <div className="mr-4">{index + 1}.</div>
                                                <div className="">Mã phòng: {data.reservationDetail.room.roomId}</div>
                                                <div className="">Tên phòng: {data.reservationDetail.room.roomName}</div>
                                                <div className="">Hạng phòng: {data.reservationDetail.room.roomCategory.roomCategoryName}</div>
                                                <div className=""></div>
                                                <div className="">Tổng tiền: {data.reservationDetail.price.toLocaleString()+ " VND "}</div>

                                            </div>
                                            {
                                                data.ListOrder.map((data, index) => (
                                                    <div key={index} className=" flex flex-row border border-slate-500 ">
                                                        <div className="basis-1/4">
                                                            <div>Mã hóa đơn: {data.order.orderId}</div>
                                                            <div>Tình trạng: {data.order.status === "CONFIRMED"
                                                                ? "Xác nhận"
                                                                : data.order.status === "PAID"
                                                                    ? "Đã trả"
                                                                    : "Chưa xác nhận"}</div>
                                                        </div>
                                                        <div className="basis-3/4">
                                                            <div className=" flex flex-row " key={index}>
                                                                <div className="basis-1/5 font-bold">Mã hàng</div>
                                                                <div className="basis-1/5 font-bold">Tên hàng</div>
                                                                <div className="basis-1/5 font-bold">Số lượng</div>
                                                                <div className="basis-1/5 font-bold">Đơn giá</div>
                                                                <div className="basis-1/5 font-bold">Thành tiền</div>
                                                            </div>
                                                            {
                                                                data.OrderDetail.map((data, index) => (
                                                                    <div className=" flex flex-row" key={index}>
                                                                        <div className="basis-1/5">{data.OrderDetail.goods.goodsId}</div>
                                                                        <div className="basis-1/5">{data.OrderDetail.goods.goodsName}</div>
                                                                        <div className="basis-1/5">{data.OrderDetail.quantity}</div>
                                                                        <div className="basis-1/5">{data.OrderDetail.price.toLocaleString()+ " VND "}</div>
                                                                        <div className="basis-1/5">{data.OrderDetail.price * data.OrderDetail.quantity}</div>
                                                                    </div>

                                                                ))
                                                            }

                                                        </div>
                                                    </div>
                                                ))
                                            }
                                            {
                                                    <div  className=" mt-3 border border-slate-500 ">
                                                        <div className="">
                                                            <div className=" flex flex-row ">
                                                                <div className="basis-1/4 font-bold">Mã chính sách</div>
                                                                <div className="basis-1/4 font-bold">Tên chính sách</div>
                                                                <div className="basis-1/4 font-bold">Loại chính sách</div>
                                                                <div className="basis-1/4 font-bold">Thành tiền</div>
                                                            </div>
                                                            {
                                                                data.ListControlPolicy.map((data, index) => (
                                                                    <div className=" flex flex-row" key={index}>
                                                                        <div className="basis-1/4">{data.policy.policyId}</div>
                                                                        <div className="basis-1/4">{data.policy.note}</div>
                                                                        <div className="basis-1/4">{data.typeValue}</div>
                                                                        <div className="basis-1/4">{data.value.toLocaleString()+ " VND "}</div>
                                                                    </div>

                                                                ))
                                                            }

                                                        </div>
                                                    </div>
                                            }
                                        </>

                                    ))}
                                </td>
                            </tr>


                        </tbody>
                    </table>
                </div>
            </Modal>
        </div>


    );
}

export default TransactionForm;