import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const BarChart = ({ data }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartRef && chartRef.current) {
            const ctx = chartRef.current.getContext('2d');

            // Destroy existing chart instance if it exists
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            // Create a new bar chart instance
            chartInstance.current = new Chart(ctx, {
                type: 'bar',
                data: data,
                options: {
                    indexAxis: 'x', // Set indexAxis to 'y' for horizontal bar chart
                    scales: {
                        x: {
                            beginAtZero: true,
                            grid: {
                                display: false, // Hide x-axis grid lines
                            },
                        },
                        y: {
                            beginAtZero: true,
                            grid: {
                                display: true, // Hide x-axis grid lines
                            },
                            ticks: {
                                callback: value => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value),
                            },
                            // max: 10000000,
                            min: 0,
                        }
                    }
                }
            });
        }

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [data]);

    return <canvas ref={chartRef} style={{ width: '100%', height: '100px' }} />;
};

export default BarChart;
