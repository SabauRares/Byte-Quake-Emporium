const sql = require('mssql');
require('dotenv').config();
const bcrypt = require('bcrypt');
const { connect } = require('mongoose');


// Database configuration
const config = {
    server: 'localhost',
    database: 'ByteQuake', // Name of your database
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    options: {
        encrypt: true, // For Azure SQL Database, set to true
        trustServerCertificate: true // For self-signed certificates
    }
};

// Function to connect to the database
async function connectToDatabase() {
  try {
      // Connect to SQL Server
     const pool = await sql.connect(config);
     return pool;
  } catch (err) {
      console.error('Error connecting to database:', err.message);
      throw err; // Re-throw the error for handling in the caller
  }
}

// Function to fetch data from the Users table
async function getUsers() {
  try {
      // Query Users table
      const result = await sql.query`SELECT * FROM Users`;
      return result.recordset;
  } catch (err) {
      console.error('Error fetching data from Users table:', err.message);
      throw err; // Re-throw the error for handling in the caller
  }
}

// Function to fetch data from the Items table
async function getItems() {
  try {
      // Query Items table
      const result = await sql.query`SELECT * FROM Items`;
      return result.recordset;
  } catch (err) {
      console.error('Error fetching data from Items table:', err.message);
      throw err; // Re-throw the error for handling in the caller
  }
}

// Function to fetch data from the Orders table
async function getOrders() {
  try {
      // Query Orders table
      const result = await sql.query`SELECT * FROM Orders`;
      return result.recordset;
  } catch (err) {
      console.error('Error fetching data from Orders table:', err.message);
      throw err; // Re-throw the error for handling in the caller
  }
}

// Function to fetch data from the Order_Items table
async function getOrderItems() {
  try {
      // Query Order_Items table
      const result = await sql.query`SELECT * FROM Order_Items`;
      return result.recordset;
  } catch (err) {
      console.error('Error fetching data from Order_Items table:', err.message);
      throw err; // Re-throw the error for handling in the caller
  }
}

// Function to close the database connection
async function closeConnection() {
  try {
      // Close connection to SQL Server
      await sql.close();
  } catch (err) {
      console.error('Error closing database connection:', err.message);
      throw err; // Re-throw the error for handling in the caller
  }
}

// Call getUsers function from dbConnect.js
async function displayUsers() {
  try {
      await connectToDatabase();
      const users = await getUsers();
      console.log('Users:', users);
      closeConnection();
  } catch (err) {
      console.error('Error fetching users:', err.message);
  }
}

async function displayItems() {
  try {
      await connectToDatabase();
      const items = await getItems();
      // console.log('Items:', items);
      return items;
      // closeConnection();
  } catch (err) {
      console.error('Error fetching items:', err.message);
  }
}

async function displayItemByName(){
  try{
    await connectToDatabase();
    const item = await getItemByName();
    console.log(item);
    return item;
  }catch(err){
    console.error('Error fetching item:', err.message);
  }
}

async function displayOrders() {
  try {
      await connectToDatabase();
      const orders = await getOrders();
      console.log('Orders:', orders);
  } catch (err) {
      console.error('Error fetching orders:', err.message);
  }
}

async function displayOrderItems() {
  try {
      // await connectToDatabase();
      const orderItems = await getOrderItems();
      console.log('Order Items:', orderItems);
  } catch (err) {
      console.error('Error fetching order items:', err.message);
  }
} 

async function addUser(userData) {
  let pool;
  try {
    pool = await connectToDatabase();
    console.log(`Pool value is: ${pool}`);

     // Generate a random salt for password hashing
     const salt = await bcrypt.genSalt(10); // Adjust cost factor as needed
    //  console.log('Salt:', salt);
    //  console.log('Password:', userData.password);
     // Hash the password using bcrypt
     const hashedPassword = await bcrypt.hash(userData.password, salt);
        
        const result = await pool.query`INSERT INTO Users (username, email, mobile, password, address) 
        VALUES (${userData.username}, ${userData.email}, ${userData.mobile}, ${hashedPassword}, ${userData.address});
      `;

    // Include salt in the returned data for potential future use (optional)
    userData.password = hashedPassword;
    return userData;
  } catch (err) {
    console.error('Error adding user:', err.message);
    throw err; // Re-throw the error for handling in the caller
  } finally {
    if (pool) {
      await pool.close();
    }
  }
}

// Function to get user by username
async function getUserByUsername(username) {
  let pool;
  try {
    pool = await connectToDatabase();
    const result = await pool.query`
      SELECT * FROM Users WHERE username = ${username}
    `;
    return result.rows[0] || null; // Return item object or null if not found
  } catch (err) {
    throw err; // Re-throw the error for handling in the calling function
  }
}

// Function to get user by username
// async function getItemByName(name) {
//   try {
//     const pool = await connectToDatabase();
//     const result = await pool.request()
//     .input('name', name)
//     .query('SELECT * FROM Items WHERE name = @name');
    
//     // console.log(`SQL query executed: SELECT * FROM Items WHERE name = '${name}'`);
//     const item = result.recordset[0] || null; // Return user object or null if not found
//     // console.log(`item: ${item}`);
//     return item;
//   } catch (err) {
//     throw err; // Re-throw the error for handling in the calling function
//   }
// }

async function getItemByName(partialName) {
  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('partialName', sql.NVarChar, `%${partialName}%`)
      .query('SELECT * FROM Items WHERE name LIKE @partialName');

    const items = result.recordset; // Return array of items
    return items;
  } catch (err) {
    throw err; // Re-throw the error for handling in the calling function
  }
}

// Function to compare passwords
async function comparePasswords(password, hashedPassword) {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (err) {
    console.error('Error querying database:', err.message);
    throw err; // Re-throw the error for handling in the calling function
  }
}

async function loginUser(username, password) {
  try {
    const pool = await connectToDatabase();
    // Replace with your logic for fetching user by username (assuming a 'users' table)
    const user = await pool.request()
      .input('username', sql.VarChar, username)
      .query('SELECT * FROM users WHERE username = @username');

      // console.log(`User: ${user}`);
    // Replace with your password validation logic (assuming a 'password' field in the user table)
    // console.log(`User record for login: ${JSON.stringify(user.recordset[0])}`); 
    const isPasswordValid = await comparePasswords(password, user.recordset[0].password); // Assuming 'password' field in the user table
    // console.log(`Password Check: ${isPasswordValid}`);
    return { isValid: isPasswordValid, user: user.recordset[0] };
  } catch (err) {
    console.error(err.message);
  }
}

async function getConnectedUser(user_id){
  try{
    const pool = await connectToDatabase();
    // console.log(`Database pool: ${pool}`);
    // console.log(`User ID parameter: ${user_id}`);
    const user = await pool.request()
    .input('user_id', sql.Int, user_id)
    .query('SELECT * FROM users WHERE user_id = @user_id');
    
    // console.log(`Query result: ${JSON.stringify(user)}`);
   
    if(user.recordset.length === 0){
      return null;
    }
    // console.log(`User record: ${JSON.stringify(user.recordset[0])}`); 
    return user.recordset[0];
  }catch(err){
    console.log(err.message);
  }
}

async function getUserOrder(user_id){
  try{
  const pool = await connectToDatabase();
  const result = await pool.request()
  .input('user_id', sql.Int, user_id)
      .query(`
      SELECT 
      oi.order_id, 
      oi.item_id, 
      oi.quantity, 
      o.order_date, 
      o.total_amount,
      i.name as name,
      i.price as price
  FROM order_items oi
  JOIN orders o ON oi.order_id = o.order_id
  JOIN items i ON oi.item_id = i.item_id
  WHERE o.user_id = @user_id AND o.status = 'Pending'
      `);

      const order = result.recordset || null;
      return order;
  }catch(err){
    console.log(err.message);
  }
}

async function updateOrderStatusAndQuantities(order_id) {
  try {
    const pool = await connectToDatabase();

    // Start a transaction
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
      // Update order status to 'DONE'
      await transaction.request()
        .input('order_id', sql.Int, order_id)
        .query('UPDATE orders SET status = \'DONE\' WHERE order_id = @order_id');

      // Get all items in the order
      const orderItems = await transaction.request()
        .input('order_id', sql.Int, order_id)
        .query('SELECT item_id, quantity FROM order_items WHERE order_id = @order_id');

      // Update item quantities
      for (const item of orderItems.recordset) {
        await transaction.request()
            .input('item_id', sql.Int, item.item_id)
            .input('quantity', sql.Int, item.quantity)
            .query('UPDATE items SET stock_quantity = stock_quantity - @quantity WHERE item_id = @item_id');
    }

      // Commit transaction
      await transaction.commit();
      return { success: true, message: 'Order confirmed successfully' };
    } catch (err) {
      // Rollback transaction on error
      await transaction.rollback();
      throw new Error('Error confirming order: ' + err.message);
    }
  } catch (err) {
    throw new Error('Database connection error: ' + err.message);
  }
}

async function addItemToCart(user_id, item_id, quantity) {
  try {
    const pool = await connectToDatabase();

    // Start a transaction
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
      // Check if there is a pending order for the user
      const orderResult = await transaction.request()
        .input('user_id', sql.Int, user_id)
        .query(`
          DECLARE @order_id INT;

          -- Retrieve the order ID for the user
          SELECT @order_id = order_id
          FROM orders
          WHERE user_id = @user_id AND status = 'Pending';

          IF @order_id IS NULL
          BEGIN
              -- If no pending order exists, create a new order
              INSERT INTO orders (user_id, status) VALUES (@user_id, 'Pending');
              SELECT @order_id = SCOPE_IDENTITY(); -- Get the ID of the newly inserted order
          END

          SELECT @order_id AS order_id;
        `);

      const order_id = orderResult.recordset[0].order_id;

      // Insert the item into the order_items table
      const insertResult = await transaction.request()
        .input('order_id', sql.Int, order_id)
        .input('item_id', sql.Int, item_id)
        .input('quantity', sql.Int, quantity)
        .query(`
          INSERT INTO order_items (order_id, item_id, quantity) VALUES (@order_id, @item_id, @quantity);
        `);

      // Commit transaction
      await transaction.commit();
      
      return { success: true, message: 'Item added to cart successfully' };
    } catch (error) {
      // Rollback transaction on error
      await transaction.rollback();
      throw new Error('Error adding item to cart: ' + error.message);
    }
  } catch (error) {
    throw new Error('Database connection error: ' + error.message);
  }
}




// Export functions for external use
module.exports = {
  connectToDatabase,
  getUsers,
  getItems,
  getOrders,
  getOrderItems,
  closeConnection,
  displayUsers,
  displayItems,
  displayItemByName,
  displayOrders,
  displayOrderItems,
  getUserByUsername,
  getItemByName,
  comparePasswords,
  loginUser,
  addUser,
  getConnectedUser,
  getUserOrder,
  updateOrderStatusAndQuantities,
  addItemToCart
};
