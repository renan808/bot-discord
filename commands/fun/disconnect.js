const { SlashCommandBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('disconnect')
    .setDescription('disconnect'),
    async execute(interaction) {
        await interaction.guild.members.cache.forEach(member => {
            let m = member.voice.channel

            if (m) {
                member.voice.disconnect()
            }
        });
        interaction.reply('ok')
    }
}
