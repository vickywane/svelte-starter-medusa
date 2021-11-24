export const formatPrice = (price, currency) => {
    return `${(price / 100).toFixed(2)} ${currency && currency.toUpperCase()}`;
};

export const quantity = (item) => {
    return item.quantity;
};

export const sum = (prev, next) => {
    return prev + next;
};

export const getRouteParam = (url, itemKey) => {
    const param = url.split("/")

    return param[itemKey]
}

function getTaxRate(cart) {
    if ("tax_rate" in cart) {
        return cart.tax_rate / 100;
    } else if (cart.region) {
        return cart.region && cart.region.tax_rate / 100;
    }
    return 0;
}

export function formatMoneyAmount(moneyAmount, digits, taxRate = 0) {
    let locale = "en-US";

    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: moneyAmount.currencyCode,
        minimumFractionDigits: digits,
    }).format(moneyAmount.amount * (1 + taxRate / 100));
}

export function getVariantPrice(cart, variant) {
    let taxRate = getTaxRate(cart);

    let moneyAmount = variant.prices.find(
        (p) =>
         p.currency_code.toLowerCase() === cart.region.currency_code.toLowerCase()
    );

    if (moneyAmount && moneyAmount.amount) {
        return (moneyAmount.amount * (1 + taxRate)) / 100;
    }

    return undefined;
}

export function formatPrices(cart, variant, digits = 2) {
    if (!cart || !variant) return;
    if (!variant.prices) return `15.00 EUR`;
    if (!cart.region) return `15.00 EUR`;

    return formatMoneyAmount(
        {
            currencyCode: cart.region.currency_code,
            amount: getVariantPrice(cart, variant),
        },
        digits
    );
}
