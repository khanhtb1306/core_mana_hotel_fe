import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

const LineChart = ({ labels, dataset }) => {
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
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [dataset],
                },
            });
        }

        // Cleanup: Destroy chart when the component unmounts
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [labels, dataset]);

    return <canvas ref={chartRef} />;
};

export default LineChart;
