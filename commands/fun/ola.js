const { SlashCommandBuilder} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder().setName('user').setDescription('send hello'),
    async execute(interaction) {
        await interaction.reply('Ola ' + interaction.user.username)
    } 
}