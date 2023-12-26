import Modal from "../UI/Modal";
import { useEffect, useState } from "react";
import { axiosPrivate } from "../../utils/axiosConfig";

function DetailsFundBook(props) {
    const [fundBook, setFundBook] = useState(null);

    useEffect(() => {
        async function fetchFundBooks() {
            try {
                let response = await axiosPrivate.get("fund-book/" + props.fundBookId);
                setFundBook(response.data.result);

            } catch (error) {
                console.log(error);
            }
        }
        fetchFundBooks();
    }, []);

    let formattedDate = null;
    let note = null;
    let name = null;
    if (fundBook) {
        const dateNow = new Date(fundBook.time);
        const year = dateNow.getFullYear();
        const month = String(dateNow.getMonth() + 1).padStart(2, "0");
        const day = String(dateNow.getDate()).padStart(2, "0");
        formattedDate = `${year}-${month}-${day}`;

        if (fundBook.type === "OTHER_EXPENSE" || fundBook.type === "EXPENSE") {
            name = "chi";
        }
        else {
            name = "thu";
        }

        if (props.fundBookId.substring(2, 4) === "DH") {
            note = "Phiếu " + name + " tự động được tạo gắn với hóa đơn " + props.fundBookId.substring(2, 10);
        }
        else if (props.fundBookId.substring(2, 4) === "HD") {
            note = "Phiếu " + name + " tự động được tạo gắn với hóa đơn " + props.fundBookId.substring(2, 10);
        }
        else {
            note = "Phiếu " + name + " tự động được tạo gắn với nhập hàng " + props.fundBookId.substring(2, 10);
        }

    }

    return (
        fundBook && (
            <Modal open={props.open}
                onClose={props.onClose}
                reset={props.onClose}
                button={true}
                size="w-8/12 h-6/6">
                <div className="col-span-2 basis-3/4">
                    <div className="col-md-12 ">
                        <div className="p-3 py-5 " >
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="text-left text-lg font-bold">
                                    {" "}
                                    <i className="bi bi-person-circle me-3"></i>Thông tin
                                </h4>
                            </div>
                            <div className="flex flex-row mb-3 ">
                                <div className="basis-1/2 flex flex-row  ">
                                    <div className="w-3/12 basis-1/4">
                                        <h2 className="mt-3">Số hiệu </h2>
                                    </div>
                                    <div className="w-9/12  basis-3/4">
                                        <div
                                            className="w-9/12 border-0 border-b border-gray-500  focus:border-b-2 focus:border-green-500 focus:ring-0">
                                            {fundBook.fundBookId ? fundBook.fundBookId : ""}
                                        </div>
                                    </div>
                                </div>
                                <div className="basis-1/2 flex flex-row  ">
                                    <div className="w-3/12 basis-1/4">
                                        <h2 className="mt-3">Ngày tạo</h2>
                                    </div>
                                    <div className="w-9/12  basis-3/4">
                                        <div
                                            className="w-9/12 border-0 border-b border-gray-500  focus:border-b-2 focus:border-green-500 focus:ring-0">
                                            {formattedDate ? formattedDate : ""}
                                        </div>

                                    </div>
                                </div>

                            </div>
                            <div className="flex flex-row mb-3 ">
                                <div className="basis-1/2 flex flex-row  ">
                                    <div className="w-3/12 basis-1/4">
                                        <h2 className="mt-3">Giá trị</h2>
                                    </div>
                                    <div className="w-9/12  basis-3/4">
                                        <div
                                            className="w-9/12 border-0 border-b border-gray-500  focus:border-b-2 focus:border-green-500 focus:ring-0">
                                            {fundBook.value ? fundBook.value.toLocaleString() + " VND " : ""}
                                        </div>

                                    </div>
                                </div>
                                <div className="basis-1/2 flex flex-row  ">
                                    <div className="w-3/12 basis-1/4">
                                        <h2 className="mt-3">Ghi chú</h2>
                                    </div>
                                    <div className="w-9/12  basis-3/4">
                                        <div
                                            className="w-9/12 border-0 border-b border-gray-500  focus:border-b-2 focus:border-green-500 focus:ring-0">
                                            {fundBook.note ? fundBook.note : ""}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-row mb-3 ">
                                <div className="basis-1/2 flex flex-row  ">
                                    <div className="w-3/12 basis-1/4">
                                        <h2 className="mt-3">Người nộp</h2>
                                    </div>
                                    <div className="w-9/12  basis-3/4">
                                        <div
                                            className="w-9/12 border-0 border-b border-gray-500  focus:border-b-2 focus:border-green-500 focus:ring-0">
                                            {fundBook.payerReceiver ? fundBook.payerReceiver : ""}
                                        </div>
                                    </div>
                                </div>
                                <div className="basis-1/2 flex flex-row  ">
                                    <div className="w-3/12 basis-1/4">
                                        <h2 className="mt-3">Hình thức</h2>
                                    </div>
                                    <div className="w-9/12  basis-3/4">
                                        <div
                                            className="w-9/12 border-0 border-b border-gray-500  focus:border-b-2 focus:border-green-500 focus:ring-0">
                                            {fundBook.paidMethod === "BANK" ? "Chuyển khoản" : "Tiền mặt"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-row mb-3 ">
                                <div className="basis-1/2 flex flex-row  ">
                                    <div className="w-3/12 basis-1/4">
                                        <h2 className="mt-3">Nhân viên</h2>
                                    </div>
                                    <div className="w-9/12  basis-3/4">
                                        <div
                                            className="w-9/12 border-0 border-b border-gray-500  focus:border-b-2 focus:border-green-500 focus:ring-0">
                                            {fundBook.staff}
                                        </div>
                                    </div>
                                </div>
                                <div className="basis-1/2 flex flex-row  ">
                                    <div className="w-3/12 basis-1/4">
                                        <h2 className="mt-3">Trạng thái</h2>
                                    </div>
                                    <div className="w-9/12  basis-3/4">
                                        <div
                                            className="w-9/12 border-0 border-b border-gray-500  focus:border-b-2 focus:border-green-500 focus:ring-0">
                                            {fundBook.status === "COMPLETE" ? "Hoàn tất" : "Hủy bỏ"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="italic">
                                {note}
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        )
    );
}

export default DetailsFundBook;