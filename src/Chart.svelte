<script type="ts">
    import { Bar } from "svelte-chartjs";
    import ChartDataLabels from "chartjs-plugin-datalabels";

    import {
        Chart as ChartJS,
        Title,
        Tooltip,
        Legend,
        BarElement,
        CategoryScale,
        LinearScale,
    } from "chart.js";

    ChartJS.register(
        Title,
        Tooltip,
        Legend,
        BarElement,
        CategoryScale,
        LinearScale,
        ChartDataLabels
    );

    export let labels, value;

    let data = {
        labels,
        datasets: [
            {
                borderColor: "#2697D3",
                data: value,
                borderWidth: 3,
                fill: "#FFFFFF",
                backgroundColor: "rgba(38, 151, 211, 0.5)",
            },
        ],
    };

    const options = {
        responsive: true,
        scales: {
            x: {
                min: 0,
                max: 20,
                ticks: {
                    color: "white",
                },
                grid: {
                    color: "#FFFFFF00",
                },
            },
            y: {
                min: 0,
                max: 50,
                ticks: {
                    color: "white",
                },
                grid: {
                    color: "rgba(255, 255, 255, 0.4)",
                },
            },
        },
        maintainAspectRatio: false,
        animation: {
            duration: 5000,
        },
        plugins: {
            legend: {
                display: false,
            },
            datalabels: {
                anchor: "end",
                align: "top",
                formatter: Math.round,
                font: {
                    weight: "bold",
                    size: 20,
                },
                color: "white",
            },
        },
        ticks: {
            font: {
                size: 20,
            },
        },
    };
</script>

<div class="chart">
    <Bar {data} {options} />
</div>

<style lang="scss">
    .chart {
        height: 100%;
        width: 100%;

        display: flex;
        align-items: center;
        justify-content: center;

        border-radius: 3px;

        background-color: #183a68;
    }
</style>
