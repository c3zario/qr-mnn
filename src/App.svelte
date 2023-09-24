<script type="ts">
    import { Router, Link, Route } from "svelte-routing";

    import Template from "./Template.svelte";

    import Register from "./Register.svelte";

    import Home from "./Home.svelte";
    import Scanner from "./Scanner.svelte";

    import Admin from "./Admin.svelte";

    import Sponsors from "./Sponsors.svelte";

    export let session;

    let qrScanner;
</script>

<main>
    <Router>
        <Route>
            <div id="start">
                <div id="img" />

                <div id="next">
                    <Link to={JSON.stringify(session) == "{}" ? "register" : "home"}>
                        <div>
                            <span>Weź udział w konkursie</span>&nbsp;&nbsp;&nbsp;»»»
                        </div>
                    </Link>
                </div>
            </div>
        </Route>

        <Route path="register" component={Register} />
        <Route path="home">
            <Template {session} />
            <Home {session} {qrScanner} />
        </Route>

        <Route path="scanner">
            <Template {session} />
            <Scanner bind:qrScanner />
        </Route>

        <Route path="admin">
            <Admin />
        </Route>
    </Router>
</main>

<Sponsors />

<style lang="scss">
    main {
        flex: 1;

        padding: 16px 30px 0 30px;

        #start {
            height: 100%;

            margin: 0 -30px -16px -30px;

            display: flex;
            flex-flow: column;

            #img {
                margin-top: -16px;

                width: 100vw;
                height: 550px;
                background-image: url("/poster.png");
                background-repeat: no-repeat;
                background-size: cover;
            }

            #next {
                flex: 1;

                min-height: 100px;

                display: flex;
                align-items: center;
                justify-content: end;

                div {
                    padding: 10px 20px;

                    border-radius: 15px 0 0 15px;

                    display: flex;
                    align-items: center;

                    border: 1px solid #e5007e;
                    border-right: 0;

                    background-color: #2697d3;

                    font-size: 20px;

                    color: white;

                    span {
                        font-size: 16px;
                        font-weight: bold;
                    }
                }
            }
        }
    }
</style>
