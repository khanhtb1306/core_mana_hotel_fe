import { useState } from "react";

function ImageDisplay(props) {
  return (
    <div className="flex h-80">
      {props.image1 === null ? (
        <div className="flex flex-col items-center justify-center border w-60 pt-7">
          <i className="fa-solid fa-mountain-sun"></i>
        </div>
      ) : (
        <>
          <img
            className="p-2 rounded-xl object-cover"
            src={props.image1}
          />
        </>
      )}
    </div>
  );
}

export default ImageDisplay;
