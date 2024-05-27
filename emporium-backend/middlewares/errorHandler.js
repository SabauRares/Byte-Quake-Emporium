// middleware.js
const { addUserToDatabase } = require('../controller/userController');

// const addUser = async (req, res, next) => {
//   try {
//     const userData = req.body;
//     const newUser = await addUserToDatabase(userData);
//     res.status(201).json(newUser);
//   } catch (err) {
//     console.error(err); // Log the error for debugging
//     res.status(500).json({ error: 'Error adding user' });
//   }
// };

function errorHandler(err, req, res, next) {
    console.error(err.stack); // Log the error stack for debugging
  
    if (res.headersSent) {
      return next(err); // Let other error handlers handle it if response already sent
    }
  
    res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
  }

module.exports = {errorHandler}
