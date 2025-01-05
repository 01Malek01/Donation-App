# **Payment Gateway Integration for Donation Website**

## **Project Description**

This project involves creating a simple website where users can donate money using a payment gateway. The website integrates **PayPal** as the payment gateway, allowing users to:

- Choose the donation amount and payment method.
- Receive an invoice via email upon successful payment.

---

## **Key Features**

- **Donate Button**: A simple button on the homepage redirects users to the payment page.
- **Payment Gateway Integration**: Users can choose the donation amount and payment method (e.g., credit card, PayPal).
- **Invoice Generation**: After successful payment, an invoice is sent to the user's email.
- **Basic User Information**: Only essential details like name, email, amount, and payment type are collected.

---

## **Technologies Used**

### **Frontend**

- HTML
- CSS
- JavaScript

### **Backend**

- Node.js
- Express.js

### **Payment Gateway**

- PayPal

---

## **Installation Guide**

Follow these steps to set up and run the project locally:

### **1. Clone the Repository**

```bash
git clone https://github.com/01Malek01/Donation-App.git
```

### **2. Navigate to the Project Directory**

### **3. Install Dependencies**

```bash
npm install
```

### **4. Set Up Environment Variables**

1. Create a `.env` file in the root directory.
2. Add the following variables to the file:

   ```env
   PAYPAL_CLIENT_ID=your_paypal_client_id
   PAYPAL_CLIENT_SECRET=your_paypal_client_secret
   EMAIL_USER=your_email_user from which the email will be sent
   EMAIL_PASS=your_email_password
   ```

### **5. Run the Application**

```bash
npm start
```

### **6. Access the Application**

Open your browser and navigate to [http://localhost:5000](http://localhost:5000).

---

## **Usage**

### **Homepage**

- Click the **"Donate Now"** button to proceed to the donation page.

### **Donation Page**

- Enter your **name**, **email**, and the **amount** you wish to donate.
- Choose your payment method (PayPal or Credit card).
- Complete the payment process.

### **Invoice**

- After successful payment, an invoice will be sent to your email.

---

## **API Endpoints**

### **1. Create Order (PAYPAL'S DOCUMENTATION)**

- **Endpoint**: `POST /api/v1/orders`
- **Description**: Creates a new order for the donation.

### **2. Capture Order (PAYPAL'S DOCUMENTATION)**

- **Endpoint**: `POST /api/v1/orders/:orderID/capture`
- **Description**: Captures the payment for the specified order.

---

## **Dependencies**

### **Frontend**

- `PayPal SDK`

### **Backend**

- `@paypal/paypal-js`
- `@paypal/paypal-server-sdk`
- `express`
- `nodemailer`
- `dotenv`
- `body-parser`
- `cors`
- `helmet`
- `morgan`

---

## **Contributing**

Contributions are welcome! Follow these steps to contribute:

1. **Fork the repository.**
2. **Create a new branch**:
   ```bash
   git checkout -b feature/YourFeatureName
   ```
3. **Commit your changes**:
   ```bash
   git commit -m "Add some feature"
   ```
4. **Push to the branch**:
   ```bash
   git push origin feature/YourFeatureName
   ```
5. **Open a pull request.**

---

## **License**

This project is licensed under the **MIT License**. See the `LICENSE` file for more details.

---

## **Contact**

For any questions or feedback, please contact:

- **Name**: Malek Mostafa
- **Email**: [mailto:malekmostafa0051@gmail.com]
- **GitHub**: [https://github.com/01Malek01]

---

Thank you for visiting!
