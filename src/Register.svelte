<script type="ts">
    import ButtonMnn from "./ButtonMnn.svelte";

    let name: string, surname: string, email: string, age: number;

    let comment = "";
    let errorAge = "";

    async function handleSubmit() {
        if (age < 15) {
            errorAge = "Masz za mało lat!";
        } else {
            const response = await fetch("/add_account", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, surname, email, age }),
            });

            comment = await response.text();
        }
    }
</script>

<div id="login_register">
    <div id="top">
        <div id="logo"><div /></div>

        <div id="invate">
            <div>&nbsp;</div>
            <div>&nbsp;</div>
            <div>Zapraszamy do zabawy</div>
        </div>
    </div>

    <div id="desc">
        <span>
            Zdobywaj punkty skanując kody QR ukryte na terenie całej uczelnii. Wygrywa posiadacz
            największej ilości punktów.<br /><br />Powodzenia!
        </span>
    </div>

    <div id="login">
        <div>zaloguj się</div>

        <div>
            <div>Kliknij w link wysłany na podany wcześniej adres email</div>
        </div>
    </div>

    <div id="register">
        <div>lub utwórz konto</div>
        <form on:submit|preventDefault={handleSubmit}>
            {#if comment == ""}
                <div>
                    <div>Imię</div>
                    <input type="text" name="name" bind:value={name} required />
                </div>
                <div>
                    <div>Nazwisko</div>
                    <input type="text" name="surname" bind:value={surname} required />
                </div>
                <div>
                    <div>Email</div>
                    <input type="email" name="email" bind:value={email} required />
                </div>
                <div id="age">
                    <div>Wiek</div>
                    <input type="number" name="age" min="1" max="99" bind:value={age} required />
                    <span>{errorAge}</span>
                </div>

                <ButtonMnn value="Wróć" link="/" back={true} />

                <div id="submit">
                    <button type="submit"><span>Utwórz konto</span>&nbsp;&nbsp;&nbsp;»»»</button>
                </div>
            {:else}
                {comment}
            {/if}
        </form>
    </div>
</div>

<style lang="scss">
    #login_register {
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

            #invate {
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

        #desc {
            padding-top: 16px;
            padding-bottom: 16px;

            display: flex;
            align-items: center;
            justify-content: end;

            text-align: right;
            line-height: 1.3;
            font-size: 14px;
            color: #d9d9d9;
        }

        #login {
            margin-top: 20px;

            > div {
                &:nth-child(1) {
                    border-bottom: 1px solid white;

                    padding-bottom: 5px;

                    font-size: 14px;
                }

                &:nth-child(2) {
                    padding: 15px;

                    > div {
                        padding: 10px 20px;

                        border-radius: 3px;

                        background-color: #2697d3;

                        font-size: 14px;
                    }
                }
            }
        }

        #register {
            margin-top: 40px;

            > div {
                border-bottom: 1px solid white;

                padding-bottom: 5px;

                font-size: 14px;
            }

            > form {
                padding: 15px;

                > div {
                    margin-top: 4px;
                    margin-bottom: 4px;
                    padding: 10px 20px;

                    display: flex;

                    border-radius: 3px 15px 15px 3px;

                    background-color: #2697d3;

                    font-size: 14px;

                    > div {
                        margin-right: 10px;
                    }

                    input {
                        width: 100%;

                        border: none;
                        border-bottom: 1px solid white;
                        background-color: unset;

                        color: white;
                    }

                    input:focus {
                        outline: none;
                    }
                }

                #age {
                    position: relative;

                    width: 100px;

                    span {
                        position: absolute;
                        left: 120px;

                        width: 120px;

                        font-weight: bold;
                        color: #e5007e;
                    }
                }

                #submit {
                    padding: 0;

                    justify-content: end;

                    background-color: unset;

                    button {
                        padding: 10px 20px;

                        border-radius: 15px 3px 3px 15px;

                        display: flex;
                        align-items: center;

                        border: none;
                        border: 1px solid #e5007e;

                        background-color: #2697d3;

                        font-size: 20px;

                        color: white;

                        span {
                            line-height: 1;
                            font-size: 14px;
                            font-weight: bold;
                        }
                    }
                }
            }
        }
    }
</style>
