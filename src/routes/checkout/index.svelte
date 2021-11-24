<script>
    import OrderSummary from "./orderSummary.svelte";
    import Delivery from "./deliveryStep.svelte";
    import CheckoutStage from "../../components/checkoutStage.svelte";
    import Payment from "./paymentStep.svelte";
    import Wrapper from "../wrapper.svelte";
    import {
        checkoutStore,
        updateCheckoutStore,
    } from "../../state/checkoutStore";
    import InformationStep from "./informationStep.svelte";
    import Nav from "../../components/Nav.svelte";

    import "../../styles/component.css";
    import "../../styles/checkout-page.css";

    let currentCheckoutState;

    checkoutStore.subscribe((state) => {
        currentCheckoutState = state?.currentCheckoutStep;
    });
    let cart;
    let deliveryOption;
</script>

<svelte:head>Checkout</svelte:head>

<Wrapper>
    <Nav hideCartControls={true} />
    <div class="checkout-container">
        <div class="steps-ctn">
            <CheckoutStage activeStage={currentCheckoutState} />

            {#if currentCheckoutState === "Information"}
                <InformationStep />
            {:else}
                <div class="mr-5">
                    <Delivery />

                    {#if currentCheckoutState === "Delivery"}
                        <div class="flex justify-between">
                            <div style="display : flex; align-items: center">
                                <div
                                    on:click={() =>
                                        (currentCheckoutState = "Information")}
                                    class="flex cursor-pointer"
                                >
                                    <svg
                                        class="h-5 w-5 mr-2 mt-1"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            clip-rule="evenodd"
                                            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                                            fill-rule="evenodd"
                                        />
                                    </svg>

                                    Back to Information
                                </div>
                            </div>

                            <button
                                on:click={() =>
                                    updateCheckoutStore({
                                        currentStep: "Payment",
                                        hasSelectedShipping: true,
                                    })}
                                class="custom-btn  w-40"
                            >
                                Next
                            </button>
                        </div>
                    {/if}

                    {#if currentCheckoutState === "Payment"}
                        <Payment />
                    {/if}
                </div>
            {/if}
        </div>

        <div class="summary-ctn">
            <OrderSummary />
        </div>
    </div>
</Wrapper>
