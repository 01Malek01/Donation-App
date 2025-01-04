import app from "./app.js";

const port = process.env.PORT || 5000;

/**
 * Start the server on the specified port
 */
try {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
} catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
}
