<script>
  import { onMount } from "svelte";
  import Nav from "../../components/Nav.svelte";
  import OrderItemPreview from "../../components/orderItemPreview.svelte";
  import {
    completeCartCheckout,
    medusaCartConfirmation,
    resetCart,
  } from "../../state/cartStore";
  import "../../styles/component.css";
  import { formatPrice } from "../../utils/helpers";
  import Wrapper from "../wrapper.svelte";

  let loadingPayment = true;
  let cartConfirmation = {};

  onMount(async () => {
    await completeCartCheckout();
  });

  medusaCartConfirmation.subscribe((state) => {
    if (state.email) {
      cartConfirmation = state;
      loadingPayment = false;
    }
  });
</script>

<svelte:head>Payment</svelte:head>

<Wrapper>
  <Nav hideCartControls={true} />

  {#if loadingPayment}
    <div class="flex justify-center">
      <p>Hang on while we validate your payment...</p>
    </div>
  {:else}
    <div class="container">
      <div>
        <div class="my-5">
          <h1 class="font-semibold text-4xl mb-5">Order Summary</h1>
          <p class="mb-5">Thank you for your order!</p>
        </div>

        <hr />

        {#each cartConfirmation.items as { thumbnail, title, quantity, unit_price, variant }}
          <div class="my-5">
            <OrderItemPreview
              orderThumbnail={thumbnail}
              name="{title},"
              size={variant.title}
              quantity
              price={formatPrice(
                unit_price,
                cartConfirmation?.region?.currency_code
              )}
            />
          </div>
        {/each}

        <hr />

        <div class="my-5">
          <div class="flex justify-between mb-3">
            <p>Subtotal</p>
            <p>
              {formatPrice(
                cartConfirmation.subtotal,
                cartConfirmation?.region?.currency_code
              )}
            </p>
          </div>

          <div class="flex justify-between mb-3">
            <p>Shipping</p>
            <p>
              {formatPrice(
                cartConfirmation.shipping_total,
                cartConfirmation?.region?.currency_code
              )}
            </p>
          </div>

          <div class="flex justify-between font-semibold mb-3">
            <p>Total</p>
            <p>
              {formatPrice(
                cartConfirmation.total,
                cartConfirmation?.region?.currency_code
              )}
            </p>
          </div>
        </div>
        <hr />

        <p class="my-5">
          An order confirmation will be sent to you at <b>
            {cartConfirmation.email}
          </b>
        </p>

        <button
          class="custom-btn"
          on:click={() => resetCart()}
          style="width: 100%"
        >
          Okay, View Existing Products
        </button>
      </div>
    </div>
  {/if}
</Wrapper>

<style>
  .container {
    height: calc(100vh - 100px);
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
