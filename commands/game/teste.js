const { SlashCommandBuilder} = require('discord.js')
const wait = require('node:timers/promises').setTimeout

module.exports = {
    data: new SlashCommandBuilder()
    .setName('teste')
    .setDescription('only test')
    .addStringOption(option =>
        option.setName('user')
            .setDescription('one user')),
    async execute(interaction) {
        if (interaction.commandName == 'teste') {
            let user1 = {id: interaction.user.id, number: 0}
            let user2 = {id: interaction.options.get('user').value, number: 0}
            let accept
            const message = await interaction.reply({
                content: `<@${user1.id}> Convidou <@${user2.id}> Para jogar`,
                fetchReply: true
            })
            await message.react('✅')
            await message.react('❎')
            await wait(3000)
            console.log(user2.id)
            const userReactions = message.reactions.cache.filter(reaction => reaction.users.cache.has(user2.id));
            try {
                for (const reaction of userReactions.values()) {
                    if(reaction._emoji.name === '✅') {
                        await message.reply(`<@${user2.id}> Aceitou`)
                        accept = 'yes'
                        break
                        //await message.channel.send('Hello')
                    }
                    if (reaction._emoji.name === '❎') {
                        accept = 'no'
                        await message.reply(`<@${user2.id}> Recusou`)
                        break
                    }
                }   
            } catch (error) {
                console.error(error);
            }
            if (accept === 'yes') {
                function getrandom(min, max) {
                    min = Math.ceil(min)
                    max = Math.floor(max)
                    return Math.floor(Math.random() * (max - min + 1)) + min
                  }
                await wait(1000)
                message.channel.send(`🎲🎲 Rolando os dados...`)
                while (true) {
                    await wait(2000)
                    user1.number = getrandom(1, 3)
                    user2.number = getrandom(1, 3)
                    if (user1.number > user2.number) {
                        message.channel.send(`<@${user1.id}> Ganhou!! Tirou ${user1.number} No dado, <@${user2.id}> Tirou ${user2.number} `)
                        break
                    }
    
                    if (user1.number < user2.number) {
                        message.channel.send(`<@${user2.id}> Ganhou!! Tirou ${user2.number} No dado, <@${user1.id}> Tirou ${user1.number}`)
                        break
                    }
    
                    else {
                        message.channel.send(`Os jogadores tiraram numeros iguais... jogando de novo 🎲 `)
                        await wait(4000)
                    }
                }
            }
            console.log('acabou')
        }
            
    }
}   