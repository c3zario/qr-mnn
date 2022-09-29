<script type="ts">
    export let session;

    let position: number[] = [];
    async function GetPosition() {
        const response = await fetch("/position", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
        position = await response.json();
    }
    GetPosition();

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
    <div id="top">
        <div id="logo"><div /></div>

        <div id="user_data">
            <div>{session.name} {session.surname}</div>
            <div>Email: <span>{session.email}</span></div>
            <div>Kategoria wiekowa: <span>{session.category ? "15+" : "do 15 lat"}</span></div>
        </div>
    </div>

    <div id="position">
        <span
            >Masz <span>{position[0]}</span> miejsce spośród <span>{position[1]}</span> graczy</span
        >
    </div>

    <div id="codes">
        <div>Zdobyte kody: <span>{points}</span></div>

        <div>
            {#each codes as code, key}
                <div>
                    {#if code}
                        <span style="color: white; font-weight: bold">{key + 1} {code}</span>
                    {:else}
                        <span style="color: #D9D9D9">{key + 1}</span>
                    {/if}
                </div>
            {/each}
        </div>
    </div>

    <div
        id="logout"
        on:click={async () => {
            fetch("/logout");
            window.location.href = "/";
        }}
    >
        wyloguj się
    </div>
</div>

<style lang="scss">
    #home {
        height: 100%;
        position: relative;

        color: white;

        #top {
            display: flex;

            #logo {
                height: 60px;
                width: 70px;

                padding: 1px;

                > div {
                    height: 100%;
                    width: 100%;

                    background-image: url("/logo.png");
                    background-repeat: no-repeat;
                    background-position: center;
                    background-size: 100%;
                }
            }

            #user_data {
                flex: 1;

                display: flex;
                flex-flow: column;
                align-items: flex-end;

                border-bottom: 1px solid white;

                font-size: 14px;

                span {
                    font-weight: bold;
                }
            }
        }

        #position {
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: end;

            > span > span {
                font-weight: bold;
            }
        }

        #codes {
            margin-top: 20px;

            > div {
                &:nth-child(1) {
                    border-bottom: 1px solid white;

                    padding-bottom: 5px;

                    font-size: 14px;

                    span {
                        font-weight: bold;
                    }
                }

                &:nth-child(2) {
                    column-count: 2;
                    padding: 15px;

                    font-size: 12px;

                    line-height: 1.4;
                }
            }
        }

        #logout {
            position: absolute;
            left: -57px;
            bottom: 40px;

            height: 26px;
            width: 80px;

            transform: rotate(270deg);

            display: flex;
            align-items: center;
            justify-content: center;

            border-radius: 0 0 3px 3px;

            background-color: #2697d3;
            font-size: 12px;
        }
    }
</style>
