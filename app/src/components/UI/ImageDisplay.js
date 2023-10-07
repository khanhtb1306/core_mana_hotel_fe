import bedroom1 from "../../assets/images/bedroom.png";
import bedroom2 from "../../assets/images/background-login.jpg";
import { useState } from "react";
import { randomNumberBetween } from "@mui/x-data-grid/utils/utils";

function ImageDisplay(props) {
  const DUMMY_IMAGES = [bedroom1, bedroom2, bedroom1, bedroom2, bedroom1];
  const [imageDisplay, setImageDisplay] = useState(bedroom1);

  const handleImageDiplay = (src) => {
    setImageDisplay(src);
  };

  const images = DUMMY_IMAGES.map((img) => (
    <img
      key={randomNumberBetween(1, 5)}
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
