import { useState } from "react";
import NewCustomer from "../Customer/NewCustomer";
import EditCustomerModal from "../Customer/EditMoreInfoCustomer";

function SearchCustomer(props) {
  const customers = props.customers;
  const activeCustomers = customers.filter(
    (cus) => cus.isCustomer && cus.status === "ACTIVE"
  );
  const [rows, setRows] = useState(activeCustomers);
  const [openSearchModal, setOpenSearchModal] = useState(false);
  const [openNewCustomerModal, setOpenNewCustomerModal] = useState(false);
  const [openEditCustomerModal, setOpenEditCustomerModal] = useState(false);
  const [customerId, setCustomerId] = useState(null);

  const handleValueChange = (e) => {
    const value = e.target.value;
    const newRows = activeCustomers.filter(
      (pro) =>
        pro.customerName.includes(value) || pro.customerId.includes(value)
    );
    setRows(newRows);
  };

  const handleFocus = () => {
    setOpenSearchModal(true);
  };

  const handleBlur = () => {
    if (customerId) {
      props.handleCustomerClick(customerId);
    }
    setCustomerId(null);
    setOpenSearchModal(false);
  };

  const handleAddCustomer = () => {
    setOpenNewCustomerModal(true);
  };

  const handleRemoveCustomer = () => {
    props.handleCustomerRemove();
  };

  return (
    <div className="relative w-3/12">
      <div className="w-full h-10 shadow-md rounded-lg inline-flex bg-white hover:border hover:border-green-500">
        {props.customer ? (
          <>
            <i className="mx-4 fa-regular fa-user my-auto"></i>
            <button
              type="button"
              className="my-auto text-green-500 text-bold hover:underline"
              onClick={() => {
                setOpenEditCustomerModal(true);
              }}
              disabled={props.disable}
            >
              {props.customer.customerName}
            </button>
            <button
              type="button"
              className="mr-4 ml-auto my-auto rounded-full px-2 py-0.5 remove-customer hover:bg-gray-300"
              onClick={handleRemoveCustomer}
              disabled={props.disable}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
      {openSearchModal && (
        <div className="absolute bg-white rounded-lg max-h-96 w-full py-3 overflow-auto z-10">
          {rows.length > 0 ? (
            rows.map((row, index) => (
              <div key={index} className="m-2 p-2 rounded-lg hover:bg-gray-300">
                <button
                  type="button"
                  className="w-full text-left"
                  onMouseOver={() => {
                    // console.log(row);
                    setCustomerId(row.customerId);
                  }}
                  onMouseLeave={() => {
                    setCustomerId(null);
                  }}
                >
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
      {openEditCustomerModal && (
        <EditCustomerModal
          open={openEditCustomerModal}
          onClose={() => setOpenEditCustomerModal(false)}
          customer={props.customer}
        />
      )}
    </div>
  );
}

export default SearchCustomer;
