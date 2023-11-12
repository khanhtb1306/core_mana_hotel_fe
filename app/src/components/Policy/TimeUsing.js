function TimeUsing() {
  return (
    <div className="ml-4 my-4">
      <div className="bg-white py-4 px-8 flex">
        <div>
          <h2 className="font-medium text-lg">Thiết lập thời gian sử dụng</h2>
          <p className="text-sm text-gray-500">
            Quy định thời gian nhận - trả phòng
          </p>
        </div>
        <div className="ml-auto my-auto rounded-lg border border-blue-500 text-blue-500 hover:text-white hover:bg-blue-500">
          <button type="button" className="py-1 px-6 ">
            Chi tiết
          </button>
        </div>
      </div>
    </div>
  );
}

export default TimeUsing;
