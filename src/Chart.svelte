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

    export let labels: string[], value: string[];

    let reverseAxis = false;

    let data: any;
    $: data = {
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

    let options: any;
    $: options = {
        indexAxis: reverseAxis ? "y" : "x",
        responsive: true,
        scales: {
            [reverseAxis ? "y" : "x"]: {
                ticks: {
                    minTicksLimit: 30,
                    maxRotation: 0,
                    color: "white",
                    font: {
                        size: 25,
                    },
                },
                grid: {
                    color: "#FFFFFF00",
                },
            },
            [reverseAxis ? "x" : "y"]: {
                ticks: {
                    color: "white",
                    font: {
                        size: 25,
                    },
                    callback: function (value: any) {
                        if (value % 1 === 0) return value;
                    },
                },
                grid: {
                    color: "rgba(255, 255, 255, 0.4)",
                },
            },
        },
        maintainAspectRatio: false,
        animation: {
            duration: 0,
        },
        plugins: {
            legend: {
                display: false,
            },
            datalabels: {
                display: false,
            },
        },
    };

    let innerWidth;
    $: reverseAxis = innerWidth < 746;

    $: options.scales[reverseAxis ? "x" : "y"].ticks.font.size =
        innerWidth > 1152 ? (innerWidth * 25) / 1920 : 15;
    $: options.scales[reverseAxis ? "y" : "x"].ticks.font.size = reverseAxis
        ? 15
        : innerWidth > 768
        ? (innerWidth * 22.5) / 1920
        : 9;
</script>

<svelte:window bind:innerWidth />

<div class="chart">
    <Bar {data} {options} />
</div>

<style lang="scss">
    .chart {
        height: 95%;
        width: 95%;

        border-radius: 3px;

        background-color: #183a68;
    }
</style>
