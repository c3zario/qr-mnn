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

    let isLive = false;
    $: isLive = innerWidth >= 746 && window.location.pathname == "/live";
</script>

<svelte:window bind:innerWidth />

<div id="sponsors" class={isLive ? "live" : ""} style="width: {innerWidth - (isLive ? 60 : 0)}px">
    <div>
        <div id="img" bind:this={spons}>
            <img src="/organizers.png" alt="Organizatorzy" />
        </div>
    </div>

    <div id="author">Autor aplikacji QR <span>©</span> <a href="https://www.linkedin.com/in/c3zario/" target="_blank" class="svelte-1le4c6i">Cezary Rosiński</a></div>
</div>

<style lang="scss">
    #sponsors {
        margin-left: -30px;

        display: flex;
        flex-flow: column;
        justify-content: center;

        border-radius: 5px;

        

        #img {
            overflow-x: scroll;

            border-radius: 5px;
            
            background-color: white;
        }

        #author {
            padding-top: 10px;
            padding-bottom: 10px;

            background-color: #183a68;

            text-align: center;

            font-size: 12px;
            color: white;

            span {
                color: rgba(255, 255, 255, 0.8);
            }

            a:hover {
                color: rgba(255, 255, 255, 0.8);
            }
        }
    }

    .live {
        margin: 30px 30px 16px 0 !important;
    }

    
</style>
