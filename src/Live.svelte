<script lang="ts">
    import List from "./List.svelte";
    import Chart from "./Chart.svelte";

    let places = [],
        labels = [],
        value = [];
    function getStats() {
        fetch("/getStats", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(async (response) => {
            [places, [labels, value]] = await response.json();

            console.log(labels, value);
        });
    }

    getStats();
    setInterval(getStats, 5000);

    let innerWidth = 0;
</script>

<svelte:window bind:innerWidth />

<div id={innerWidth < 746 ? "mobile_live" : "live"}>
    <List {places} />

    <div
        class="chart"
        style={innerWidth < 746 ? "width:" + innerWidth + "px; margin-left: -28px" : ""}
    >
        <Chart {labels} {value} />
    </div>
</div>

<style lang="scss">
    #live {
        display: flex;

        > div {
            height: 100%;
        }

        .chart {
            flex: 1;

            display: flex;
            align-items: center;
            justify-content: center;
        }
    }

    #mobile_live {
        display: flex;
        flex-flow: column;

        .chart {
            height: 800px;

            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
</style>
