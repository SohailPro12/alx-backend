const express = require('express');
const redis = require('redis');
const { promisify } = require('util');



const listProducts = [
    { id: 1, name: 'Suitcase 250', price: 50, stock: 4 },
    { id: 2, name: 'Suitcase 450', price: 100, stock: 10 },
    { id: 3, name: 'Suitcase 650', price: 350, stock: 2 },
    { id: 4, name: 'Suitcase 1050', price: 550, stock: 5 }
];

function getItemById(id) {
    return listProducts.find(item => item.id === id);
}


const app = express();
const port = 1245;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
app.get('/list_products', (req, res) => {
    const productList = listProducts.map(item => {
        return {
            itemId: item.id,
            itemName: item.name,
            price: item.price,
            initialAvailableQuantity: item.stock
        };
    });
    res.json(productList);
});
app.get('/list_products/:itemId', async (req, res) => {
    const itemId = parseInt(req.params.itemId);
    const item = getItemById(itemId);
    if (!item) {
        res.status(404).json({ error: 'Item not found' });
        return;
    }
    const currentReservedStock = await getCurrentReservedStockById(itemId);
    const currentQuantity = item.stock - currentReservedStock;
    const productInfo = {
        itemId: item.id,
        itemName: item.name,
        price: item.price,
        initialAvailableQuantity: item.stock,
        currentQuantity: currentQuantity
    };
    res.json(productInfo);
});
app.get('/reserve_product/:itemId', async (req, res) => {
    const itemId = parseInt(req.params.itemId);
    const item = getItemById(itemId);
    if (!item) {
        res.status(404).json({ status: 'Product not found' });
        return;
    }
    const currentReservedStock = await getCurrentReservedStockById(itemId);
    const currentQuantity = item.stock - currentReservedStock;
    if (currentQuantity <= 0) {
        res.status(400).json({ status: 'Not enough stock available', itemId: itemId });
        return;
    }
    reserveStockById(itemId, 1);
    res.json({ status: 'Reservation confirmed', itemId: itemId });
});
// Create Redis client
const client = redis.createClient();

// Promisify Redis commands
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

// Function to reserve stock by item ID
function reserveStockById(itemId, stock) {
    const key = `item.${itemId}`;
    setAsync(key, stock);
}

// Async function to get current reserved stock by item ID
async function getCurrentReservedStockById(itemId) {
    const key = `item.${itemId}`;
    const reservedStock = await getAsync(key);
    return reservedStock;
}

// Example usage
reserveStockById(1, 2); // Reserve 2 stock for item with ID 1
getCurrentReservedStockById(1).then(reservedStock => {
    console.log(`Current reserved stock for item with ID 1: ${reservedStock}`);
});