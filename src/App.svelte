<script>
    import {Route, Router} from 'svelte-routing'
    import Home from './routes/Home.svelte'
    import ProductPage from './routes/product/productPage.svelte'
    import Checkout from './routes/checkout/index.svelte'
    import Payment from './routes/payment/index.svelte'

    import { handleStoreCart } from "./state/cartStore";
    import {onMount} from "svelte";

    onMount(() => {
        handleStoreCart()
    })

    export let url = ""
</script>

<svelte:head>
    <title>Svelte Medusa Starter</title>
</svelte:head>

<Router url={url}>
    <Route component={Home} path="/"/>
    <Route component={Checkout} path="/checkout"/>
    <Route component={ProductPage} path="/product/:productId"/>
    <Route component={Payment} path="/payment"/>
</Router>
