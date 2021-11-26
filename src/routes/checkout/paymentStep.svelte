<script>
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";
  import PaymentCard from "../../components/payment-card.svelte";
  import {
    medusaPayment,
    setPaymentSession,
    startPaymentSession,
  } from "../../state/productStore";

  let userPayment = [];
  let paymentLoader = true;

  onMount(async () => {
    await startPaymentSession();
  });

  medusaPayment.subscribe((state) => {
    if (state.cart) {
      userPayment = state.cart;
      paymentLoader = false;
    }
  });

  const handlePayment = async (providerId) => {
    try {
      await setPaymentSession(providerId);

      navigate("/payment");
    } catch (e) {
      console.log(e);
    }
  };
</script>

<div>
  {#if paymentLoader}
    <p>Loading payment</p>
  {:else}
    <div>
      {#each userPayment.payment_sessions as session}
        {#if session.provider_id === "manual"}
          <div>
            <div class="mb-6">
              <h1 class="font-semibold text-2xl">Test Payment</h1>
            </div>

            <div style="text-align: right">
              <button
                on:click={() => handlePayment(session.provider_id)}
                class="custom-btn"
              >
                Pay
              </button>
            </div>
          </div>
        {:else}
          <PaymentCard {session} />
        {/if}
      {/each}
    </div>
  {/if}
</div>
