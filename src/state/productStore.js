import { writable } from 'svelte/store';
import { createClient } from '../utils/client';
import { retrieveCartId } from "./cartStore";

const medusaClient = createClient();

export const medusaShipping = writable([])
export const medusaPayment = writable([])
export const medusaProductStore = writable({
    allProducts: [],
    product: null
})

export const retrieveAllProducts = async () => {
    try {
        const {data} = await medusaClient.products.list()

        medusaProductStore.update((value) => {
            value.allProducts = data.products

            return value
        })
    } catch (e) {
        console.log(e)
    }
}

export const retrieveProduct = async productId => {
    try {
        const {data} = await medusaClient.products.retrieve(productId)
        medusaProductStore.update((value) => {
            value.product = data.product

            return value
        })
    } catch (e) {
        console.log(`Error fetching product: ${e}`)
    }
}


export const getShippingOptions = async () => {
    try {
        const cartId = retrieveCartId()
        const {data} = await medusaClient.shippingOptions.list(cartId)
        medusaShipping.update(state => {
            state = data.shipping_options

            return state
        })
    } catch (e) {
        console.log(`Error retrieving shipping_id: ${e}`)
    }
}

export const setShippingMethod = async (shippingOptionId) => {
    try {

        const cartId = retrieveCartId()
        await medusaClient.carts.addShippingMethod(cartId, {
            option_id: shippingOptionId
        })

    } catch (e) {
        console.log(`Error setting shipping method: ${e}`)
    }
}

export const startPaymentSession = async () => {
    try {
        const cartId = retrieveCartId()
        const {data} = await medusaClient.carts.createPaymentSessions(cartId)

        medusaPayment.update(state => {
            state = data

            return state
        })
    } catch (e) {
        console.log(`Error starting payment session: ${e}`)
    }
}

export const setPaymentSession = async (paymentProvider) => {
    try {
        const cartId = retrieveCartId()

        await medusaClient.carts.setPaymentSession(cartId, {
            provider_id: paymentProvider
        })

    } catch (e) {
        console.log(`Error starting payment session: ${e}`)
    }
}
