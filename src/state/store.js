import { writable } from 'svelte/store'

export const products = writable({
    cartItems: []
})

export const addCartItem = (item) => {
    products.update((value) => {
        value.cartItems.push(item)

        return value
    })
}

export const removeCartItem = index => {
    products.update((items) => {
        items.cartItems.splice(index, 1)

        return items
    })
}

// CHECKOUT COMPONENT STATE =================>
export const checkoutState = writable(false)

export const setCheckoutState = newState => {
    checkoutState.update((oldState) => {
        oldState = newState
        return oldState
    })
}
