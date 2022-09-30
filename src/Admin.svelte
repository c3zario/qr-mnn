<script type="ts">
    import Chart from "./Chart.svelte";

    let labels = [];
    let value = [];

    let qty = "20";

    async function GetPoints() {
        const response = await fetch("/results", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });

        let res = await response.json();
        let results = res[0];
        let userNames = res[1];

        const sorted = Object.entries(results)
            .sort(([, a]: any, [, b]: any) => a - b)
            .reduce(
                (r, [k, v]) => ({
                    ...r,
                    [k]: v,
                }),
                {}
            );

        Object.entries(sorted)
            .reverse()
            .slice(0, parseInt(qty))
            .forEach((sort) => {
                labels.push(userNames[sort[0]]);
                value.push(sort[1]);
            });

        labels = labels;
    }
    GetPoints();

    function Slice() {
        labels = [];
        value = [];

        GetPoints();
    }
</script>

<div id="admin">
    {#if labels[0]}
        <div>
            <Chart {labels} {value} />
        </div>
    {/if}

    <div id="qty">
        <input type="number" on:change={Slice} bind:value={qty} />
    </div>
</div>

<style lang="scss">
    #admin {
        height: 100%;

        display: flex;
        align-items: center;
        justify-content: center;

        > div {
            height: 70%;
            width: 90%;
        }

        #qty {
            position: fixed;
            top: 20px;
            left: 20px;

            input {
                border: 0;
                width: 40px;

                border-radius: 3px;

                text-align: center;

                font-size: 25px;

                color: #183a68;
            }

            input:focus {
                outline: none;
            }
        }
    }
</style>
