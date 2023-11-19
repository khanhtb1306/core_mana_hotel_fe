import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const PieChart = ({ percentage }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartRef && chartRef.current) {
            const ctx = chartRef.current.getContext('2d');

            // Destroy existing chart instance if it exists
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            // Calculate color based on percentage
            const dynamicColor = `rgb(${255 - percentage * 2.55}, ${percentage * 2.55}, 0)`;

            // Create a new pie chart instance
            chartInstance.current = new Chart(ctx, {
                type: 'pie',
                data: {
                    datasets: [
                        {
                            data: [percentage, 100 - percentage],
                            backgroundColor: [dynamicColor, '#dddddd'], // Use dynamicColor for the filled part
                            borderColor: '#ffffff',
                        },
                    ],
                },
                options: {
                    cutout: '70%', // Reduce the thickness of the chart to create a hole in the center
                    plugins: {
                        tooltip: false,
                        legend: false,
                    },
                    elements: {
                        center: {
                            text: `${percentage}%`, // Display the percentage value
                            color: '#ff0000', // Color of the percentage text
                            fontStyle: 'Arial', // Font family of the percentage text
                            sidePadding: 20, // Distance from the center hole to the percentage text
                            fontSize: '12px' // Thay đổi kích thước của nhãn phần trăm thành 12px

                        },
                    },
                },
            });
        }

        // Cleanup: Destroy chart when the component unmounts
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [percentage]);

    return <canvas ref={chartRef} />;
};
export default PieChart;
