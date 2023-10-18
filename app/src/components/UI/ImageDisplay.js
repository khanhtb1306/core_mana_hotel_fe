import bedroom1 from "../../assets/images/bedroom.png";
import bedroom2 from "../../assets/images/background-login.jpg";
import { useState } from "react";

function ImageDisplay(props) {
  const DUMMY_IMAGES = [props.src, bedroom2, bedroom1];
  const [imageDisplay, setImageDisplay] = useState(props.src);

  const handleImageDiplay = (src) => {
    setImageDisplay(src);
  };
  
  let keyCounter = 0;
  const images = DUMMY_IMAGES.map((img) => (
    <img
      key={keyCounter++}
      className="m-2 rounded"
      src={img}
      onClick={() => handleImageDiplay(img)}
    />
  ));
  return (
    <div className="flex h-80">
      <img className="w-9/12 p-2 rounded-xl" src={imageDisplay} />
      <div className="w-3/12 p-2">{images}</div>
    </div>
  );
}

export default ImageDisplay;
