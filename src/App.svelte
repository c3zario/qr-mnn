<script type="ts">
	import {Router, Link, Route} from "svelte-routing"
	import Register from "./Register.svelte"
</script>

<main>	
	<Router>
		<Route>
			<Link to="register">Weź udział w konkursie</Link>
		</Route>
		
		<Route path="register" component={Register} />
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