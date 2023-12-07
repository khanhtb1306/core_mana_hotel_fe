import React, { useState, useEffect } from "react";
import { Form } from "react-router-dom";
import { axiosPrivate } from "../../utils/axiosConfig";

function EditArea(props) {
    const [editedFloorName, setEditedFloorName] = useState("");

    useEffect(() => {
        const fetchFloorDetails = async () => {
            try {
                const response = await axiosPrivate.get(`Floor/${props.floorId}`);
                const floorData = response.data;
                setEditedFloorName(floorData.floorName);
            } catch (error) {
                console.error("Error fetching floor details:", error);
                // Handle errors or show messages
            }
        };

        fetchFloorDetails();
    }, [props.floorId]);

    const handleFloorNameChange = (e) => {
        setEditedFloorName(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("floorName", editedFloorName);

            const response = await axiosPrivate.put(
                `Floor/${props.floorId}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            console.log(response);

            props.onClose(); // Close the modal or perform other actions after successful update
        } catch (error) {
            console.error("Error updating floor:", error);
            // Handle errors, show messages, etc.
        }
    };

    const handleDelete = async () => {
        try {
            // Add logic to delete the floor based on props.floorId
            const response = await axiosPrivate.delete(`Floor/${props.floorId}`);
            console.log(response);

            props.onClose(); // Close the modal or perform other actions after successful delete
        } catch (error) {
            console.error("Error deleting floor:", error);
            // Handle errors, show messages, etc.
        }
    };

    return (
        <div className={`fixed inset-0 flex justify-center items-center transition-colors overflow-auto z-10 ${props.open ? "visible bg-black/20" : "invisible"}`}>
            <div className={`bg-white absolute top-24 rounded-xl shadow p-6 transition-all w-5/12 h-.5/6 ${props.open ? "scale-100 opacity-100" : "scale-125 opacity-0"}`}>
                <Form method="post" onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="p-2 w-full">
                        <h1 className="text-lg pb-10 font-bold">Sửa khu vực</h1>
                        <table className="ml-auto mr-5 w-full">
                            <tbody>
                            <tr>
                                <td className="w-3/12">
                                    <h2>Khu vực</h2>
                                </td>
                                <td className="w-9/12">
                                    <input
                                        className="border-0 border-b border-gray-500 w-full focus:border-b-2 focus:border-green-500 focus:ring-0"
                                        type="text"
                                        name="floorName"
                                        value={editedFloorName}
                                        onChange={handleFloorNameChange}
                                    />
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="flex pt-5">
                        <div className="ml-auto">
                            <button type="submit" className="bg-green-500 mr-2 py-2 px-6 text-white rounded hover:bg-green-600">
                                Lưu
                            </button>
                            <button type="button" onClick={handleDelete} className="bg-red-500 mr-2 py-2 px-6 text-white rounded hover:bg-red-600">
                                Xóa
                            </button>
                            <button type="button" onClick={props.onClose} className="bg-gray-400 py-2 px-6 text-white rounded hover:bg-gray-500">
                                Bỏ qua
                            </button>
                        </div>
                    </div>
                </Form>
            </div>
        </div>
    );
}

export default EditArea;
