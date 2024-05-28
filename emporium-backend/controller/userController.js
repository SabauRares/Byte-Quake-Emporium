const { addUser,loginUser, getConnectedUser, getUserOrder } = require('../config/dbConnect');
const { createToken, validateToken } = require('../middlewares/JWT');

// Function to add a new user to the database
const addUserToDatabase = async (req, res, next) => {
    try {
      const userData = req.body;
      const newUser = await addUser(userData);
      res.status(201).json(newUser);
    } catch (err) {
      console.error(err); // Log the error for debugging
      res.status(500).json({ error: 'Error adding user' });
    }
  };

const handleLogin = async(req, res) => {
  const { username, password } = req.body;
  
    try {
      const { isValid, user } = await loginUser(username, password, req, res);
    // console.log(`User: ${username}`);
    // console.log(`isPAsswordValid: ${isPasswordValid}`);
    if (!isValid) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }
      // Express-session attempt
      // req.session.userId = user.user_id; // Assuming 'id' field in the user table
      // req.session.cookie.maxAge = 1000 * 60 * 60 * 24; // Expires in 24 hourss
      const accessToken = createToken(user);
      res.cookie("access-token", accessToken,{
        maxAge: 60 * 60 * 24 * 1000 * 30,
        httpOnly: true
      });
      return res.status(200).json({ message: 'Login successful', userData: user });
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Server error' });
    }
}

const getConnectedUserData = async (req,res) => {
  // Express-session
  // if(!req.session.userId){
  //   console.log(`request user id: ${req.session.userId}`);
  //   return res.status(401).json({ error: 'No user connected' });
  // }
    
  try{
    const user = await getConnectedUser(req.user_id);
    // console.log(req.session.userData)
    if(!user){
      return res.status(404).json({error: 'No user found'});
    }
    return res.status(200).json(user);
  }catch(err){
    console.error(err.message);
    return res.status(500).json({ error: 'Server error' });
  }
}

const getConnectedUserOrders = async(req, res) => {
  try{
    const userOrder = await getUserOrder(req.user_id);
    // console.log(`userOrderID: ${req.user_id}`);
    // console.log(`userOrder: ${userOrder}`);
    if(!userOrder){
      return res.status(404).json({error: 'No order found'});
    }
    return res.status(200).json(userOrder);
  }catch(err){
    console.error(err.message);
    return res.status(500).json({ error: 'Server error' });
  }
}
  

module.exports = { addUserToDatabase, loginUser,handleLogin,getConnectedUserData, getConnectedUserOrders};
