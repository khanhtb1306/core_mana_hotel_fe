import { useState } from "react";
import Modal from "../UI/Modal";
import { Form } from "react-router-dom";

function CancelRoomModal(props) {
  const cancelRoom = props.cancelRoom;
  //   console.log(cancelRoom);
  const listCancel = cancelRoom.LIST_CHANGE_CANCEL_ROOM_SURCHARGE_DETAIL.map(
    (room, index) => {
      return {
        key: index,
        policyDetailId: room.policyDetailId,
        limitValue: room.limitValue,
        policyValue: room.policyValue,
      };
    }
  );
  const [cancels, setCancels] = useState(listCancel);
  //   console.log(cancels);
  return (
    <Form method="put" onSubmit={props.onClose}>
      <Modal open={props.open} onClose={props.onClose} size="w-4/12 h-.5/6">
        <div className="p-2 w-full">
          <div className="mb-5">
            <h1 className="text-lg pb-5 font-bold">Thiết lập huỷ phòng</h1>
            <input type="hidden" name="isCancelRoom" defaultValue={true} />
            <input
              type="hidden"
              name="policyId"
              defaultValue={cancelRoom.Policy.policyId}
            />
            <input
              type="hidden"
              name="numberCancel"
              value={cancels.length}
              onChange={() => console.log()}
            />
          </div>
          <div className="text-right mt-2">
            <button
              type="button"
              className="px-2 py-1 rounded text-blue-500 border border-blue-500 hover:bg-blue-200"
              onClick={() => {
                setCancels([
                  ...cancels,
                  {
                    limitValue: 0,
                    policyValue: 0,
                  },
                ]);
              }}
            >
              <i className="fa-solid fa-plus mr-2"></i>
              Thêm mốc tiền cọc
            </button>
          </div>
          <div className="my-4">
            {cancels.map((cancel, index) => {
              return (
                <div key={index} className="flex">
                  <input
                    type="hidden"
                    name={`policyDetailId${index}`}
                    defaultValue={cancel.policyDetailId}
                  />
                  <div className="ml-10">
                    Trả trước{" "}
                    <input
                      className="border-0 border-b border-gray-500 w-16 focus:border-b-2 focus:border-green-500 focus:ring-0"
                      type="number"
                      name={`limitValue${index}`}
                      value={cancel.limitValue}
                      onChange={(e) => {
                        const updateCancels = cancels.map((cancel, i) => {
                          if (
                            index === i &&
                            !cancels.find(
                              (c) => c.limitValue === e.target.value
                            )
                          ) {
                            return {
                              ...cancel,
                              limitValue: e.target.value,
                            };
                          } else {
                            return {
                              ...cancel,
                            };
                          }
                        });
                        setCancels(updateCancels);
                      }}
                      min={1}
                    />{" "}
                    ngày thu{" "}
                    <input
                      className="border-0 border-b border-gray-500 w-16 focus:border-b-2 focus:border-green-500 focus:ring-0"
                      type="number"
                      name={`policyValue${index}`}
                      defaultValue={cancel.policyValue}
                      min={0}
                      max={100}
                    />{" "}
                    % tiền cọc
                  </div>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const updateCancels = cancels.filter(
                          (cancel, i) => index !== i
                        );
                        setCancels(updateCancels);
                      }}
                    >
                      <i className="fa-solid fa-x ml-4"></i>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Modal>
    </Form>
  );
}

export default CancelRoomModal;
