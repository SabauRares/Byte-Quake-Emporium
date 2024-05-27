const express = require('express');
const router = express.Router();
const {addUser,errorHandler} = require('../middlewares/errorHandler'); // Assuming middleware.js is in the same directory
const { handleLogin, addUserToDatabase,getConnectedUserData, getConnectedUserOrders } = require('../controller/userController');
const { DisplayAllItems, DisplaySpecificItem } = require('../controller/itemsController');
const { validateToken } = require('../middlewares/JWT');
const { confirmOrder, addToCart } = require('../controller/ordersController');

// Route to add a new user
router.post('/register', addUserToDatabase); 
// router.post('/login', async (req, res) => {
//     const { username, password } = req.body; // Assuming data is sent in JSON body
  
//     if (!username || !password) {
//       return res.status(400).json({ error: 'Username and password are required' });
//     }
  
//     try {
//       await loginUser(username, password, req, res);
//     } catch (err) {
//       console.error(err.message);
//       return res.status(500).json({ error: 'Server error' });
//     }
//   });

router.post('/login', handleLogin);
router.get('/allItems', DisplayAllItems);
router.get('/search', DisplaySpecificItem);
router.get('/profile',validateToken ,getConnectedUserData);
router.get('/order',validateToken ,getConnectedUserOrders);
router.post('/checkout', confirmOrder);
router.post('/addToCart', addToCart);

module.exports = router;
