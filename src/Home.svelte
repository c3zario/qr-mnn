<script type="ts">
    import ButtonMnn from "./ButtonMnn.svelte";

    export let session, qrScanner;

    let codeShow = false;
    if (session.newCodeShow) {
        codeShow = true;
        session.newCodeShow = false;
        fetch("/newCodeDel");
    }
    if (qrScanner !== undefined) qrScanner.stop();

    let points = "0";
    async function GetPoints() {
        const response = await fetch("/points", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
        points = await response.text();
    }
    GetPoints();

    let codes = [];
    async function GetAllCodes() {
        const response = await fetch("/all_codes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
        codes = await response.json();
    }
    GetAllCodes();
</script>

<div id="home">
    <div id="codes">
        <div>Zdobyte kody: <span>{points}</span></div>

        <div>
            {#each codes as code, key}
                <div>
                    {#if code}
                        <span class="active">
                            {key + 1}

                            {#if codeShow && session.newCodeName == code}
                                <span>{code}</span>
                            {:else}
                                {code}
                            {/if}
                        </span>
                    {:else}
                        <span class="no_active">{key + 1}</span>
                    {/if}
                </div>
            {/each}
        </div>
    </div>

    <ButtonMnn value="Wróć" link="/" back={true} />
    <ButtonMnn value="Skanuj kod" link="scanner" />
</div>

<style lang="scss">
    #home {
        height: 100%;
        position: relative;

        color: white;

        #codes {
            margin-top: 20px;

            > div {
                &:nth-child(1) {
                    border-bottom: 1px solid white;

                    padding-bottom: 5px;

                    font-size: 14px;

                    > span {
                        font-weight: bold;
                    }
                }

                &:nth-child(2) {
                    column-count: 2;
                    padding: 15px;

                    font-size: 12px;

                    line-height: 1.4;

                    .active {
                        font-weight: bold;

                        > span {
                            color: #26d36b;
                        }
                    }

                    .no_active {
                        color: #d9d9d9;
                    }
                }
            }
        }
    }
</style>
