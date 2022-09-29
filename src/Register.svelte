<script type="ts">
    let name: string, surname: string, email: string, age: number;

    let comment = "";
    let errorAge = "";

    async function handleSubmit() {
        if (age < 15) {
            errorAge = "Masz za mało lat";
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

<div id="register">
    {#if comment == ""}
        <form on:submit|preventDefault={handleSubmit}>
            <input type="text" name="name" bind:value={name} placeholder="Imię" required />
            <input
                type="text"
                name="surname"
                bind:value={surname}
                placeholder="Nazwisko"
                required
            />
            <input type="text" name="email" bind:value={email} placeholder="Email" required />
            <input type="number" name="age" bind:value={age} placeholder="Wiek" required />
            {errorAge}

            <button type="submit">Utwórz konto</button>
        </form>
    {:else}
        {comment}
    {/if}
</div>

<style lang="scss">
    #register {
        color: white;
    }
</style>
