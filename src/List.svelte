<script lang="ts">
    export let places;

    let innerHeight = 0,
        innerWidth = 0;
</script>

<svelte:window bind:innerHeight bind:innerWidth />

<div
    id="list"
    style="height: {innerHeight - 157}px; font-size: {innerWidth > 1152
        ? (innerWidth * 25) / 1920
        : 15}px"
>
    <div>
        Ranking <div />
    </div>

    <table>
        <thead>
            <tr>
                <th />
                <th>Imię</th>
                <th>Kody</th>
            </tr>
        </thead>

        <tbody>
            {#each places as place, key}
                <tr>
                    <td>{key + 1}</td>
                    <td>{place[1]}</td>
                    <td>{place[0]}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<style lang="scss">
    #list {
        overflow: hidden;
        overflow-y: scroll;

        display: flex;
        flex-flow: column;
        align-items: center;

        color: white;

        > div {
            width: 100%;

            > div {
                height: 2px;
                width: 100%;

                margin-bottom: 10px;

                border-radius: 50px;
                background-color: white;
            }
        }

        table {
            width: 100%;

            th {
                text-align: left;
            }

            th,
            td {
                padding-left: 10px;
                padding-right: 10px;

                &:nth-child(3) {
                    text-align: end;
                }
            }

            td {
                &:nth-child(1) {
                    color: rgba(255, 255, 255, 0.75);
                }
            }
        }
    }

    @media (max-width: 746px) {
        #list {
            margin-bottom: 20px;

            overflow-y: auto;
        }
    }
</style>
