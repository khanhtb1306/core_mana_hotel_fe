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
                    datasets: [dataset], // Use the generated dataset
                },
                options: {
                    scales: {
                        x: {
                            grid: {
                                display: false, // Hide x-axis grid lines
                            },
                        },
                        y: {
                            grid: {
                                display: true, // Hide y-axis grid lines
                            },
                            ticks: {
                                callback: value => `${value}%`,
                            },
                            max: 100,
                            min: 0,
                        },
                    },
                },
            });
        }
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [labels, dataset]);

    return <canvas ref={chartRef} style={{ width: '100%', height: '100px' }} />;
};

export default LineChart;
