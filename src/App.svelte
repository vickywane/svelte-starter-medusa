<script>
  import { onMount } from "svelte";
  import { Route, Router } from "svelte-routing";
  import Checkout from "./routes/checkout/index.svelte";
  import Home from "./routes/Home.svelte";
  import Payment from "./routes/payment/index.svelte";
  import ProductPage from "./routes/product/productPage.svelte";
  import { handleStoreCart } from "./state/cartStore";

  onMount(() => {
    handleStoreCart();
  });

  export let url = "";
</script>

<svelte:head>
  <title>Svelte Medusa Starter</title>
</svelte:head>

<Router {url}>
  <Route component={Home} path="/" />
  <Route component={Checkout} path="/checkout" />
  <Route component={ProductPage} path="/product/:productId" />
  <Route component={Payment} path="/payment" />
</Router>
