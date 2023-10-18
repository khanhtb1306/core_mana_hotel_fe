import bedroom1 from "../../assets/images/bedroom.png";
import bedroom2 from "../../assets/images/background-login.jpg";
import { useState } from "react";

function ImageDisplay(props) {
  const images = [];
  if (props.image1) {
    images.push(props.image1);
  }
  if (props.image2) {
    images.push(props.image2);
  }
  if (props.image3) {
    images.push(props.image3);
  }

  let keyCounter = 0;
  let image = null;
  if (images.length > 0) {
    console.log(images);
    image = images.map((img) => {
      if (img !== null) {
        return (
          <img
            key={keyCounter++}
            className="m-2 rounded"
            src={img}
            onClick={() => handleImageDiplay(img)}
          />
        );
      }
    });
  }
  const [imageDisplay, setImageDisplay] = useState(images[0]);

  const handleImageDiplay = (src) => {
    setImageDisplay(src);
  };

  return (
    <div className="flex h-80">
      {image === null ? (
        <div className="flex flex-col items-center justify-center border w-60 pt-7">
          <i className="fa-solid fa-mountain-sun"></i>
        </div>
      ) : (
        <>
          <img className="w-9/12 p-2 rounded-xl" src={imageDisplay} />
          <div className="w-3/12 p-2">{image}</div>
        </>
      )}
    </div>
  );
}

export default ImageDisplay;
