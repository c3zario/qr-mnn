<script type="ts">
    let name: string, surname: string, email: string, age: number;

    let comment = "";

    async function handleSubmit() {
        const response = await fetch("/add_account", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, surname, email, age }),
        });

        comment = await response.text();
    }
</script>

{#if comment == ""}
    <form on:submit|preventDefault={handleSubmit}>
        <input type="text" name="name" bind:value={name} required />
        <input type="text" name="surname" bind:value={surname} required />
        <input type="text" name="email" bind:value={email} required />
        <input type="number" name="age" bind:value={age} required />

        <button type="submit">Utwórz konto</button>
    </form>
{:else}
    {comment}
{/if}
