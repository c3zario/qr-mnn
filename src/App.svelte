<script type="ts">
    import { Router, Link, Route } from "svelte-routing";

    import Register from "./Register.svelte";
    import Home from "./Home.svelte";
    import Sponsors from "./Sponsors.svelte";

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

<Sponsors />

<style lang="scss">
    main {
        flex: 1;
		
        padding: 16px 30px 0 30px;
    }
</style>
