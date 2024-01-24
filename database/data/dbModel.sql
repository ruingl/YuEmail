-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT NOT NULL CHECK(email LIKE '%@yuemail.com%'),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME
);

-- Trigger for updating updatedAt in users table
CREATE TRIGGER update_users_updatedAt
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
    UPDATE users SET updatedAt = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Create emails table
CREATE TABLE IF NOT EXISTS emails (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender TEXT NOT NULL,
    recipient TEXT NOT NULL,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME
);

-- Trigger for updating updatedAt in emails table
CREATE TRIGGER update_emails_updatedAt
AFTER UPDATE ON emails
FOR EACH ROW
BEGIN
    UPDATE emails SET updatedAt = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;