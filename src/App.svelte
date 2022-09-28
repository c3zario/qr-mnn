<script type="ts">
    import { Router, Link, Route } from "svelte-routing";

    import Register from "./Register.svelte";
    import Home from "./Home.svelte";

    export let session;
</script>

<main>
    <Router>
        <Route>
            <Link to="register">Weź udział w konkursie</Link>
        </Route>

        <Route path="register" component={Register} />
        <Route path="home">
            <Home {session} />
        </Route>
    </Router>
</main>

<style lang="scss">
    main {
        text-align: center;
        padding: 1em;
        max-width: 240px;
        margin: 0 auto;
    }
</style>
