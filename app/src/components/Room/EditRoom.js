import { useEffect, useState } from "react";
import { axiosConfig, axiosPrivate } from "../../utils/axiosConfig";
import RoomForm from "../UI/RoomForm";

function EditRoom(props) {
  const [room, setRoom] = useState(null);
  useEffect(() => {
    async function fetchRoom() {
      try {
        const response = await axiosPrivate.get(
          "room/" + props.roomId
        );
        setRoom(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchRoom();
  }, []);
  return (
    room && (
      <RoomForm
        name="Chỉnh sửa phòng"
        method="put"
        open={props.open}
        onClose={props.onClose}
        floors={props.floors}
        categories={props.categories}
        room={room}
      />
    )
  );
}

export default EditRoom;