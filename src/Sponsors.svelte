<script type="ts">
    import { onMount } from "svelte";

    let spons: HTMLDivElement;
    onMount(() => {
        setTimeout(() => {
            let leftSpons = 0,
                direction = 1;

            setInterval(() => {
                leftSpons = spons.scrollLeft + direction;

                if (leftSpons < 0) direction = 1;
                if (leftSpons > spons.scrollWidth - spons.clientWidth) direction = -1;

                spons.scroll(leftSpons, 0);
            }, 100);
        }, 2000);
    });

    let innerWidth = 0;

    let isLive = innerWidth >= 746 && window.location.pathname == "/live";
</script>

<svelte:window bind:innerWidth />

<div id="sponsors" class={isLive ? "live" : ""} style="width: {innerWidth - (isLive ? 60 : 0)}px">
    <div bind:this={spons}>
        <img src="/organizers.png" alt="Organizatorzy" />
    </div>
</div>

<style lang="scss">
    #sponsors {
        margin-left: -30px;

        display: flex;
        justify-content: center;

        border-radius: 5px;

        background-color: white;

        > div {
            overflow-x: scroll;

            border-radius: 5px;
        }
    }

    .live {
        margin: 30px 30px 16px 0 !important;
    }
</style>
