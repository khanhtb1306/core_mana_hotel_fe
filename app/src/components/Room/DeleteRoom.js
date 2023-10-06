import Modal from "../UI/Modal";

function DeleteRoom(props) {

  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      reset={props.onClose}
      size="w-5/12 h-2/6"
    >
      <div className="p-2 w-full">
        <h1 className="text-lg pb-10 font-bold">Xoá phòng</h1>
          <div className="ml-auto mr-5 w-full">
            <p>Hệ thống sẽ <bold>xoá hoàn toàn</bold> danh sách phòng được chọn nhưng vẫn giữ nguyên thông tin phòng trong các giao dịch lịch sử nếu có</p>
            <p>Bạn có chắc chắn muốn xoá?</p>
          </div>
      </div>
    </Modal>
  );
}

export default DeleteRoom;
