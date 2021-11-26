import { writable } from "svelte/store";

export const checkoutStore = writable({
    currentCheckoutStep : "Information",
    hasSelectedShipping : false
})

export const updateCheckoutStore = ({ currentStep , hasSelectedShipping }) => {
    checkoutStore.update((state) => {
        state.currentCheckoutStep = currentStep || state.currentCheckoutStep
        state.hasSelectedShipping = hasSelectedShipping || state.hasSelectedShipping

        return state
    })
}
