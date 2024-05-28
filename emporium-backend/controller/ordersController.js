const { updateOrderStatusAndQuantities, addItemToCart, removeItemFromCart } = require('../config/dbConnect'); // Adjust the import as necessary

const confirmOrder = async (req, res) => {
  const { order_id } = req.body; // Assuming order_id is passed in the request body

  try {
    const result = await updateOrderStatusAndQuantities(order_id);
    res.status(200).json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};


async function addToCart(req, res) {
    const { item_id, quantity } = req.body;
    const user_id = req.user_id; // Assuming user ID is set in req.user from authentication middleware
    // console.log(`user_id: ${user_id}`);
    try {
        const result = await addItemToCart(user_id, item_id, quantity);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error adding item to cart:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
}

async function handleRemoveItemFromCart(req, res) {
    const { item_id } = req.body;
    const user_id = req.user_id; // Assuming user ID is set in req.user from authentication middleware
    // console.log(`user_id: ${user_id}`);
    // console.log(`item_id: ${item_id}`);
    try {
        const result = await removeItemFromCart(user_id, item_id);
        // console.log(`result: ${result}`);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
  

module.exports = { confirmOrder, addToCart, handleRemoveItemFromCart };
