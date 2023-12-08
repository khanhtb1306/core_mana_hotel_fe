import { Form } from "react-router-dom";
import { useEffect, useState } from "react";
import Modal from "./Modal";
import { axiosPrivate } from "../../utils/axiosConfig";
function CustomerGroupForm(props) {
    const [customerGroup, setCustomerGroup] = useState(null);
    useEffect(() => {
        async function fetchCategory() {
            if (props.customerGroupId !== null) {
                try {
                    const response = await axiosPrivate.get("customer/customerGroup/" + props.customerGroupId);
                    setCustomerGroup(response.data);
                } catch (error) {
                    console.log(error);
                }
            }

        }
        fetchCategory();
    }, []);
    return (
        customerGroup &&
        <Form method="post" onSubmit={props.onClose} encType="multipart/form-data">
            <Modal open={props.open} onClose={props.onClose} size="w-5/12 h-.5/6">
                <div className="p-2 w-full">
                    <h1 className="text-lg pb-10 font-bold">Chỉnh sửa nhóm khách hàng </h1>
                    <input type="hidden" name="isEditGroup" value={true} />
                    <input type="hidden" name="customerGroupId" value={customerGroup.customerGroupId} />

                    <table className="ml-auto mr-5 w-full">
                        <tbody>
                            <tr>
                                <td className="w-3/12">
                                    <h2>Tên nhóm khách</h2>
                                </td>
                                <td className="w-9/12">
                                    <input
                                        className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                                        type="text"
                                        name="groupCusName"
                                        defaultValue={customerGroup.customerGroupName ? customerGroup.customerGroupName : ""}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Modal>
        </Form>
    )
}
export default CustomerGroupForm;