import CategoryRoomForm from "../UI/CategoryRoomForm";

function NewCategoryRoom(props) {
  return (
    <CategoryRoomForm
      name="Thêm hạng phòng mới"
      method="post"
      open={props.open}
      onClose={props.onClose}
      cateRoom={{
        roomCategoryName: null,
        roomCapacity: null,
        roomArea: null,
        priceByHour: null,
        priceByDay: null,
        priceByNight: null,
        status: null,
        description: null,
        image: null,
      }}
    />
  );
}

export default NewCategoryRoom;
