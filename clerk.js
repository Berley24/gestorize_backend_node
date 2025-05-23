const { clerkClient } = require("../clerk");

const user = await clerkClient.users.getUser(userId);
console.log(user.firstName, user.lastName);
