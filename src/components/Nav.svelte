<script>
  import { medusaCartState } from "../state/cartStore";
  import { checkoutState, setCheckoutState } from "../state/store";
  import { quantity, sum } from "../utils/helpers";
  import CartView from "./cart-view.svelte";

  export let hideCartControls;
  let userCart = [];
  let isLoading;
  let checkoutVisibility;

  checkoutState.subscribe((state) => {
    checkoutVisibility = state;
  });

  medusaCartState.subscribe((state) => {
    if (state.cart.items) {
      userCart = state.cart;
      isLoading = true;
    }
  });
</script>

<nav>
  <div class="header-ctn">
    <ul class="header-items">
      <li>
        <a href="/">
          <img
            class="logo"
            alt="Medusa logo in navbar"
            src="https://res.cloudinary.com/dkfptto8m/image/upload/v1636640334/medusa-logo.jpg"
          />
        </a>
      </li>

      {#if hideCartControls}
        <p style="opacity: 0">.</p>
      {:else}
        <li
          style="text-align: right"
          class="cursor-pointer pt-3"
          on:click={() => setCheckoutState(true)}
        >
          <ul class="flex">
            <li class="header-item">
              <p>Cart</p>
            </li>

            <li class="header-item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </li>

            {#if isLoading}
              <li class="header-item">
                {userCart.items.length > 0
                  ? userCart?.items.map(quantity).reduce(sum)
                  : 0}
              </li>
            {/if}
          </ul>
        </li>
      {/if}
    </ul>
  </div>

  <CartView />
</nav>

<style>
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    margin: 0;
  }

  a {
    text-decoration: none;
    padding: 1em 0.5em;
    display: block;
  }

  .header-ctn {
    display: flex;
    justify-content: space-between;
    padding: 0 2rem;
  }

  .header-items {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }

  .logo {
    height: 30px;
    object-fit: cover;
  }

  .flex {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }

  .header-item {
    margin: 0 0.3rem;
  }

  @media (max-width: 600px) {
    .header-ctn {
      display: flex;
      justify-content: space-between;
      padding: 0 1rem;
    }
  }
</style>
