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
                    cutout: '80%',
                    plugins: {
                        tooltip: {
                            enabled: false, // Disable the tooltip
                        },
                        legend: false,
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
