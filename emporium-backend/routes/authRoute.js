const express = require('express');
const router = express.Router();
const {addUser,errorHandler} = require('../middlewares/errorHandler'); // Assuming middleware.js is in the same directory
const { handleLogin, addUserToDatabase,getConnectedUserData, getConnectedUserOrders } = require('../controller/userController');
const { DisplayAllItems, DisplaySpecificItem } = require('../controller/itemsController');
const { validateToken } = require('../middlewares/JWT');
const { confirmOrder, addToCart, handleRemoveItemFromCart } = require('../controller/ordersController');

// Route to add a new user
router.post('/register', addUserToDatabase); 
router.post('/login', handleLogin);
router.get('/allItems', DisplayAllItems);
router.get('/search', DisplaySpecificItem);
router.get('/profile',validateToken ,getConnectedUserData);
router.get('/order',validateToken ,getConnectedUserOrders);
router.post('/checkout', confirmOrder);
router.post('/addToCart', validateToken,addToCart);
router.post('/removeFromCart', validateToken, handleRemoveItemFromCart);

module.exports = router;
