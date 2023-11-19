import React, {useState} from 'react';
import LineChart from "../../components/Overview/LineChart";
import BarChart from "../../components/Overview/BarChart";
import HorizontalBarChart from "../../components/Overview/HorizontalBarChart";
import PieChart from "../../components/Overview/PieChart";


const OverviewPage = () => {

    const fakeData = [
        { name: 'Hoang Son', action: 'tạo hóa đơn', value: '11,999,000', time: '11 giờ tới' },
        { name: 'Hoàng Long', action: 'tạo hóa đơn', value: '14,375,000', time: '10 giờ tới' },
        { name: 'Hoang Son', action: 'tạo hóa đơn', value: '11,296,000', time: '9 giờ tới' },
        { name: 'Hoang Son', action: 'tạo hóa đơn', value: '121,200,000', time: '8 giờ tới' },
        { name: 'Hoang Son', action: 'tạo hóa đơn', value: '8,094,000', time: '7 giờ tới' },
        { name: 'Mai Hương', action: 'tạo hóa đơn', value: '105,515,000', time: '6 giờ tới' },
        { name: 'Mai Hương', action: 'tạo hóa đơn', value: '149,994,000', time: '5 giờ tới' },
        { name: 'Hoang Son', action: 'tạo hóa đơn', value: '42,195,000', time: '4 giờ tới' },
        { name: 'Hoang Son', action: 'tạo hóa đơn', value: '20,794,000', time: '3 giờ tới' },
        { name: 'Hoang Son', action: 'tạo hóa đơn', value: '118,000,000', time: '2 giờ tới' },
        { name: 'Mai Hương', action: 'tạo hóa đơn', value: '3,264,000', time: 'một giờ tới' },
        { name: 'Mai Hương', action: 'tạo hóa đơn', value: '63,295,000', time: '12 phút trước' },
        { name: 'Hoàng Long', action: 'tạo hóa đơn', value: '27,328,000', time: 'một giờ trước' },
        { name: 'Hoang Son', action: 'tạo hóa đơn', value: '23,750,000', time: '2 giờ trước' },
        { name: 'Hoang Son', action: 'tạo hóa đơn', value: '173,992,000', time: '3 giờ trước' },
        { name: 'Hoàng Long', action: 'nhập hàng', value: '2,260,000', time: '' },
    ];
    const labels = ["14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30"];
    const dataset = {
        label: 'Mana Hotel',
        data: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
    };


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
    const percentage = 75; // You can set the value as needed


    const [selectedValue, setSelectedValue] = useState('');
    const options = ['Hôm nay', 'Hôm qua', '7 ngày', 'Tháng này', 'Tháng trước'];

    const handleDropdownChange = (event) => {
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
            <div className="w-2/12 my-4 order-2 md:order-1">
                <div className="flex flex-col bg-white text-left px-4 py-2 rounded">
                    <div className="flex items-center mb-4">
                        <p className="text-lg">CÁC HOẠT ĐỘNG GẦN ĐÂY</p>
                    </div>
                    <div className="overflow-y-auto max-h-90 relative">
                        {fakeData.map((item, index) => (
                            <div key={index} className="mb-2 flex items-start">
                                {index > 0 && (
                                    <div className="border-r-2 h-4 absolute top-1/2 transform -translate-y-1/2 left-2 bg-black"></div>
                                )}
                                <div className="flex items-center mr-2">
                                    <i className={`fa-solid ${getIconForAction(item.action)} text-green-500 mr-2`}></i>
                                </div>
                                <div>
                                    <p className="text-sm">
                                        <span className="text-blue-500 font-bold">{item.name}</span>
                                        {' '}
                                        vừa
                                        {' '}
                                        <span className="text-blue-500 font-bold">{item.action}</span>
                                        {` với giá trị ${item.value}`}
                                    </p>
                                    <p className={`text-xs italic ${index === 2 ? 'text-green-500 font-bold' : 'text-gray-500 italic'}`}>
                                        {index === 2 ? 'một giờ trước' : item.time}
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
                                <div className="w-1/12 mr-4">
                                    <PieChart percentage={percentage} />
                                </div>
                                <div className="w-11/12">
                                    <label class="dash_title ng-binding" style={{ display: 'block' }}>
                                        <strong className="yesterday ng-binding">0</strong>
                                        /8 Phòng
                                    </label>
                                    <span className="yesterday ng-binding" style={{ display: 'block' }}>Đang có khách</span>
                                </div>
                            </div>
                            <div className="w-6/12 flex mr-4">
                                <div className="w-1/12 mr-4">
                                    <PieChart percentage={percentage} />
                                </div>
                                <div className="w-11/12">
                                    <label className="dash_title ng-binding" style={{ display: 'block' }}>
                                        <strong className="yesterday ng-binding">0</strong>
                                        /8 Phòng
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
                                <select value={selectedValue} onChange={handleDropdownChange}>
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
                                <select value={selectedValue} onChange={handleDropdownChange}>
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
                        {/*<div style={{ width: 'auto', height: '500px' }}>*/}
                        {/*    <HorizontalBarChart data={horizontalBarChartData} />*/}
                        {/*</div>*/}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OverviewPage;
