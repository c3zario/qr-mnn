<script type="ts">
    import { onMount } from "svelte";

    onMount(() => {
        setTimeout(() => {
            let spons = document.getElementById("spons");
            let maxSpons = spons.scrollWidth - spons.clientWidth;

            let leftSpons = 0;
            let direction = 1;
            setInterval(() => {
                leftSpons = spons.scrollLeft + direction;

                if (leftSpons < 0) direction = 1;
                if (leftSpons > maxSpons) direction = -1;

                spons.scroll(leftSpons, 0);
            }, 100);
        }, 2000);

        setTimeout(() => {
            let part = document.getElementById("part");
            let maxPart = part.scrollWidth - part.clientWidth;

            let leftPart = 0;
            let direction = 1;
            setInterval(() => {
                leftPart = part.scrollLeft + direction;

                if (leftPart < 0) direction = 1;
                if (leftPart > maxPart) direction = -1;

                part.scroll(leftPart, 0);
            }, 100);
        }, 2000);
    });
</script>

<div id="sponsors">
    <div id="spons">
        <img src="/organizers.png" alt="Organizatorzy" />
    </div>
    <div id="part">
        <img src="/partners.png" alt="Partnerzy" />
    </div>
</div>

<style lang="scss">
    #sponsors {
        background-color: white;

        > div {
            overflow-x: scroll;
        }
    }
</style>
