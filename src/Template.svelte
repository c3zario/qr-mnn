<script lang="ts">
    export let session: any = {};

    let position: number[] = [];
    fetch("/position", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    }).then(async (response) => (position = await response.json()));
</script>

<div class="top">
    <div class="over">
        <div class="logo"><div /></div>

        <div class="user_data">
            <div>{session.name} {session.surname}</div>
            <div>Email: <span>{session.email}</span></div>
            <div>Kategoria wiekowa: <span>{session.category ? "15+" : "do 15 lat"}</span></div>
        </div>
    </div>

    <div class="under">
        <span>
            Masz <span>{position[0]}</span> miejsce spośród <span>{position[1]}</span> graczy
        </span>
    </div>
</div>

<div
    class="logout"
    on:click={async () => {
        fetch("/logout");
        window.location.href = "/";
    }}
>
    wyloguj się
</div>

<style lang="scss">
    .top {
        color: white;

        .over {
            display: flex;

            .logo {
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

            .user_data {
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

        .under {
            padding-top: 16px;
            padding-bottom: 16px;

            display: flex;
            align-items: center;
            justify-content: end;

            > span > span {
                font-weight: bold;
            }
        }
    }

    .logout {
        position: absolute;
        left: -27px;
        top: 520px;

        height: 26px;
        width: 80px;

        transform: rotate(270deg);

        display: flex;
        align-items: center;
        justify-content: center;

        border-radius: 0 0 3px 3px;

        background-color: #2697d3;
        font-size: 12px;

        color: white;
    }
</style>
