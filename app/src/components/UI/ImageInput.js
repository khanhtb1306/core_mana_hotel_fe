import { useState } from "react";

function Image(props) {
  const [selectedImage, setSelectedImage] = useState(null);
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file === undefined) {
      setSelectedImage("");
    } else {
      setSelectedImage(URL.createObjectURL(file));
    }
  };
  return (
    <div className="m-4">
      <div className="flex items-center justify-center w-full">
        <div className="relative w-32 h-32 border-2 border-gray-300 border-dashed hover:bg-gray-100 hover:border-gray-300">
          {selectedImage ? (
            <img
              className="w-full h-full object-cover"
              src={selectedImage}
              alt="Selected"
            />
          ) : props.src ? (
            <img
              className="w-full h-full object-cover"
              src={props.src}
              alt="Preview"
            />
          ) : (
            <div className="flex flex-col items-center justify-center pt-7">
              <i className="fa-solid fa-mountain-sun"></i>
              <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                Thêm ảnh
              </p>
            </div>
          )}
          <input
            type="file"
            className="opacity-0 absolute top-0 left-0 w-full h-full cursor-pointer"
            accept="image/*"
            name={props.name}
            onChange={(e) => {
              handleImageUpload(e);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Image;
