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
            amount: 9,
            priceIds: {
                test: 'price_1P2FAbSHov5T9AqkIrxpi383',
                production: '',
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
            amount: 39,
            priceIds: {
                test: 'price_1P2FC1SHov5T9AqkXmKMYX7h',
                production: '',
            },
        },
    },
]