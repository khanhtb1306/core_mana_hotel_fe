import RoomForm from "../UI/RoomForm";

function NewRoom(props) {
  return (
    <RoomForm
      name="Thêm phòng mới"
      method="post"
      open={props.open}
      onClose={props.onClose}
      floors={props.floors}
      categories={props.categories}
      room={{
        roomName: null,
        roomCategory: null,
        floor: null,
        status: null,
        note: null,
        image: null,
      }}
      rooms={props.rooms}
    />
  );
}

export default NewRoom;
