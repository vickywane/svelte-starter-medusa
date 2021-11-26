<script>
  import OrderItemPreview from "../../components/orderItemPreview.svelte";
  import { medusaCartState } from "../../state/cartStore";
  import { products } from "../../state/store";
  import { formatPrice, quantity, sum } from "../../utils/helpers";

  let userProducts;
  let userCart = [];
  let isLoading = true;

  products.subscribe(({ cartItems }) => {
    userProducts = cartItems;
  });

  medusaCartState.subscribe((state) => {
    if (state.cart.items) {
      userCart = state.cart;
      isLoading = false;
    }
  });
</script>

{#if isLoading}
  <div>
    <p>Loading Your Order Summary</p>
  </div>
{:else}
  <div class="order-summary">
    <div>
      <div class="flex justify-between mb-5">
        <h2 class="font-semibold text-lg">Order Summary</h2>

        {userCart.items.length > 0
          ? userCart?.items.map(quantity).reduce(sum)
          : 0}{" "}
        {userCart?.items.length > 0 &&
        userCart?.items.map(quantity).reduce(sum) === 1
          ? "item"
          : "items"}
      </div>
      <hr class="mb-5" />
      <ul>
        {#each userCart.items as { thumbnail, variant, unit_price, quantity, title }}
          <li>
            <OrderItemPreview
              size={variant.title}
              {quantity}
              orderThumbnail={thumbnail}
              name={title}
              price={formatPrice(unit_price, userCart.region.currency_code)}
            />
          </li>
        {/each}
      </ul>
    </div>

    <div class="bottom">
      <div class="flex justify-between mb-3 ">
        <p>Subtotal (incl. taxes)</p>
        <p>{formatPrice(userCart.subtotal, userCart.region.currency_code)}</p>
      </div>

      <div class="flex justify-between mb-3">
        <p>Shipping</p>
        <p>
          {userCart.region
            ? formatPrice(
                userCart.shipping_total,
                userCart.region.currency_code
              )
            : 0}
        </p>
      </div>

      <div class="flex justify-between mb-3">
        <p class="font-semibold ">Total</p>
        <p class="font-semibold ">
          {formatPrice(userCart.subtotal, userCart.region.currency_code)}
        </p>
      </div>
    </div>
  </div>
{/if}

<style>
  .order-summary {
    position: fixed;
    height: 90vh;
    width: 40%;
    max-height: 100vh;
    z-index: 11;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    justify-content: space-between;
    right: 50px;
    top: 65px;
  }
</style>
