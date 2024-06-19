// controllers/wishlistController.js
const {  addItemToWishlist, moveToCart, removeItemFromWishlist, addItemToCart} = require('../config/dbConnect');

async function addToWishlist(req, res) {
    const { item_id } = req.body;
    const user_id = req.user_id;  

    try {
        const result = await addItemToWishlist(user_id, item_id);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error adding item to wishlist:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
}

async function removeFromWishlist(req, res) {
    const { wish_item_id } = req.body;

    try {
        const result = await removeItemFromWishlist(wish_item_id);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error removing item from wishlist:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
}

async function moveWishToCart(req, res) {
    const { wish_item_id } = req.body;
    const user_id = req.user_id;  // Assuming req.user.id contains the authenticated user's ID

    try {
        const result = await moveToCart(user_id, wish_item_id, addItemToCart);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error moving item to cart:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports = {
    addToWishlist,
    removeFromWishlist,
    moveWishToCart
};
