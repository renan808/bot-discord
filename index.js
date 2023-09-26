const {Client, Collection, GatewayIntentBits, VoiceStateManager} = require('discord.js')

const path = require('path')
const fs = require('fs')
const token = require('./config.json')
const client = new Client({intents: [
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates
]})

// make bot to load all commands
const foldersPath = path.join(__dirname, 'commands')
const commandFolders = fs.readdirSync(foldersPath) //get all folders
client.commands = new Collection()


for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder) // get one folder in commands
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))
    
    // for each file
    for (const file of commandFiles) {
        const filepath = path.join(commandsPath, file)
        const command = require(filepath)
    
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command)
        } else {
            console.log(`[WARNING] The command at ${filepath} is missing a required "data" or "execute" property.`);
        }
    }
}

//read events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(token.token)