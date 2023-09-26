const { SlashCommandBuilder, Message} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder().setName('members').setDescription('mostra a quantidade de membros no sv'),
    async execute(interaction) {
       const { guild } = interaction
       const members = guild.members.cache
       await interaction.reply(members.size + ' Membros')
    }
}