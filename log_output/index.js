// Create random code when starting
const randomCode = Math.random().toString(36).substring(2, 15);
console.log("Started! Code:", randomCode);

// Print code every 5 seconds
setInterval(() => {
    const now = new Date().toISOString();
    console.log(`${now}: ${randomCode}`);
}, 5000);

// Keep running
process.stdin.resume();
