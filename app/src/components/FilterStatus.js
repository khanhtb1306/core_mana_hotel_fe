function FilterStatus() {
  return (
    <>
      <div className="p-5 shadow-md mb-10 bg-white">
        <h3 className="pb-5">Trạng thái</h3>
        <input type="radio" id="active" name="status" className="p-2 mr-2" />
        <label htmlFor="active">Đang hoạt động</label>
        <br />
        <input type="radio" id="inative" name="status" className="p-2 mr-2" />
        <label htmlFor="inative">Ngừng hoạt động</label>
        <br />
        <input type="radio" id="all" name="status" className="p-2 mr-2" />
        <label htmlFor="all">Tất cả</label>
        <br />
      </div>
    </>
  );
}

export default FilterStatus;
