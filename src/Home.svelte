<script type="ts">
    export let session;

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
</script>

Email: {session.email}<br />
Kategoria wiekowa: {session.age} lat<br />

{session.name}
{session.surname}<br />

Zdobyte kody: {points}
