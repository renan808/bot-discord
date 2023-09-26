const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		await client.user.setStatus('invisible')
		console.log(`Ready! Logged in as ${client.user.tag}`);
		
	},
};