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

            // Create a new chart instance
            chartInstance.current = new Chart(ctx, {
                type: 'horizontalBar',
                data: data,
                options: {
                    scales: {
                        x: {
                            beginAtZero: true,
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
    }, [data]);

    return <canvas ref={chartRef} />;
};

export default HorizontalBarChart;
