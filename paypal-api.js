const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));


const base = "https://api-m.sandbox.paypal.com";

const createOrder = async () => {
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders`;
    const response = await fetch(url, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: "USD",
                        value: "50.00",
                    },
                },
            ],
        }),
    });
    const data = await response.json();
    return data;
}

const capturePayment = async (orderId) => {
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders/${orderId}/capture`;
    const response = await fetch(url, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });
    const data = await response.json();
    return data;
}


const generateAccessToken = async () => {
    const auth = Buffer.from(process.env.PAYPAL_ID + ":" + process.env.PAYPAL_SECRET).toString("base64");
    const response = await fetch(`${base}/v1/oauth2/token`, {
        method: "post",
        body: "grant_type=client_credentials",
        headers: {
            Authorization: `Basic ${auth}`,
        },
    });
    const data = await response.json();
    return data.access_token;
}

module.exports = { generateAccessToken, capturePayment, createOrder } 