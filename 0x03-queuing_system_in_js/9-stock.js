import express from "express";
import redis from "redis";
import { promisify } from "util";

const app = express();
const port = 1245;

// Create a Redis client
const client = redis.createClient();
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

// Sample product list
const listProducts = [
    { id: 1, name: "Suitcase 250", price: 50, stock: 4 },
    { id: 2, name: "Suitcase 450", price: 100, stock: 10 },
    { id: 3, name: "Suitcase 650", price: 350, stock: 2 },
    { id: 4, name: "Suitcase 1050", price: 550, stock: 5 }
];

// Get product by ID
function getItemById(id) {
    return listProducts.find((product) => product.id === id);
}

// Reserve stock in Redis
async function reserveStockById(itemId, stock) {
    await setAsync(`item.${itemId}`, stock);
}

// Get current reserved stock from Redis
async function getCurrentReservedStockById(itemId) {
    const reservedStock = await getAsync(`item.${itemId}`);
    return reservedStock ? parseInt(reservedStock, 10) : 0;
}

// Route to list all products
app.get("/list_products", (req, res) => {
    const response = listProducts.map((product) => ({
        itemId: product.id,
        itemName: product.name,
        price: product.price,
        initialAvailableQuantity: product.stock
    }));
    res.json(response);
});

// Route to get a product by ID
app.get("/list_products/:itemId", async (req, res) => {
    const { itemId } = req.params;
    const product = getItemById(parseInt(itemId, 10));

    if (!product) {
        return res.status(404).json({ status: "Product not found" });
    }

    const reservedStock = await getCurrentReservedStockById(product.id);
    const availableStock = product.stock - reservedStock;

    res.json({
        itemId: product.id,
        itemName: product.name,
        price: product.price,
        initialAvailableQuantity: product.stock,
        currentQuantity: availableStock
    });
});

// Route to reserve a product
app.get("/reserve_product/:itemId", async (req, res) => {
    const { itemId } = req.params;
    const product = getItemById(parseInt(itemId, 10));

    if (!product) {
        return res.status(404).json({ status: "Product not found" });
    }

    const reservedStock = await getCurrentReservedStockById(product.id);
    const availableStock = product.stock - reservedStock;

    if (availableStock <= 0) {
        return res.status(400).json({
            status: "Not enough stock available",
            itemId: product.id
        });
    }

    await reserveStockById(product.id, reservedStock + 1);

    res.json({
        status: "Reservation confirmed",
        itemId: product.id
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
