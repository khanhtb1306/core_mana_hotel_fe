import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';



const HorizontalBarChart = ({ data }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartRef && chartRef.current) {
            const ctx = chartRef.current.getContext('2d');

            // Destroy existing chart instance if it exists
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            // Create a new horizontal bar chart instance
            chartInstance.current = new Chart(ctx, {
                type: 'bar',
                data: data,
                options: {
                    indexAxis: 'y', // Set indexAxis to 'y' for horizontal bar chart
                    scales: {
                        x: {
                            beginAtZero: true,
                            grid: {
                                display: true, // Hide x-axis grid lines
                            },
                        },
                        y: {
                            beginAtZero: true,
                            grid: {
                                display: false, // Hide x-axis grid lines
                            },
                        }
                    }
                }
            });
        }

        // Cleanup: Destroy chart when the component unmounts
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [data]);

    return <canvas ref={chartRef} style={{ width: '100%', height: '100px' }} />;
};

export default HorizontalBarChart;
