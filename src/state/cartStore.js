import { navigate } from 'svelte-routing';
import { writable } from 'svelte/store';
import { createClient } from '../utils/client';
import { updateCheckoutStore } from "./checkoutStore";

const medusaClient = createClient();

export const medusaCartState = writable({
    cart_id: localStorage.getItem("MEDUSA_CART"),
    cart: {}
})

export const medusaShipping = writable([])

export const medusaPayment = writable([])

export const medusaCartConfirmation = writable([])

const createMedusaCart = async () => {
    try {
        const {data} = await medusaClient.carts.create()

        return data.cart
    } catch (e) {
        console.log(`Error creating cart: ${e}`)
    }
}

const saveMedusaCartId = async () => {
    try {
        const newCart = await createMedusaCart()

        const stringCartObj = JSON.stringify({cart_id: newCart.id})
        localStorage.setItem('MEDUSA_CART', stringCartObj)

        medusaCartState.update(state => {
            state.cart_id = stringCartObj

            return state
        })
    } catch (e) {
        console.log(`Error saving cart ID: ${e}`)
    }
}

export const retrieveCartId = () => {
    let cartId;

    medusaCartState.subscribe(state => {
        const {cart_id} = JSON.parse(state.cart_id)

        cartId = cart_id
    })

    return cartId
}

export const handleStoreCart = async () => {
    let savedCartId;
    savedCartId = localStorage.getItem("MEDUSA_CART")

    if (!savedCartId) {
        console.log("-> Creating cart ")

        await saveMedusaCartId()
    } else {
        const {cart_id} = JSON.parse(savedCartId)
        const {data} = await medusaClient.carts.retrieve(cart_id)

        medusaCartState.update(state => {
            state.cart = data.cart
            return state
        })
    }
}

export const addCartInfo = async (userDetailsObj, email) => {
    try {
        const cartId = retrieveCartId()

        const {data} = await medusaClient.carts.update(cartId, {
            shipping_address: userDetailsObj,
            billing_address: userDetailsObj,
            email: email
        })

        medusaCartState.update(state => {
            state.cart = data.cart

            return state
        })

        updateCheckoutStore({
            currentStep: "Delivery"
        })
    } catch (e) {
        console.log(`Error adding cart info: ${e}`)
    }
}

export const addVariantToCart = async (variantId, quantity) => {
    try {
        const cartId = retrieveCartId()

        await medusaClient.carts.lineItems.create(cartId, {
            variant_id: variantId,
            quantity: quantity
        })

        // refresh cart
        await handleStoreCart()
    } catch (e) {
        console.log(`Error adding cart variant: ${e}`)
    }
}

export const deleteVariantFromCart = async (lineId) => {
    try {
        const cartId = retrieveCartId()

        const {data} = await medusaClient.carts.lineItems.delete(cartId, lineId)

        medusaCartState.update(state => {
            state.cart = data.cart

            return state
        })
    } catch (e) {
        console.log(`Error deleting cart variant: ${e}`)
    }
}

export const completeCartCheckout = async () => {
    try {
        const cartId = retrieveCartId()

        const {data} = await medusaClient.carts.complete(cartId)

        medusaCartConfirmation.update((state) => {
            // response contains a nested data.data object
            state = data.data

            return state
        })
        localStorage.clear()
        medusaCartState.update((state) =>  {
            state.cart =  { items : [] }

            return state
        })

        await handleStoreCart()
    } catch (e) {
        console.log(`Error starting payment session: ${e}`)
    }
}

export const resetCart = async () => {
    // Cart has been checked-out. Reset all stored state.
    console.log("-> Resetting saved Medusa Cart ID")

    localStorage.clear()
    medusaCartState.update((state) =>  {
        state.cart =  { items : [] }

        return state
    })

    await handleStoreCart()
    navigate("/")
    location.reload()
}
