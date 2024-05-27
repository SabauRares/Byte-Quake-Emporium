module.exports = {
    secret: 'letstrythisnewth1ng', // Replace with a strong, random secret key
    resave: false, // Don't resave sessions that haven't changed
    saveUninitialized: true, // Create a session even if unmodified
    cookie: { secure: false,
    httpOnly: true } // Set to true for https environments
  };
  