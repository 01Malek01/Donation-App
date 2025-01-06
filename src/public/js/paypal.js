// constants
const donationAmount = document.getElementById("amount");
const donationName = document.getElementById("name");
const donationEmail = document.getElementById("email");
const resultMessage = document.getElementById("result-message");
const modal = document.querySelector(".modal");


const closeModal = () => {
    modal.style.display = "none";
    document.querySelector("#paypal-button-container").style.zIndex = "1000";

};

// Add event listener outside the PayPal button configuration
donationAmount.addEventListener("change", (e) => {
    console.log("Amount changed:", e.target.value);
});

donationName.addEventListener("change", (e) => {
    console.log("Name changed:", e.target.value);
});
donationEmail.addEventListener("change", (e) => {
    console.log("Email changed:", e.target.value);
});


// Show Paypal buttons
window.paypal
    .Buttons({
        style: {
            color: "gold",
            shape: "rect",
            label: "donate",
        },
        
        async createOrder() {
            try {
                if(
                    donationAmount.value === "" || 
                    donationName.value === "" ||
                    donationEmail.value === ""
                
                ){
                    resultMessage.textContent = "Please fill in all fields";
                    return;
                }
                // Get the current value when creating the order
                const amount = parseFloat(donationAmount.value);
                
                // Validate amount
                if (!amount || amount <= 0) {
                    throw new Error('Please enter a valid amount greater than 0');
                }
                
                console.log("Creating order with amount:", amount);

                const response = await fetch("/api/v1/orders", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        cart: {
                            id: Math.floor(Math.random() * 1000000),
                            amount: amount.toFixed(2) // Ensure 2 decimal places
                        },
                        
                    }),
                });

                const orderData = await response.json();

                if (orderData.error) {
                    throw new Error(orderData.error);
                }

                return orderData.id;
            } catch (error) {
                console.error(error);
                resultMessage.innerHTML = `Could not initiate PayPal Checkout...<br><br>${error}`;
                throw error; // Rethrow to prevent PayPal button from proceeding
            }
        },

        async onApprove(data, actions) {
            try {
                // send the payment details to the server (not secure, there are better options)
                const response = await fetch(
                    `/api/v1/orders/${data.orderID}/capture?payerName=${donationName.value}&payerEmail=${donationEmail.value}&amountValue=${donationAmount.value}`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                const orderData = await response.json();
                console.log( 'order data',orderData);
                if (orderData.error) {
                    throw new Error(orderData.error);
                }
 

                const transaction = orderData.purchase_units[0].payments.captures[0];

            
                document.querySelector("#paypal-button-container").style.zIndex = "0";
                modal.style.display = "flex";
                modal.innerHTML = `
                <div class="modal-content" style="background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); width: 400px; margin: 0 auto; font-family: Arial, sans-serif;">
  <div class="modal-header" style="text-align: center; border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 15px;">
    <h2 style="color: #4CAF50; font-size: 24px; margin: 0;">Transaction Successful!</h2>
    <p style="color: #555; font-size: 16px; margin: 5px 0 0;">Thank you for your support!</p>
  </div>
  <div class="modal-body" style="padding: 10px 0;">
    <p style="color: #333; font-size: 16px; margin: 8px 0;">Transaction ID: <strong>${transaction.id}</strong></p>
    <p style="color: #333; font-size: 16px; margin: 8px 0;">Transaction Status: <strong>${transaction.status}</strong></p>
    <p style="color: #333; font-size: 16px; margin: 8px 0;">Transaction Amount: <strong>${transaction.amount.value} $</strong></p>
    <p style="color: #333; font-size: 16px; margin: 8px 0;">Transaction Currency: <strong>${transaction.amount.currency_code}</strong></p>
  </div>
  <div class="modal-footer" style="text-align: center; margin-top: 20px;">
    <button class="modal-btn" style="background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;" onclick="closeModal()">Close</button>
  </div>
</div>

                `;
                resultMessage.innerHTML = `
                    <h3>Thank you for your payment!</h3>
                      <p>You donated: ${transaction.amount.value}$</p>
                `;
            } catch (error) {
                console.error(error);
                resultMessage.innerHTML = `Sorry, your transaction could not be processed...<br><br>${error}`;
                throw error;
            }
        },
    })
    .render("#paypal-button-container");