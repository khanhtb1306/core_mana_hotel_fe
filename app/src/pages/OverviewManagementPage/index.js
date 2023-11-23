import React, {useState} from 'react';
import LineChart from "../../components/Overview/LineChart";
import BarChart from "../../components/Overview/BarChart";
import HorizontalBarChart from "../../components/Overview/HorizontalBarChart";
import PieChart from "../../components/Overview/PieChart";
import {defer, redirect, useLoaderData} from "react-router-dom";
import {axiosPrivate} from "../../utils/axiosConfig";


const OverviewPage = () => {
    const {recentActivity} = useLoaderData();
    const {roomCapacityInfo} = useLoaderData();
    const {reportRoomCapacityCurrentMonth} = useLoaderData();

    const formatTime = (createTime) => {
        const currentTime = new Date();
        const activityTime = new Date(createTime);
        const timeDiff = currentTime - activityTime;
        const seconds = Math.floor(timeDiff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (seconds < 60) {
            return `${seconds} giây trước`;
        } else if (minutes < 60) {
            return `${minutes} phút trước`;
        } else if (hours < 24) {
            return `${hours} giờ trước`;
        } else {
            return `${days} ngày trước`;
        }
    };

    const formatValue = (value) => {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    console.log(reportRoomCapacityCurrentMonth);
    const labels = reportRoomCapacityCurrentMonth.daysOfMonth ? reportRoomCapacityCurrentMonth.daysOfMonth : [];
    console.log(labels);

    const barChartData = {
        labels: labels,
        datasets: [{
            label: 'Mana Hotel',
            data: [65, 59, 80, 81, 56, 55, 40],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(201, 203, 207, 0.2)'
            ],
            borderColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
                'rgb(201, 203, 207)'
            ],
            borderWidth: 1
        }]
    };

    const horizontalBarChartData = {
        labels: labels,
        datasets: [{
            label: 'Mana Hotel',
            data: [65, 59, 80, 81, 56, 55, 40],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(201, 203, 207, 0.2)'
            ],
            borderColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
                'rgb(201, 203, 207)'
            ],
            borderWidth: 1
        }]
    };


    const dataset = {
        label: 'Mana Hotel',
        data: reportRoomCapacityCurrentMonth.roomCapacityValues ? reportRoomCapacityCurrentMonth.roomCapacityValues : [],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
    };



    const [selectedValue1, setSelectedValue1] = useState('');
    const options = ['Hôm nay', 'Hôm qua', '7 ngày trước', 'Tháng này', 'Tháng trước'];

    const handleDropdownChange = (event, setSelectedValue) => {
        setSelectedValue(event.target.value);
    };
    const getIconForAction = (action) => {
        switch (action) {
            case 'tạo hóa đơn':
                return 'fa-solid fa-file-alt';
            case 'nhập hàng':
                return 'fa-solid fa-box';
            default:
                return 'fa-solid fa-question';
        }
    };
    return (
        <div className="flex m-4">
            <div className="w-2/12 my-4 order-2 md:order-1"  style={{width: '300px'}}>
                <div className="flex flex-col bg-white text-left px-4 py-2 rounded"  style={{width: '300px'}}>
                    <div className="flex items-center mb-4">
                        <p className="text-lg">CÁC HOẠT ĐỘNG GẦN ĐÂY</p>
                    </div>
                    <div className="overflow-y-auto max-h-90 relative">
                        {recentActivity.map((item) => (
                            <div key={item.recentActivityId} className="mb-2 flex items-start">
                                {item.recentActivityId > 0 && (
                                    <div className="border-r-2 h-4 absolute top-1/2 transform -translate-y-1/2 left-2 bg-black"></div>
                                )}
                                <div className="flex items-center mr-2">
                                    <i className={`fa-solid ${getIconForAction(item.action)} text-green-500 mr-2`}></i>
                                </div>
                                <div>
                                    <p className="text-sm">
                                        <span className="text-blue-500 font-bold">{item.staffName}</span>
                                        {' '}
                                        vừa
                                        {' '}
                                        <span className="text-blue-500 font-bold">{item.action}</span>
                                        {` với giá trị ${formatValue(item.value)} VND`}
                                    </p>
                                    <p className={`text-xs italic ${item === recentActivity[2] ? 'text-green-500 font-bold' : 'text-gray-500 italic'}`}>
                                        {item === recentActivity[2] ? 'một giờ trước' : formatTime(item.createTime)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end">
                        <i className="fa-solid fa-chevron-right"></i>
                    </div>
                </div>
            </div>
            <div className="w-10/12 my-4">
                <div>
                    <div className="bg-white p-4 mr-4 rounded">
                            <p className="text-lg">CÔNG SUẤT PHÒNG HIỆN TẠI</p>
                        <div className="flex">
                            <div className="w-6/12 flex border-r-2 border-solid border-gray-800 mr-4">
                                <div className="w-1/12 mr-4 relative" style={{width: '60px', height: '60px'}}>
                                    <PieChart percentage={roomCapacityInfo ? roomCapacityInfo.percentageRoomsInUse : 0} />
                                    <span style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        zIndex: 2,
                                    }}>{roomCapacityInfo ? `${roomCapacityInfo.percentageRoomsInUse}%` : '0%'}</span>
                                </div>

                                <div className="w-11/12">
                                    <label className="dash_title ng-binding" style={{ display: 'block' }}>
                                    <strong className="yesterday ng-binding">{roomCapacityInfo ? roomCapacityInfo.roomsInUse : 0}</strong>
                                        / {roomCapacityInfo ? roomCapacityInfo.totalRooms : 0} Phòng
                                    </label>
                                    <span className="yesterday ng-binding" style={{ display: 'block' }}>Đang có khách</span>
                                </div>
                            </div>
                            <div className="w-6/12 flex mr-4">
                                <div className="w-1/12 mr-4 relative" style={{width: '60px', height: '60px'}}>
                                    <PieChart percentage={roomCapacityInfo ? roomCapacityInfo.percentageEmptyRooms : 0} />
                                    <span style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        zIndex: 2,
                                    }}>{roomCapacityInfo ? `${roomCapacityInfo.percentageEmptyRooms}%` : '0%'}</span>
                                </div>

                                <div className="w-11/12">
                                    <label className="dash_title ng-binding" style={{ display: 'block' }}>
                                        <strong className="yesterday ng-binding">{roomCapacityInfo ? roomCapacityInfo.emptyRooms : 0}</strong>
                                        / {roomCapacityInfo ? roomCapacityInfo.totalRooms : 0} Phòng
                                    </label>
                                    <span className="yesterday ng-binding" style={{ display: 'block' }}>Đang trống</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 mr-4 my-4 rounded">
                        <div className="flex">
                            <div className="w-10/12">
                                <p className="text-lg">CÔNG SUẤT SỬ DỤNG PHÒNG HÔM NAY</p>
                            </div>
                            <div className="w-2/12">
                                <select value={selectedValue1} onChange={(event) => handleDropdownChange(event, setSelectedValue1)}>
                                    {options.map((option, index) => (
                                        <option key={index} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div style={{ width: '1000px', height: 'auto' }}>
                            <div>
                                <LineChart labels={labels} dataset={dataset} />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 mr-4 my-4 rounded">
                        <div className="flex">
                            <div className="w-10/12">
                                <p className="text-lg">DOANH THU THUẦN THÁNG NÀY  1,777,006,000</p>
                            </div>
                            <div className="w-2/12">
                                <select value={selectedValue1} onChange={(event) => handleDropdownChange(event, setSelectedValue1)}>
                                    {options.map((option, index) => (
                                        <option key={index} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div style={{ width: '1000px', height: 'auto' }}>
                            <div>
                                <BarChart data={barChartData} />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 mr-4 my-4 rounded">
                        <p className="text-lg">TOP 10 HẠNG PHÒNG 7 NGÀY QUA</p>
                        <div style={{ width: 'auto', height: '500px' }}>
                            <HorizontalBarChart data={horizontalBarChartData} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OverviewPage;


async function loadRoomCapacity() {
    try {
        const response = await axiosPrivate.get("overview/room_capacity");
        if (response.data.success) {
            return response.data.result;
        } else {
            return redirect("/login");
        }
    } catch (error) {
        console.error("Error loading room capacity:", error);
        return redirect("/error");
    }
}

async function loadRecentActivity() {
    const response = await axiosPrivate.get("overview/recent_activity");
    if (response.data.success) {
        return response.data.result;
    } else {
        return redirect("/login");
    }
}

async function loadReportRoomCapacityCurrentMonth() {
    try {
        const response = await axiosPrivate.get("overview/report_room_capacity_current_month");
        console.log("API Response:", response.data);
        if (response.data.success) {
            return response.data.result;
        } else {
            return redirect("/login");
        }
    } catch (error) {
        console.error("Error loading room capacity:", error);
        return redirect("/error");
    }
}


async function loadReportRoomCapacityLastMonth() {
    const response = await axiosPrivate.get("overview/report_room_capacity_last_month");
    if (response.data.success) {
        return response.data.result;
    } else {
        return redirect("/login");
    }
}



export async function loader() {
    return defer({
        recentActivity: await loadRecentActivity(),
        roomCapacityInfo: await loadRoomCapacity(),
        reportRoomCapacityCurrentMonth: await loadReportRoomCapacityCurrentMonth(),
        reportRoomCapacityLastMonth: await loadReportRoomCapacityLastMonth(),

    });
}
