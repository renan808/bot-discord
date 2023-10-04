const { SlashCommandBuilder, EmbedBuilder} = require('discord.js')
const wait = require('node:timers/promises').setTimeout
const User = require('../../models/user')


module.exports = {
    data: new SlashCommandBuilder()
    .setName('jogar')
    .setDescription('convide algum membro do server para jogar')
    .addUserOption((option) =>
        option.setName('user')
            .setDescription('um usuario do sv'))
    .addNumberOption(option => 
        option.setName('aposta')
            .setDescription('Quantidade a ser apostada')
    ),
    async execute(interaction) {
        if (interaction.commandName == 'jogar') {
            let amount = interaction.options.get('aposta').value
            let user1 = {
                id: interaction.user.id,
                number: 0,
                name: interaction.user.username,
                avatar: interaction.user.avatarURL()
            }

            let user2 = {
                id: interaction.options.get('user').value,
                number: 0,
                name: interaction.options.get('user').user.username,
                avatar: interaction.options.get('user').user.avatarURL()
            }
            let accept = ''
            const message = await interaction.reply({
                content: `<@${user1.id}> Convidou <@${user2.id}> Para jogar Valendo R$${amount}`,
                fetchReply: true
            })
            const collectorFilter = (reaction, user) => {
                return ['✅', '❎'].includes(reaction.emoji.name) && user.id === user2.id
            };
            await message.react('✅')
            await message.react('❎')
            await message.awaitReactions({ filter: collectorFilter, max: 1, time: 30000, errors: ['time'] })
                .then(collected => {
                    const reaction = collected.first();
            
                    if (reaction.emoji.name === '✅') {
                        accept = 'yes'
                        message.reply('O jogador aceitou')
                        
                    } else {
                        wait(500)
                        message.reply('O jogador recusou')
                    }
                })
                .catch(collected => {
                    message.reply('Convite de jogo expirado');
                })
            await wait(1000)
            if (accept === 'yes') {
                let winner = undefined
                let loser = undefined
                function getrandom(min, max) {
                    min = Math.ceil(min)
                    max = Math.floor(max)
                    return Math.floor(Math.random() * (max - min + 1)) + min
                }
                await wait(500)
                message.channel.send(`🎲🎲 Rolando os dados...`)
                while (true) {
                    await wait(2000)
                    user1.number = getrandom(1, 6)
                    user2.number = getrandom(1, 6)
                    console.log(user1.number, user2.number)
                    if (user1.number > user2.number) {
                        winner = user1
                        loser = user2
                        break
                    }
    
                    if (user1.number < user2.number) {
                        winner = user2
                        loser = user1
                        break
                    }
    
                    if (user1.number === user2.number) {
                        message.channel.send(`Os jogadores tiraram numeros iguais... jogando de novo 🎲 `)
                        await wait(3000)
                    }
                }
                
                let userdb_win = await User.findOne({where: {id: winner.id}})


                
                if (!userdb_win) {
                    await User.create({
                        id: winner.id,
                        name: winner.name,
                        money: amount,
                        wins: 1
                    })
                }

                if (userdb_win) {
                    await User.update({money: userdb_win.money + amount},{
                        where: {
                            id: winner.id
                        }
                    })
                }

                const embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setThumbnail(winner.avatar)
                .setTitle('RESULTADO:')
                .setDescription(`O jogador <@${winner.id}> Ganhou!!`)
                .setURL('https://discord.js.org/')
                .addFields([
                    {
                        name: `${winner.name}`,
                        value: `Tirou ${winner.number}`,
                        inline: true
                    },
                    {
                        name: `${loser.name}`,
                        value: `Tirou ${loser.number}`,
                        inline: true
                    },
                    {
                        name: `Valor apostado:`,
                        value: `R$${amount}`
                    }
                ])
                message.channel.send({embeds: [embed]})

            }
            
        }
    }

}