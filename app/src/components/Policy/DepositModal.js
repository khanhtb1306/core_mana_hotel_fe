import Modal from "../UI/Modal";
import { Form } from "react-router-dom";

function DepositModal(props) {
  const categories = props.categories;
  const deposits = props.deposits;
//   console.log(categories);
//   console.log(deposits);
  return (
    <Form method="put" onSubmit={props.onClose}>
      <Modal open={props.open} onClose={props.onClose} size="w-9/12 h-.5/6">
        <div className="p-2 w-full">
          <div className="mb-5">
            <h1 className="text-lg pb-5 font-bold">Thiết lập tiền cọc</h1>
            <input type="hidden" name="isDeposit" defaultValue={true} />
            <input
              type="hidden"
              name="policyId"
              defaultValue={deposits.Policy.policyId}
            />
            <input
              type="hidden"
              name="numberCate"
              defaultValue={categories.length}
            />
          </div>
          <table className="min-w-full border border-gray-300 divide-y divide-gray-300">
            <thead className="bg-blue-100">
              <tr>
                <td className="py-2 px-4 w-2/12">Mã hạng phòng</td>
                <td className="py-2 px-4 w-3/12">Tên hạng phòng</td>
                <td className="py-2 px-4 w-1/12">Loại giá</td>
                <td className="py-2 px-4 w-2/12">Mức giá</td>
                <td className="py-2 px-4 w-4/12">Giá tiền cọc</td>
              </tr>
            </thead>
            <tbody>
              {categories.map((category, index) => {
                const deposit = deposits.LIST_SETUP_DEPOSIT_DETAIL.find(
                  (details) =>
                    details.roomCategory.roomCategoryId ===
                    category.roomCategory.roomCategoryId
                );
                return (
                  <tr
                    key={index}
                    className="border border-gray-300 hover:bg-gray-100"
                  >
                    <td className="py-2 px-4">
                      <h2>{category.roomCategory.roomCategoryId}</h2>
                    </td>
                    <td className="py-2 px-4">
                      <div>{category.roomCategory.roomCategoryName}</div>
                    </td>
                    <td className="py-2 px-4">
                      <div className="pb-4">Giờ</div>
                      <div>Ngày</div>
                      <div className="pt-4">Đêm</div>
                    </td>
                    <td className="py-2 px-4">
                      <div className="pb-4">
                        {category.roomCategory.priceByHour.toLocaleString()}
                      </div>
                      <div>
                        {category.roomCategory.priceByDay.toLocaleString()}
                      </div>
                      <div className="pt-4">
                        {category.roomCategory.priceByNight.toLocaleString()}
                      </div>
                    </td>
                    <td className="py-2 px-4">
                      {deposit && (
                        <input
                          type="hidden"
                          name={`policyDetailId${index}`}
                          defaultValue={deposit.policyDetailId}
                        />
                      )}
                      <input
                        type="hidden"
                        name={`roomCategoryId${index}`}
                        value={category.roomCategory.roomCategoryId}
                      />
                      Cọc tối thiểu{" "}
                      <input
                        className="border-0 border-b border-gray-500 w-16 focus:border-b-2 focus:border-green-500 focus:ring-0"
                        type="number"
                        name={`policyValue${index}`}
                        defaultValue={deposit ? deposit.policyValue : 0}
                        min={0}
                        max={100}
                      />
                      % / tổng hoá đơn
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Modal>
    </Form>
  );
}

export default DepositModal;
