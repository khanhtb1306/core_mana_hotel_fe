import Modal from "../UI/Modal";
import { useState } from "react";
import { Form } from "react-router-dom";

function TimeUsingModal(props) {
  return (
    <Form method="post" onSubmit={props.onClose}>
      <Modal open={props.open} onClose={props.onClose} size="w-6/12 h-.5/6">
        <div className="p-2 w-full">
          <div className="mb-5">
            <h1 className="text-lg pb-5 font-bold">
              Thiết lập thời gian sử dụng
            </h1>
          </div>
          <div className="mb-5">
            <h2 className="text-lg font-medium">Theo giờ</h2>
            <div className="flex">
              <div className="w-1/2">Tính thêm 1 giờ nếu sử dụng quá</div>
              <div className="w-1/2">123</div>
            </div>
          </div>
          <div className="mb-5">
            <h2 className="text-lg font-medium">Theo đêm</h2>
            <div className="flex">
              <div className="w-1/2">Giá nhận - trả quy định</div>
              <div className="w-1/2 flex">
                <div className="w-5/12">1</div>
                <div className="w-2/12">đến</div>
                <div className="w-5/12">2</div>
              </div>
            </div>
          </div>
          <div className="mb-5">
            <h2 className="text-lg font-medium">Theo ngày</h2>
            <div className="flex mb-2">
              <div className="w-1/2">Giá nhận - trả quy định</div>
              <div className="w-1/2 flex">
                <div className="w-5/12">1</div>
                <div className="w-2/12">đến</div>
                <div className="w-5/12">2</div>
              </div>
            </div>
            <div className="flex">
              <div className="w-1/2">Tính thêm 1 ngày khi</div>
              <div className="w-1/2 flex">
                <div className="w-3/4">1</div>
                <div className="w-1/4">2</div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </Form>
  );
}

export default TimeUsingModal;
