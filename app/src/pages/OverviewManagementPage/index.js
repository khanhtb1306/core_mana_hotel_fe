import React, {useEffect, useState} from 'react';
import LineChart from "../../components/Overview/LineChart";
import BarChart from "../../components/Overview/BarChart";
import HorizontalBarChart from "../../components/Overview/HorizontalBarChart";
import PieChart from "../../components/Overview/PieChart";
import { defer, redirect, useLoaderData } from "react-router-dom";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { axiosPrivate } from "../../utils/axiosConfig";
import { DatePicker } from "@mui/x-date-pickers";
import lineChart from "../../components/Overview/LineChart";

const OverviewPage = () => {
  const { recentActivity } = useLoaderData();
  const { roomCapacityInfo } = useLoaderData();

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


  const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const generateRandomColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      colors.push(generateRandomColor());
    }
    return colors;
  };


  //
  // const horizontalBarChartData = {
  //     labels: labels,
  //     datasets: [{
  //         label: 'Mana Hotel',
  //         data: [65, 59, 80, 81, 56, 55, 40],
  //         backgroundColor: [
  //             'rgba(255, 99, 132, 0.2)',
  //             'rgba(255, 159, 64, 0.2)',
  //             'rgba(255, 205, 86, 0.2)',
  //             'rgba(75, 192, 192, 0.2)',
  //             'rgba(54, 162, 235, 0.2)',
  //             'rgba(153, 102, 255, 0.2)',
  //             'rgba(201, 203, 207, 0.2)'
  //         ],
  //         borderColor: [
  //             'rgb(255, 99, 132)',
  //             'rgb(255, 159, 64)',
  //             'rgb(255, 205, 86)',
  //             'rgb(75, 192, 192)',
  //             'rgb(54, 162, 235)',
  //             'rgb(153, 102, 255)',
  //             'rgb(201, 203, 207)'
  //         ],
  //         borderWidth: 1
  //     }]
  // };
  const [viewByMonth, setViewByMonth] = useState(null);
  const [viewMonthOrDay, setViewMonthOrDay] = useState(null);
  const [viewDayOfWeek, setViewDayOfWeek] = useState(null);


  const [selectedValue2, setSelectedValue2] = useState('ngay');
  const handleChartTypeChange = (value) => { setSelectedValue2(value);};

  const [selectedValue1, setSelectedValue1] = useState('1');
  const [month, setMonth] = useState(dayjs());
  const [year, setYear] = useState(dayjs());
  const [reportRoomCapacity, setReportRoomCapacity] = useState(null);
  const options = [
    { value: 1, name: "Theo ngày trong tháng" },
    { value: 2, name: "Theo tháng trong năm" },
    { value: 3, name: "Theo từng năm" }
  ];

  useEffect(() => {
    async function fetchListInvoices() {
      try {
        if (selectedValue1 === "1") {
          // Gọi api month
          if (selectedValue2 === 'ngay') {
            const response = await axiosPrivate.get(
                "/overview/report_room_capacity_by_month?date=" + month.format('YYYY/MM/DD').toString()
            );
            setViewMonthOrDay("Theo Ngày");
            setViewDayOfWeek("Theo Thứ");
            setViewByMonth('THEO NGÀY TRONG THÁNG')
            setReportRoomCapacity(response.data.result);
          } else if (selectedValue2 === 'thu') {
            const response = await axiosPrivate.get("/overview/report_room_capacity_with_day_of_week_by_month?date="
                + month.format('YYYY/MM/DD').toString());
            setViewMonthOrDay("Theo Ngày");
            setViewDayOfWeek("Theo Thứ");
            setViewByMonth('THEO THỨ TRONG THÁNG')
            setReportRoomCapacity(response.data.result);
          }
        } else if (selectedValue1 === "2") {
          setViewByMonth('THEO NĂM')
          // Gọi api year
          if (selectedValue2 === 'ngay') {
            const response = await axiosPrivate.get(
                "/overview/report_room_capacity_by_year?year=" + year.year()
            );
            setViewMonthOrDay("Theo Tháng");
            setViewDayOfWeek("Theo Thứ");
            setViewByMonth('THEO THÁNG TRONG NĂM')
            setReportRoomCapacity(response.data.result);
          } else if (selectedValue2 === 'thu') {
            const response = await axiosPrivate.get(
                "/overview/report_room_capacity_with_day_of_week_by_year?date="
                + year.format('YYYY/MM/DD').toString());
            setViewMonthOrDay("Theo Tháng");
            setViewDayOfWeek("Theo Thứ");
            setViewByMonth('THEO THỨ TRONG NĂM')
            setReportRoomCapacity(response.data.result);
          }
        }else if(selectedValue1 === "3"){
          const response = await axiosPrivate.get(
              "overview/report_room_capacity_by_many_year?year=" + year.year()
          );
          setViewMonthOrDay("");
          setViewDayOfWeek("");
          setReportRoomCapacity(response.data.result);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchListInvoices();
  }, [month, year, selectedValue1, selectedValue2]);


  const lineChartData = reportRoomCapacity ? {
    labels: reportRoomCapacity && reportRoomCapacity.label,
    datasets: [{
    label: "Công suất",
    data: reportRoomCapacity.data,
    fill: false,
    borderColor: "rgb(75, 192, 192)",
    tension: 0.1
    }]
  } : {};

  //barchart
  const [viewByMonthBarChart, setViewByMonthBarChart] = useState(null);
  const [selectedValueBarChart2, setSelectedValueBarChart2] = useState('ngay');
  const [viewMonthOrDayBarChart, setViewMonthOrDayBarChart] = useState(null);
  const [viewDayOfWeekBarChart, setViewDayOfWeekBarChart] = useState(null);
  const handleBarChartTypeChange = (value) => { setSelectedValueBarChart2(value);};
  const [selectedValueBarChart1, setSelectedValueBarChart1] = useState('1');
  const [monthBarChart, setMonthBarChart] = useState(dayjs());
  const [yearBarChart, setYearBarChart] = useState(dayjs());
  const [reportRoomCapacityBarChart, setReportRoomCapacityBarChart] = useState(null);
  const barChartOptions = [
    { value: 1, name: "Theo ngày trong tháng" },
    { value: 2, name: "Theo tháng trong năm" },
    { value: 3, name: "Theo từng năm" }
  ];
  useEffect(() => {
    async function fetchListBarChartInvoices() {
      try {
        if (selectedValueBarChart1 === "1") {
          // Gọi api month
          if (selectedValueBarChart2 === 'ngay') {
            const response = await axiosPrivate.get(
                "/overview/report_revenue_each_day_by_month?date=" + monthBarChart.format('YYYY/MM/DD').toString()
            );
            setReportRoomCapacityBarChart(response.data.result);
            let sum = 0;
            for (let i = 0; i < response.data.result.data.length; i++) {
              sum += response.data.result.data[i];
            }
            setViewByMonthBarChart('THEO THÁNG ' + sum.toLocaleString() + ' VND');
            setViewMonthOrDay("Theo Ngày");
            setViewDayOfWeek("Theo Thứ");
          } else if (selectedValueBarChart2 === 'thu') {
            const response = await axiosPrivate.get("/overview/report_revenue_day_of_week_by_month?date="
                + monthBarChart.format('YYYY/MM/DD').toString());
            setReportRoomCapacityBarChart(response.data.result);
            let sum = 0;
            for (let i = 0; i < response.data.result.data.length; i++) {
              sum += response.data.result.data[i];
            }
            setViewByMonthBarChart('THEO THÁNG ' + sum.toLocaleString() + ' VND');
            setViewMonthOrDay("Theo Ngày");
            setViewDayOfWeek("Theo Thứ");
          }
        } else if (selectedValueBarChart1 === "2") {
          setViewByMonthBarChart('THEO NĂM')
          // Gọi api year
          if (selectedValueBarChart2 === 'ngay') {
            const response = await axiosPrivate.get(
                "/overview/report_revenue_month_by_year?year=" + yearBarChart.year()
            );
            setReportRoomCapacityBarChart(response.data.result);
            let sum = 0;
            for (let i = 0; i < response.data.result.data.length; i++) {
              sum += response.data.result.data[i];
            }
            setViewByMonthBarChart('THEO NĂM ' + sum.toLocaleString() + ' VND');
            setViewMonthOrDay("Theo Tháng");
            setViewDayOfWeek("Theo Thứ");
          } else if (selectedValueBarChart2 === 'thu') {
            const response = await axiosPrivate.get(
                "/overview/report_revenue_day_of_week_by_year?date="
                + yearBarChart.format('YYYY/MM/DD').toString());
            setReportRoomCapacityBarChart(response.data.result);
            let sum = 0;
            for (let i = 0; i < response.data.result.data.length; i++) {
              sum += response.data.result.data[i];
            }
            setViewByMonthBarChart('THEO THÁNG ' + sum.toLocaleString() + ' VND');
            setViewMonthOrDay("Theo Tháng");
            setViewDayOfWeek("Theo Thứ");
          }
        } else if (selectedValueBarChart1 === "3"){
          const response = await axiosPrivate.get(
              "/overview/report_revenue_by_many_years?startYear=" + yearBarChart.year());
          setReportRoomCapacityBarChart(response.data.result);
          setViewByMonthBarChart('THEO THÁNG CÁC NĂM ');
          setViewMonthOrDay("");
          setViewDayOfWeek("");
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchListBarChartInvoices();
  }, [monthBarChart, yearBarChart, selectedValueBarChart1, selectedValueBarChart2]);

  const barChartData = reportRoomCapacityBarChart ? {
    labels: reportRoomCapacityBarChart.label,
    datasets: [{
      label: 'Doanh thu',
      data: reportRoomCapacityBarChart.data,
      backgroundColor: generateRandomColors(reportRoomCapacityBarChart.data.length).map(color => `${color}1A`), // Adding alpha for transparency
      borderColor: generateRandomColors(reportRoomCapacityBarChart.data.length),
      borderWidth: 1
    }]
  }: {};

  const handleDropdownChange = (event) => {
    setSelectedValue1(event.target.value);
  };
  const handleDropdownChangeBarChart = (event) => {
    setSelectedValueBarChart1(event.target.value);
  };
  const getIconForAction = (action) => {
    switch (action) {
      case "tạo hóa đơn":
        return "fa-solid fa-file-alt";
      case "nhập hàng":
        return "fa-solid fa-box";
      case "thực hiện kiểm kho":
        return "fa-solid fa-box";
      default:
        return "fa-solid fa-question";
    }
  };
  return (
    <div className="flex m-4">
      <div
        className="w-2/12 my-4 order-2 md:order-1"
        style={{ width: "300px" }}
      >
        <div
          className="flex flex-col bg-white text-left px-4 py-2 rounded"
          style={{ width: "300px" }}
        >
          <div className="flex items-center mb-4">
            <p className="text-lg">CÁC HOẠT ĐỘNG GẦN ĐÂY</p>
          </div>
          <div className="overflow-y-auto max-h-90 relative">
            {recentActivity.map((item) => (
              <div
                key={item.recentActivityId}
                className="mb-2 flex items-start"
              >
                {item.recentActivityId > 0 && (
                  <div className="border-r-2 h-4 absolute top-1/2 transform -translate-y-1/2 left-2 bg-black"></div>
                )}
                <div className="flex items-center mr-2">
                  <i
                    className={`fa-solid ${getIconForAction(
                      item.action
                    )} text-green-500 mr-2`}
                  ></i>
                </div>
                <div>
                  <p className="text-sm">
                    <span className="text-blue-500 font-bold">
                      {item.staffName}
                    </span>{" "}
                    vừa{" "}
                    <span className="text-blue-500 font-bold">
                      {item.action}
                    </span>
                    {item.value !== 0 &&
                      ` với giá trị ${formatValue(item.value)} VND`}
                  </p>
                  <p className={`text-xs italic text-gray-500 italic`}>
                    {formatTime(item.createTime)}
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
                <div
                  className="w-1/12 mr-4 relative"
                  style={{ width: "60px", height: "60px" }}
                >
                  <PieChart
                    percentage={
                      roomCapacityInfo
                        ? roomCapacityInfo.percentageRoomsInUse.toFixed(2)
                        : 0
                    }
                  />
                  <span
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      zIndex: 2,
                      fontSize: roomCapacityInfo
                        ? roomCapacityInfo.percentageRoomsInUse < 10
                          ? "100%"
                          : "80%"
                        : "100%",
                    }}
                  >
                    {roomCapacityInfo
                      ? `${roomCapacityInfo.percentageRoomsInUse.toFixed(2)}%`
                      : "0%"}
                  </span>
                </div>

                <div className="w-11/12">
                  <label
                    className="dash_title ng-binding"
                    style={{ display: "block" }}
                  >
                    <strong className="yesterday ng-binding">
                      {roomCapacityInfo ? roomCapacityInfo.roomsInUse : 0}
                    </strong>
                    / {roomCapacityInfo ? roomCapacityInfo.totalRooms : 0} Phòng
                  </label>
                  <span
                    className="yesterday ng-binding"
                    style={{ display: "block" }}
                  >
                    Đang có khách
                  </span>
                </div>
              </div>
              <div className="w-6/12 flex mr-4">
                <div
                  className="w-1/12 mr-4 relative"
                  style={{ width: "60px", height: "60px" }}
                >
                  <PieChart
                    percentage={
                      roomCapacityInfo
                        ? roomCapacityInfo.percentageEmptyRooms.toFixed(2)
                        : 0
                    }
                  />
                  <span
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      zIndex: 2,
                      fontSize: roomCapacityInfo
                        ? roomCapacityInfo.percentageEmptyRooms < 10
                          ? "100%"
                          : "80%"
                        : "100%",
                    }}
                  >
                    {roomCapacityInfo
                      ? `${roomCapacityInfo.percentageEmptyRooms.toFixed(2)}%`
                      : "0%"}
                  </span>
                </div>

                <div className="w-11/12">
                  <label
                    className="dash_title ng-binding"
                    style={{ display: "block" }}
                  >
                    <strong className="yesterday ng-binding">
                      {roomCapacityInfo ? roomCapacityInfo.emptyRooms : 0}
                    </strong>
                    / {roomCapacityInfo ? roomCapacityInfo.totalRooms : 0} Phòng
                  </label>
                  <span
                    className="yesterday ng-binding"
                    style={{ display: "block" }}
                  >
                    Đang trống
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 mr-4 my-4 rounded">
            <div className="flex">
              <div className="w-8/12">
                <p className="text-lg">CÔNG SUẤT SỬ DỤNG PHÒNG {viewByMonth} </p>
              </div>
              <div className="w-4/12 flex">
                <div className="w-6/12">
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale="vi-VN"
                  >
                    {selectedValue1 === "1" ? (
                      <DatePicker
                        sx={{ ".MuiInputBase-input": { padding: 1, width: 100 } }}
                        value={month}
                        onChange={(e) => {
                          setMonth(e);
                        }}
                        format="MMM YYYY"
                        views={["month", "year"]}
                      />
                    ) : selectedValue1 === "2" ?(
                      <DatePicker
                        sx={{ ".MuiInputBase-input": { padding: 1, width: 100 } }}
                        value={year}
                        onChange={(e) => {
                          setYear(e);
                        }}
                        format="YYYY"
                        views={["year"]}
                      />
                    ):(
                        <DatePicker
                            sx={{ ".MuiInputBase-input": { padding: 1, width: 100 } }}
                            value={year}
                            onChange={(e) => {
                              setYear(e);
                            }}
                            format="YYYY"
                            views={["year"]}
                        />
                    )}
                  </LocalizationProvider>
                </div>
                  <div className="w-6/12">
                    <select
                      value={selectedValue1}
                      onChange={(event) => handleDropdownChange(event)}
                    >
                      {options.map((option, index) => (
                        <option key={index} value={option.value}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </div>
              </div>
            </div>
            <div>
              <div>
                <ul className="flex chart-type-options">
                  <li  onClick={() => handleChartTypeChange('ngay')}
                      style={{
                        cursor: 'pointer',
                        textDecoration:
                            selectedValue2 === 'ngay' ? 'underline solid blue' : 'none',
                      }}>
                    {viewMonthOrDay}
                  </li>
                  <span style={{ margin: '0 10px' }}></span>
                  <li onClick={() => handleChartTypeChange('thu')}
                      style={{
                        cursor: 'pointer',
                        textDecoration:
                            selectedValue2 === 'thu' ? 'underline solid blue' : 'none',
                      }}>
                    {viewDayOfWeek}
                  </li>
                </ul>
              </div>
              <div>
                    <LineChart data={lineChartData} />
              </div>
            </div>
          </div>
          <div className="bg-white p-4 mr-4 my-4 rounded">
            <div className="flex">
              <div className="w-8/12">
                <p className="text-lg">
                  DOANH THU THEO {viewByMonthBarChart}
                </p>
              </div>
              <div className="w-4/12 flex">
                <div className="w-6/12">
                  <LocalizationProvider
                      dateAdapter={AdapterDayjs}
                      adapterLocale="vi-VN"
                  >
                    {selectedValueBarChart1 === "1" ? (
                        <DatePicker
                            sx={{ ".MuiInputBase-input": { padding: 1, width: 100 } }}
                            value={monthBarChart}
                            onChange={(e) => {
                              setMonthBarChart(e);
                            }}
                            format="MMM YYYY"
                            views={["month", "year"]}
                        />
                    ) : selectedValueBarChart1 === '2' ?(
                        <DatePicker
                            sx={{ ".MuiInputBase-input": { padding: 1, width: 100 } }}
                            value={yearBarChart}
                            onChange={(e) => {
                              setYearBarChart(e);
                            }}
                            format="YYYY"
                            views={["year"]}
                        />
                    ): (
                        <DatePicker
                            sx={{ ".MuiInputBase-input": { padding: 1, width: 100 } }}
                            value={yearBarChart}
                            onChange={(e) => {
                                setYearBarChart(e)
                            }}
                            format="YYYY"
                            views={['year']}
                            openTo="year"
                        />
                    )}
                  </LocalizationProvider>
                </div>
                <div className="w-6/12">
                  <select
                      value={selectedValueBarChart1}
                      onChange={(event) => handleDropdownChangeBarChart(event)}
                  >
                    {barChartOptions.map((option, index) => (
                        <option key={index} value={option.value}>
                          {option.name}
                        </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div>
              <div>
                <ul className="flex chart-type-options">
                  <li  onClick={() => handleBarChartTypeChange('ngay')}
                       style={{
                         cursor: 'pointer',
                         textDecoration:
                             selectedValueBarChart2 === 'ngay' ? 'underline solid blue' : 'none',
                       }}>
                    {viewMonthOrDayBarChart}
                  </li>
                  <span style={{ margin: '0 10px' }}></span>
                  <li onClick={() => handleBarChartTypeChange('thu')}
                      style={{
                        cursor: 'pointer',
                        textDecoration:
                            selectedValueBarChart2 === 'thu' ? 'underline solid blue' : 'none',
                      }}>
                    {viewDayOfWeekBarChart}
                  </li>
                </ul>
              </div>
              <div>
                <BarChart data={barChartData} />
              </div>
            </div>
          </div>
          <div className="bg-white p-4 mr-4 my-4 rounded">
            <p className="text-lg">TOP 10 HẠNG PHÒNG 7 NGÀY QUA</p>
            <div style={{ width: "auto", height: "500px" }}>
              {/*<HorizontalBarChart data={horizontalBarChartData} />*/}
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

// async function loadReportRoomCapacityCurrentMonth() {
//   try {
//     const response = await axiosPrivate.get(
//       "overview/report_room_capacity_by_month?month=11"
//     );
//     if (response.data.success) {
//       return response.data.result;
//     } else {
//       return redirect("/login");
//     }
//   } catch (error) {
//     return redirect("/error");
//   }
// }

export async function loader() {
  return defer({
    recentActivity: await loadRecentActivity(),
    roomCapacityInfo: await loadRoomCapacity(),
    // reportRoomCapacityCurrentMonth: await loadReportRoomCapacityCurrentMonth(),
  });
}
