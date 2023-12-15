import { Form } from "react-router-dom";
import Modal from "./Modal";
import ImageInput from "../UI/ImageInput";
import { useState } from "react";
import DepartmentForm from "../UI/DepartmentForm";
function FundBookForm({ name, open, onClose, method, fundBook, isIncome }) {

    let formattedDate = null;
    if (fundBook.time) {
        const dateNow = new Date(fundBook.time);
        const year = dateNow.getFullYear();
        const month = String(dateNow.getMonth() + 1).padStart(2, "0");
        const day = String(dateNow.getDate()).padStart(2, "0");
        formattedDate = `${year}-${month}-${day}`;
    }
    return (

        <Form method={method} onSubmit={onClose} encType="multipart/form-data">
            <Modal open={open} onClose={onClose} size="w-8/12 h-.5/6 ">
                <div className="col-span-2 basis-3/4">
                    <div className="col-md-12 ">
                        <div className="p-3 py-5 grid justify-items-stretch " >
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="text-left text-lg font-bold">
                                    {" "}
                                    <i className="bi bi-person-circle me-3">
                                    </i>{isIncome === true ? "Lập phiếu thu" : "Lập phiếu chi"}
                                </h4>
                            </div>
                            {fundBook.fundBookId !== null && (
                                <div className=" flex flex-row mb-3 ">
                                    <div  className="basis-1/2 flex flex-row  ">
                                        <div className="w-3/12 basis-1/4">
                                            <h2 className="mt-3">Số hiệu </h2>
                                        </div>
                                        <div className="w-9/12  basis-3/4">
                                            <input
                                                readOnly
                                                className="w-9/12 border-0 border-b border-gray-500  focus:border-b-2 focus:border-green-500 focus:ring-0"
                                                type="text"
                                                name="fundBookId"
                                                defaultValue={fundBook.fundBookId ? fundBook.fundBookId : ""}
                                            />
                                        </div>
                                    </div>

                                    <div className="basis-1/2 flex flex-row  ">
                                        <div className="w-3/12 basis-1/4">
                                            <h2 className="mt-3">Ngày tạo</h2>
                                        </div>
                                        <div className="w-9/12  basis-3/4">
                                        <input
                                            readOnly
                                            className="w-9/12 border-0 border-b border-gray-500  focus:border-b-2 focus:border-green-500 focus:ring-0"
                                            name="time"
                                            defaultValue= {formattedDate ? formattedDate : ""}
                                        />
                                        </div>
                                    </div>


                                </div>
                            )}
                            <div className="flex flex-row mb-3 ">
                                <div className="basis-1/2 flex flex-row  ">
                                    <div className="w-3/12 basis-1/4">
                                        <h2 className="mt-3">Hình thức</h2>
                                    </div>
                                    <div className="w-9/12  basis-3/4">
                                        <select
                                            className="w-9/12 border-0 border-b border-gray-500 focus:border-b-2 focus:border-green-500 focus:ring-0"
                                            name="paidMethod"
                                            required
                                        >
                                            <option value="CASH" selected={fundBook.paidMethod === "CASH"}>Tiền mặt</option>
                                            <option value="BANK" selected={fundBook.paidMethod === "BANK"}>Chuyển khoản</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="basis-1/2 flex flex-row  ">
                                    <div className="w-3/12 basis-1/4">
                                        <h2 className="mt-3">Giá trị</h2>
                                    </div>
                                    <div className="w-9/12  basis-3/4">
                                        <input
                                            className="w-9/12 border-0 border-b border-gray-500 focus:border-b-2 focus:border-green-500 focus:ring-0"
                                            type="number"
                                            name="value"
                                            minLength="1"
                                            maxLength="255"
                                            defaultValue={fundBook.value ? fundBook.value : ""}
                                            required
                                        />
                                    </div>
                                </div>


                            </div>
                            <div className="flex flex-row mb-3 ">

                            </div>
                            <div className="flex flex-row mb-3 ">
                                <div className="basis-1/2 flex flex-row  ">
                                    <div className="w-3/12 basis-1/4">
                                        <h2 className="mt-3">Người nộp</h2>
                                    </div>
                                    <div className="w-9/12  basis-3/4">
                                        <input
                                            className="w-9/12 border-0 border-b border-gray-500 focus:border-b-2 focus:border-green-500 focus:ring-0"
                                            type="text"
                                            name="payerReceiver"
                                            minLength="1"
                                            maxLength="255"
                                            defaultValue={fundBook.payerReceiver ? fundBook.payerReceiver : ""}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="basis-1/2 flex flex-row  ">
                                    <div className="w-3/12 basis-1/4">
                                        <h2 className="mt-3">Ghi chú</h2>
                                    </div>
                                    <div className="w-9/12  basis-3/4">
                                        <input
                                            className="w-9/12 border-0 border-b border-gray-500  focus:border-b-2 focus:border-green-500 focus:ring-0"
                                            type="text"
                                            name="note"
                                            minLength="1"
                                            maxLength="255"
                                            defaultValue={fundBook.note ? fundBook.note : ""}
                                            required
                                        />
                                    </div>
                                </div>


                            </div>
                            {
                                method !== "put" && (
                                    <div className=" flex flex-row mb-2 ">
                                        <div className="w-3/12 basis-1/4">
                                            <h2 className="mt-3">Loại thu </h2>
                                        </div>
                                        <div className="w-9/12  basis-3/4">
                                            <select
                                                className="w-9/12 border-0 border-b border-gray-500 focus:border-b-2 focus:border-green-500 focus:ring-0"
                                                name="type"
                                                required
                                            >
                                                {isIncome === true && (
                                                    <>
                                                        <option value="INCOME">Thu nhập</option>
                                                        <option value="OTHER_INCOME">Thu nhập khác</option>
                                                    </>
                                                )}
                                                {isIncome === false && (
                                                    <>
                                                        <option value="EXPENSE">Chi phí</option>
                                                        <option value="OTHER_EXPENSE">Chi phí khác</option>
                                                    </>
                                                )}

                                            </select>
                                        </div>
                                    </div>
                                )}

                        </div>
                    </div>
                </div>
                {/* //---------------------------------------------------------------------------------------------------- */}
            </Modal>
        </Form>


    );
}

export default FundBookForm;