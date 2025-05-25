const { clerkClient } = require("../clerk");

const user = await clerkClient.users.getUser(userId);
console.log(user.firstName, user.lastName);

// src/clerk.js
// const { Clerk } = require('@clerk/clerk-sdk-node');

// const clerkClient = Clerk({
//   apiKey: process.env.CLERK_SECRET_KEY, // sua chave secreta do painel da Clerk
// });

// module.exports = { clerkClient };
