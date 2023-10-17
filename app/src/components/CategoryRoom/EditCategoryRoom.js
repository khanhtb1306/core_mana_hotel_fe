import { useEffect, useState } from "react";
import { axiosConfig } from "../../utils/axiosConfig";
import CategoryRoomForm from "../UI/CategoryRoomForm";

function EditCategoryRoom(props) {
  const [category, setCategory] = useState(null);
  useEffect(() => {
    async function fetchCategory() {
      try {
        const response = await axiosConfig.get(
          "room-class/" + props.cateRoomId
        );
        setCategory(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchCategory();
  }, []);

  return (
    category && (
      <CategoryRoomForm
        name="Chỉnh sửa hạng phòng"
        method="put"
        open={props.open}
        onClose={props.onClose}
        cateRoom={category.roomCategory}
      />
    )
  );
}

export default EditCategoryRoom;
