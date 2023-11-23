import { useNavigation } from "react-router-dom";

function Modal({ open, onClose, size, button, x, children }) {
  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 flex justify-center items-center transition-colors overflow-auto z-10 ${
        open ? "visible bg-black/20" : "invisible"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white absolute top-24 rounded-xl shadow p-6 transition-all ${size} ${
          open ? "scale-100 opacity-100" : "scale-125 opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={() => {
            onClose();
          }}
          className={`absolute top-2 right-2 p-1 rounded-lg text-gray-400 bg-white hover:bg-gray-50 hover:text-gray-600 ${
            x && "hidden"
          }`}
        >
          <i className="fa-solid fa-x"></i>
        </button>
        {children}
        {!button && (
          <div className="flex pt-5">
            <div className="ml-auto">
              <button
                className="bg-green-500 mr-10 py-2 px-6 text-white rounded hover:bg-green-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang lưu..." : "Lưu"}
              </button>
              <button
                type="button"
                className="bg-gray-400 py-2 px-6 text-white rounded hover:bg-gray-500"
                onClick={() => {
                  onClose();
                }}
                disabled={isSubmitting}
              >
                Bỏ qua
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;
