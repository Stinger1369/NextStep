// test.js
const { validateEmailDomain } = require("./index");

// Tests
const emailsToTest = [
  "user@gmail.com", // valid
  "user@temp-mail.org", // invalid
  "user@outlook.com", // valid
  "user@mailinator.com", // invalid
];

emailsToTest.forEach((email) => {
  try {
    const isValid = validateEmailDomain(email);
    console.log(`Email: ${email}, isValid: ${isValid}`);
  } catch (error) {
    console.error(`Error validating email ${email}:`, error.message);
  }
});
