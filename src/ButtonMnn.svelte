<script lang="ts">
    import { Link } from "svelte-routing";

    export let value: string,
        link: string,
        back: boolean = false;
</script>

<div class="button_mnn {back}">
    <Link to={link}>
        <div>
            {#if back}
                «««&nbsp;&nbsp;&nbsp;<span>{value}</span>
            {:else}
                <span>{value}</span>&nbsp;&nbsp;&nbsp;»»»
            {/if}
        </div>
    </Link>
</div>

<style lang="scss">
    .true div {
        border-radius: 0 15px 15px 0;
    }

    .false {
        justify-content: end;

        div {
            border-radius: 15px 0 0 15px;
        }
    }

    .button_mnn {
        margin-top: 10px;
        margin-bottom: 20px;

        display: flex;

        div {
            padding: 10px 20px;

            display: flex;
            align-items: center;

            border: 1px solid #e5007e;

            background-color: #2697d3;

            font-size: 20px;

            color: white;

            span {
                font-size: 16px;
                font-weight: bold;
            }
        }
    }
</style>
