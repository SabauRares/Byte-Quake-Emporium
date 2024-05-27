const { updateOrderStatusAndQuantities, addItemToCart } = require('../config/dbConnect'); // Adjust the import as necessary

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


const addToCart = async (req, res) => {
    const { item_id, quantity } = req.body; // Assuming user_id, item_id, and quantity are passed in the request body
    const user_id = req.user_id;
    try {
      const result = await addItemToCart(user_id, item_id, quantity);
      res.status(200).json(result);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Server error' });
    }
  };
  

module.exports = { confirmOrder, addToCart };
