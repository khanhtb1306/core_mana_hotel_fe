function Modal({ open, onClose, reset, size, button, children }) {
  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 flex justify-center items-center transition-colors ${
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
          onClick={() => {
            onClose();
            reset();
          }}
          className="absolute top-2 right-2 p-1 rounded-lg text-gray-400 bg-white hover:bg-gray-50 hover:text-gray-600"
        >
          <i className="fa-solid fa-x"></i>
        </button>
        {children}
        {!button && (
          <div className="flex pt-5">
            <div className="ml-auto">
              <button className="bg-green-500 mr-10 py-2 px-6 text-white rounded">
                Lưu
              </button>
              <button
                className="bg-gray-400 py-2 px-6 text-white rounded"
                onClick={() => {
                  onClose();
                  reset();
                }}
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
