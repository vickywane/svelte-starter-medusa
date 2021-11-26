<script>
  import { Link } from "svelte-routing";
  import { deleteVariantFromCart, medusaCartState } from "../state/cartStore";
  import { checkoutState, setCheckoutState } from "../state/store";
  import "../styles/cart-view.css";
  import "../styles/component.css";
  import { formatPrice, quantity, sum } from "../utils/helpers";

  let isLoading = true;
  let userCart = [];
  let checkoutVisibility;

  checkoutState.subscribe((state) => {
    checkoutVisibility = state;
  });

  medusaCartState.subscribe((state) => {
    if (state.cart.items) {
      userCart = state.cart;

      isLoading = false;
    }
  });
</script>

<nav
  class="menu-nav"
  style={`transform: ${
    checkoutVisibility ? "translateX(-460px)" : "translateX(110%)"
  }`}
>
  {#if isLoading}
    <div>
      <p>Loading ...</p>
    </div>
  {:else}
    <ul class="flex justify-between">
      <li>
        <p>Bag</p>
      </li>

      <li>
        <p>
          {userCart.items.length > 0
            ? userCart?.items.map(quantity).reduce(sum)
            : 0}{" "}
          {userCart?.items.length > 0 &&
          userCart?.items.map(quantity).reduce(sum) === 1
            ? "item"
            : "items"}
        </p>
      </li>

      <li>
        <div class="hover" on:click={() => setCheckoutState(false)}>
          <svg
            class="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 18L18 6M6 6l12 12"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            />
          </svg>
        </div>
      </li>
    </ul>

    <ul class="list">
      {#if userCart.items.length < 1}
        <div>
          <p class="center">Cart Empty</p>

          <p class="sub-text" style="text-align: center">
            Your cart is currently empty
          </p>
        </div>
      {:else}
        {#each userCart.items as { id, thumbnail, variant, unit_price, quantity, title }, index}
          <li>
            <div class="product-ctn">
              <div style="display: flex">
                <img class="cart-image" alt={`Cart ${title}`} src={thumbnail} />

                <ul class="ml-7">
                  <li>
                    <p>{title}</p>
                  </li>
                  <li>
                    <p class="sub-text">Size: {variant.title}</p>
                  </li>
                  <li>
                    <p class="sub-text">
                      Price: {formatPrice(
                        unit_price,
                        userCart.region.currency_code
                      )}
                    </p>
                  </li>

                  <li>
                    <p class="sub-text">Quantity: {quantity}</p>
                  </li>

                  <li>
                    <p
                      on:click={() => deleteVariantFromCart(id)}
                      class="remove-btn"
                    >
                      Remove
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </li>
        {/each}
      {/if}
    </ul>

    <ul>
      <li class="flex justify-between">
        <p>Subtotal (incl. taxes)</p>
        <p>{formatPrice(userCart.subtotal, userCart.region?.currency_code)}</p>
      </li>

      {#if userCart.items.length > 0}
        <li>
          <Link to="/checkout" on:click={() => setCheckoutState(false)}>
            <button class="custom-btn"> Checkout </button>
          </Link>
        </li>
      {/if}
    </ul>
  {/if}
</nav>
