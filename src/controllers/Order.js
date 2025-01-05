import {
    ApiError,
    Client,
    Environment,
    LogLevel,
    OrdersController,
    PaymentsController,
} from "@paypal/paypal-server-sdk";
import dotenv from 'dotenv';
import emailSender from "../utils/sendEmail.js";

dotenv.config();

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID?.trim();
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET?.trim();

if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error('PayPal credentials are not properly configured in environment variables');
}

// Create a client instance
const client = new Client({
    clientCredentialsAuthCredentials: {
        oAuthClientId: PAYPAL_CLIENT_ID,
        oAuthClientSecret: PAYPAL_CLIENT_SECRET,
    },
    timeout: 0,
    environment: Environment.Sandbox,
    logging: {
        logLevel: LogLevel.Info,
        logRequest: { logBody: true },
        logResponse: { logHeaders: true },
    },
}); 

const ordersController = new OrdersController(client);
const paymentsController = new PaymentsController(client);

/**
 * Create an order to start the transaction.
 */
export const createOrderController = async (req, res) => {
    try {
        const { cart } = req.body;
        // console.log('Received cart data:', cart);
        // console.log('Received payer data:', payer);

        if (!cart || !cart.amount) {
            return res.status(400).json({ error: "Amount is required" });
        }

        // Validate amount
        const amount = parseFloat(cart.amount);
        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({ error: "Invalid amount. Amount must be greater than 0" });
        }

        // Create the order details
        const collect = {
            body: {
                intent: "CAPTURE",
                purchaseUnits: [
                    {
                        amount: {
                            currencyCode: "USD",
                            value: cart.amount,
                        },
                    },
                ],
               
            },
            prefer: "return=minimal",
        };

        // Create the PayPal order
        const { body, ...httpResponse } = await ordersController.ordersCreate(collect);

        res.status(httpResponse.statusCode).json(JSON.parse(body));
    } catch (error) {
        console.error("Failed to create order:", error);
        if (error instanceof ApiError) {
            res.status(error.statusCode || 500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "Failed to create order." });
        }
    }
};

/**
 * Capture payment for the created order to complete the transaction.
 */
export const captureOrderController = async (req, res) => {
    try {
        const { orderID } = req.params;

        const { payerEmail,payerName, amountValue} = req.query;


        const collect = {
            id: orderID,
            prefer: "return=minimal",
        };

        const { body, ...httpResponse } = await ordersController.ordersCapture(collect);
        // A better way to get payment details is by getting them from the body
        // But will not work in sandbox
        
        // const amountValue = body.purchase_units[0]?.payments?.captures[0]?.amount?.value;



        // After capturing, send an email to the payer
        await emailSender.sendEmail(
            payerEmail, 
            "Thank you for your donation!", 
            `<h1>Hey <b>${payerName}</b>,</h1> You donated $<b>${amountValue}</b>! <p>We appreciate your generous contribution ♥!</p>`
        );

        res.status(httpResponse.statusCode).json(JSON.parse(body));
    } catch (error) {
        console.error("Failed to capture order:", error);
        if (error instanceof ApiError) {
            res.status(error.statusCode || 500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "Failed to capture order." });
        }
    }
};
