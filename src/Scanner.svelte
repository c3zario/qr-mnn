<script lang="ts">
    import QrScanner from "qr-scanner";
    import { onMount } from "svelte";

    import ButtonMnn from "./ButtonMnn.svelte";

    export let qrScanner;

    let videoElem: HTMLVideoElement;

    function DecodeQR(result) {
        fetch(result.data);

        window.location.href = "/home";
    }

    onMount(async () => {
        qrScanner = new QrScanner(videoElem, (result) => DecodeQR(result), {
            maxScansPerSecond: 5,
            highlightScanRegion: true,
            highlightCodeOutline: true,
        });
        qrScanner.start();
    });
</script>

<video bind:this={videoElem} />

<ButtonMnn value="Wróć" link="home" back={true} />

<style lang="scss">
    video {
        width: 100%;

        border-radius: 5px;
        border: 1px solid #e5007e;

        background-color: black;
    }
</style>
