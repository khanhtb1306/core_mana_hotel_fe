import React, { useState, useEffect } from "react";
import { Form, redirect } from "react-router-dom";
import { axiosPrivate } from "../../utils/axiosConfig";
import Modal from "./Modal";
function EditArea(props) {
    const [floorData, setFloorData] = useState(null);


    useEffect(() => {
        const fetchFloorDetails = async () => {
            try {
                const response = await axiosPrivate.get(`Floor/${props.floorId}`);
                setFloorData(response.data);
            } catch (error) {
                console.error("Error fetching floor details:", error);
                // Handle errors or show messages
            }
        };

        fetchFloorDetails();
    }, [props.floorId]);

    // const handleFloorNameChange = (e) => {
    //     setEditedFloorName(e.target.value);
    // };

    // const showSweetAlert = (icon, title) => {
    //     Swal.fire({
    //         position: "center",
    //         icon: icon,
    //         title: title,
    //         showConfirmButton: false,
    //         timer: 1500,
    //     });
    // };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     try {
    //         const formData = new FormData();
    //         formData.append("floorName", editedFloorName);

    //         const response = await axiosPrivate.put(
    //             `Floor/${props.floorId}`,
    //             formData,
    //             {
    //                 headers: {
    //                     "Content-Type": "multipart/form-data",
    //                 },
    //             }
    //         );

    //         if (response.status === 200) {
    //             showSweetAlert("success", response.data);
    //         } else {
    //             showSweetAlert("error", response.data);
    //         }
    //         props.onClose();
    //         window.location.href = "/manager/roomManagement";
    //         return;
    //     } catch (error) {
    //         console.error("Error updating floor:", error);
    //     }
    // };

    // const handleDelete = async () => {
    //     // Display a confirmation dialog
    //     const confirmDelete = await Swal.fire({
    //         title: "Xác nhận xóa",
    //         text: "Bạn chắc chắn muốn xóa khu vực này?",
    //         icon: "warning",
    //         showCancelButton: true,
    //         confirmButtonColor: "#d33",
    //         cancelButtonColor: "#3085d6",
    //         confirmButtonText: "Xóa",
    //         cancelButtonText: "Hủy",
    //     });

    //     // If the user confirms the delete action
    //     if (confirmDelete.isConfirmed) {
    //         try {
    //             // Make the delete request
    //             const response = await axiosPrivate.delete(`Floor/${props.floorId}`);

    //             // Show success or error alert based on the response
    //             if (response.status === 200) {
    //                 showSweetAlert("success", response.data);
    //             } else {
    //                 showSweetAlert("error", response.data);
    //             }

    //             // Close the modal
    //             props.onClose();

    //             // Redirect to the desired location
    //             window.location.href = "/manager/roomManagement";
    //             return;
    //         } catch (error) {
    //             console.error("Error deleting floor:", error);
    //         }
    //     }
    // };

    return (
        floorData &&
        <Form method="put" onSubmit={props.onClose} encType="multipart/form-data">
            <Modal open={props.open} onClose={props.onClose} size="w-5/12 h-.5/6">
                <div className="p-2 w-full">
                    <h1 className="text-lg pb-10 font-bold">Chỉnh sửa khu vực</h1>
                    <table className="ml-auto mr-5 w-full">
                        <tbody>
                            <tr>
                                <input type="hidden" name="isEditFloor" value={true} />
                                <input
                                    className="hidden"
                                    type="text"
                                    name="floorId"
                                    value={floorData.floorId} />
                                <td className="w-3/12">
                                    <h2>Khu vực</h2>
                                </td>
                                <td className="w-9/12">
                                    <input
                                        className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                                        type="text"
                                        name="floorNameEdit"
                                        defaultValue={floorData.floorName}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Modal>
        </Form>
    );
    // <div className={`fixed inset-0 flex justify-center items-center transition-colors overflow-auto z-10 ${props.open ? "visible bg-black/20" : "invisible"}`}>
    //     <div className={`bg-white absolute top-24 rounded-xl shadow p-6 transition-all w-5/12 h-.5/6 ${props.open ? "scale-100 opacity-100" : "scale-125 opacity-0"}`}>
    //         <Form method="post" onSubmit={handleSubmit} encType="multipart/form-data">
    //             <div className="p-2 w-full">
    //                 <h1 className="text-lg pb-10 font-bold">Sửa khu vực</h1>
    //                 <table className="ml-auto mr-5 w-full">
    //                     <tbody>
    //                     <tr>
    //                         <td className="w-3/12">
    //                             <h2>Khu vực</h2>
    //                         </td>
    //                         <td className="w-9/12">
    //                             <input
    //                                 className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
    //                                 type="text"
    //                                 name="floorName"
    //                                 value={editedFloorName}
    //                                 onChange={handleFloorNameChange}
    //                             />
    //                         </td>
    //                     </tr>
    //                     </tbody>
    //                 </table>
    //             </div>

    //         </Form>
    //     </div>
    // </div>

}

export default EditArea;