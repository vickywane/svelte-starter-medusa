<script>
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";
  import { CardCvc, CardExpiry, CardNumber, Container } from "svelte-stripe-js";
  import { startPaymentSession } from "../state/productStore";
  import getStripe from "../utils/stripe";

  onMount(async () => {
    await startPaymentSession();
  });

  export let session;
  console.log(session);
  let stripe = null;
  let cardElement;
  let paymentError;
  let paymentStatus;

  onMount(async () => {
    stripe = await getStripe();

    console.log(stripe);
  });

  async function submit() {
    paymentStatus = "IN_PROGRESS";

    try {
      if (session.data?.client) {
        const payload = await stripe.confirmCardPayment(
          session.data.client_secret,
          {
            payment_method: {
              card: cardElement,
            },
          }
        );

        if (payload.error) {
          paymentError = payload.error.message;
          paymentStatus = "FAILED";
        } else {
          paymentStatus = "SUCCESS";

          navigate(`/payment`);
        }
      } else {
        paymentStatus = "FAILED";
        paymentError =
          "An Error Occurred. Unable to process your payment at the moment.";
      }
    } catch (e) {
      paymentStatus = "FAILED";
      console.log(e);
    }
  }
</script>

<div>
  {#if !stripe}
    <p>Loading Stripe ...</p>
  {:else}
    <Container {stripe}>
      <form id="payment-form" on:submit|preventDefault={submit}>
        <div class="mb-4">
          <h1 class="font-semibold text-1xl">Card Details</h1>
        </div>

        <div>
          <div class="mb-3">
            <CardNumber bind:element={cardElement} />
          </div>

          <div class="mb-3">
            <CardExpiry />
          </div>

          <div class="mb-3">
            <CardCvc />
          </div>
        </div>

        {#if paymentError}
          <p class="my-5 text-center">{paymentError}</p>
        {/if}

        <button
          class="custom-btn my-5"
          disabled={paymentStatus === "IN_PROGRESS"}
        >
          {#if paymentStatus === "IN_PROGRESS"}
            Making Payment...
          {:else}
            Make Payment
          {/if}
        </button>
      </form>
    </Container>
  {/if}
</div>
