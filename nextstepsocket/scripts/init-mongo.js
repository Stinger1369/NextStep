// Authentication
db.auth('root', 'rootpassword');

// Switch to the mychatdb database
db = db.getSiblingDB('mychatdb');

// Create a collection for messages
db.createCollection("messages");

// Insert sample messages
db.messages.insertMany([
  { sender: "user1", message: "Hello, this is a test message!" },
  { sender: "user2", message: "Hi there, testing MongoDB!" }
]);

// Create a collection for users
db.createCollection("users");

// Insert sample users
db.users.insertMany([
  { username: "user1", email: "user1@example.com", password: "password1" },
  { username: "user2", email: "user2@example.com", password: "password2" }
]);

// Create a collection for notifications
db.createCollection("notifications");

// Insert sample notifications
db.notifications.insertMany([
  { userId: "user1", message: "You have a new message" },
  { userId: "user2", message: "Your post received a like" }
]);

print("Database initialization completed.");
