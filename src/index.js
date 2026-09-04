require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');
const { startScheduler } = require('./scheduler');

function validateEnvironment() {
    const requiredVariables = ['DISCORD_TOKEN', 'CHANNEL_ID'];
    const missingVariables = requiredVariables.filter((name) => !process.env[name]);

    if (missingVariables.length > 0) {
        throw new Error(`Environment variable belum diisi: ${missingVariables.join(', ')}`);
    }
}

validateEnvironment();

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.once('ready', (readyClient) => {
    console.log(`Bot berhasil login sebagai ${readyClient.user.tag}.`);
    startScheduler(readyClient);
});

client.on('error', (error) => {
    console.error('Discord client error:', error.message);
});

client.login(process.env.DISCORD_TOKEN).catch((error) => {
    console.error('Login Discord gagal:', error.message);
    process.exitCode = 1;
});