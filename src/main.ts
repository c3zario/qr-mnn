import App from "./App.svelte";

async function create() {
    new App({
        target: document.body,
        props: {
            session: await (await fetch("/session")).json(),
        },
    });
}

let app = create();

export default app;
