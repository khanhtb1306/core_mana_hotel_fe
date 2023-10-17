import { useState } from "react";
import Image from "../UI/ImageInput";
import Modal from "../UI/Modal";
import { axiosConfig } from "../../utils/axiosConfig";
import { Form, redirect } from "react-router-dom";
import CategoryRoomForm from "../UI/CategoryRoomForm";

function NewCategoryRoom(props) {
  return (
      <CategoryRoomForm method="post" open={props.open} onClose={props.onClose} />
  );
}

export default NewCategoryRoom;