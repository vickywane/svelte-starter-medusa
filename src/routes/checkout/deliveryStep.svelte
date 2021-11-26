<script>
  import { onMount } from "svelte";
  import { Link } from "svelte-routing";
  import { medusaCartState } from "../../state/cartStore";
  import {
    checkoutStore,
    updateCheckoutStore,
  } from "../../state/checkoutStore";
  import {
    getShippingOptions,
    medusaShipping,
    setShippingMethod,
  } from "../../state/productStore";

  let shippingOptions = [];
  let selectedShippingOption = [];
  let shippingLoader = true;
  let userShippingAddress = [];
  let hasSelectedShipping;

  onMount(async () => await getShippingOptions());

  checkoutStore.subscribe((state) => {
    // set `selectedShippingOption` with default
    // shippingMethod when a user moves to next step by button click
    if (state.currentCheckoutStep === "Payment") {
      selectedShippingOption = shippingOptions[0];
    }
    hasSelectedShipping = state.hasSelectedShipping;
  });

  medusaShipping.subscribe((state) => {
    shippingOptions = state;

    if (state.length > 0 && !selectedShippingOption) {
      // Selects the first available shipping option
      selectedShippingOption = state[0];
      setShippingMethod(state[0].id);
    }
  });

  medusaCartState.subscribe((state) => {
    if (state.cart.shipping_address) {
      userShippingAddress = state.cart.shipping_address;
      shippingLoader = false;
    }
  });

  const setDeliveryOption = async (option) => {
    try {
      selectedShippingOption = option;

      // Don't reselect a shipping method when a default method has been
      // preselected
      if (!selectedShippingOption) {
        await setShippingMethod(option.id);
      }

      updateCheckoutStore({
        hasSelectedShipping: true,
        currentStep: "Payment",
      });
    } catch (e) {
      console.log(e);
    }
  };
</script>

<div>
  {#if shippingLoader}
    <div>
      <p>Loading steps ....</p>
    </div>
  {:else}
    <div class="mb-5 mt-5">
      <div class="step-ctn">
        <div class="flex justify-between" style="width: 100%;">
          <p>Contact</p>
          <p>
            {userShippingAddress.first_name}{" "}{userShippingAddress.last_name}
          </p>
          <div
            class="cursor-pointer"
            on:click={() => updateCheckoutStore({ currentStep: "Information" })}
          >
            Edit
          </div>
        </div>
      </div>

      <div class="step-ctn">
        <div class="flex justify-between" style="width: 100%;">
          <p>Address</p>
          <p>
            {userShippingAddress.address_1}, {userShippingAddress.postal_code}
            {userShippingAddress.city}
          </p>
          <div
            class="cursor-pointer"
            on:click={() => updateCheckoutStore({ currentStep: "Information" })}
          >
            Edit
          </div>
        </div>
      </div>

      {#if hasSelectedShipping}
        <div class="step-ctn">
          <div class="flex justify-between" style="width: 100%;">
            <p>Contact</p>
            <p>{selectedShippingOption.name}</p>
            <Link class="cursor-pointer" to="/checkout">Edit</Link>
          </div>
        </div>
      {/if}
    </div>

    <h2 class="font-semibold text-2xl mb-5 mt-5">Delivery</h2>
    {#if !hasSelectedShipping}
      <div class="mb-5 mt-5">
        {#each shippingOptions as option}
          <div
            on:click={() => setDeliveryOption(option)}
            class="step-ctn cursor-pointer"
            style={`width: 100%; border: ${
              selectedShippingOption.id === option.id && "2px solid #383e46"
            }`}
          >
            <div class="flex justify-between" style="width: 100%;">
              <p>Shipping</p>
              <p>{option.name}</p>
              <Link class="cursor-pointer" to="/checkout">Edit</Link>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  {/if}
</div>

<style>
  .step-ctn {
    border: 1px solid #c4c4c4;
    border-radius: 8px;
    box-shadow: 0 2px 3px #c4c4c4;
    padding: 1rem;
    height: 80px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 1rem 0;
  }
</style>
