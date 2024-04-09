export const PLANS = [
    {
        name: 'Free',
        slug: 'free',
        forWhom: 'For Small Projects',
        eventQuota: 1000,
        expQuota: 3,
        price: {
            amount: 0,
            priceIds: {
                test: '',
                production: '',
            },
        },
    },
    {
        name: 'Pro',
        slug: 'pro',
        forWhom: 'For Larger Projects',
        eventQuota: 50000,
        expQuota: 9,
        price: {
            amount: 749,
            priceIds: {
                test: 'price_1P3fIJSITtLlHUyjuBtV9hQD',
                production: 'price_1P3fFCSITtLlHUyjX5A9Kxo6',
            },
        },
    },
    {
        name: 'Bussiness',
        slug: 'bussiness',
        forWhom: 'For Businesses and Organizations',
        eventQuota: 10000000000000,
        expQuota: 10000000000000,
        price: {
            amount: 3999,
            priceIds: {
                test: 'price_1P3fIhSITtLlHUyjFnIJfhuf',
                production: 'price_1P3fG8SITtLlHUyj8Ms4exWY',
            },
        },
    },
]