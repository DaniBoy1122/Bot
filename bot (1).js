const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals: { GoalBlock } } = require('mineflayer-pathfinder');
const { Vec3 } = require('vec3');

// Configure your bot's settings
const botUsername = 'YourBotName'; // Change this to your bot's name
const serverHost = 'your.server.ip'; // Replace with your server IP
const serverPort = 25565; // Change if using a custom port

function createBot() {
  const bot = mineflayer.createBot({
    host: serverHost,
    port: serverPort,
    username: botUsername,
  });

  bot.loadPlugin(pathfinder);

  // Log when the bot successfully logs in
  bot.on('login', () => {
    console.log(`✅ Bot ${botUsername} logged in`);
  });

  // Handle errors
  bot.on('error', (err) => {
    console.error(`⚠️ Bot error: ${err.message}`);
  });

  // Handle kicks
  bot.on('kicked', (reason) => {
    console.log(`❌ Bot was kicked: ${reason}`);
  });

  // Set up random movement
  bot.on('spawn', () => {
    console.log('🟢 Bot spawned in the world!');
    const defaultMove = new Movements(bot);
    bot.pathfinder.setMovements(defaultMove);

    function moveRandomly() {
      const x = bot.entity.position.x + (Math.random() * 10 - 5);
      const z = bot.entity.position.z + (Math.random() * 10 - 5);
      const y = bot.entity.position.y;
      bot.pathfinder.setGoal(new GoalBlock(x, y, z));
    }

    setInterval(moveRandomly, 5000); // Move every 5 seconds
  });

  // Reconnect on end
  bot.on('end', () => {
    console.log('🔄 Bot disconnected. Restarting in 10 seconds...');
    setTimeout(createBot, 10000);
  });
}

// Start the bot
createBot();
