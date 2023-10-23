import { useState } from "react";
import { Tooltip } from "react-tooltip";
import NewCustomer from "../Customer/NewCustomer";

function SearchCustomer(props) {
  const customers = props.customers;
  const [rows, setRows] = useState(customers);
  const [openSearchModal, setOpenSearchModal] = useState(false);
  const [openNewCustomerModal, setOpenNewCustomerModal] = useState(false);

  const handleValueChange = (e) => {
    const value = e.target.value;
    const newRows = customers.filter(
      (pro) =>
        pro.customerName.includes(value) || pro.customerId.includes(value)
    );
    setRows(newRows);
  };

  const handleFocus = () => {
    setOpenSearchModal(true);
  };

  const handleBlur = () => {
    setOpenSearchModal(false);
  };

  const handleAddCustomer = () => {
    setOpenNewCustomerModal(true);
  };

  return (
    <div className="relative w-3/12">
      <div className="w-full shadow-md rounded-lg inline-flex bg-white hover:border hover:border-green-500">
        <i className="pl-4 fa-solid fa-magnifying-glass my-auto"></i>
        <input
          className="rounded-lg border-0 w-full focus:ring-0"
          placeholder="Tên khách hàng"
          onChange={handleValueChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <button
          type="button"
          className="mr-4 my-auto rounded-full px-1 py-0.5 add-customer hover:bg-gray-300"
          onClick={handleAddCustomer}
        >
          <i className="fa-solid fa-circle-plus fa-lg"></i>
        </button>
      </div>
      {openSearchModal && (
        <div className="absolute bg-white rounded-lg max-h-96 w-full py-3 overflow-auto">
          {rows.length > 0 ? (
            rows.map((row, index) => (
              <div key={index} className="m-2 p-2 rounded-lg hover:bg-gray-300">
                <button type="button" className="w-full text-left">
                  <h2>{row.customerName}</h2>
                  <p className="text-sm text-gray-500">{row.customerId}</p>
                </button>
              </div>
            ))
          ) : (
            <div className="p-4">
              <p className="text-gray-500 text-center">
                Không tìm thấy khách hàng phù hợp
              </p>
            </div>
          )}
        </div>
      )}
      {openNewCustomerModal && (
        <NewCustomer
          open={openNewCustomerModal}
          onClose={() => setOpenNewCustomerModal(false)}
        />
      )}
      <Tooltip anchorSelect=".add-customer" place="right">
        Thêm khách hàng
      </Tooltip>
    </div>
  );
}

export default SearchCustomer;
