const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands');

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on('ready', () => {
    console.log('Yeah, I know! I gotta believe!');
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;
    const command = client.commands.get(commandName);

    // Check if server-only command is used in a DM.
    if (command.guildOnly && message.channel.type !== 'text') {
        return message.reply('**[ERROR]** Command not available in DMs.\nPlease use this command in a server.');
    }
    // Check if arguments required and none used. If not, throw error and demonstrate usage (if possible.)
    if (command.args && !args.length) {
        let reply = '**[ERROR]** No arguments detected for command requiring arguments.';
        if (command.usage) {
            reply += `\nUsage: \`${prefix}${command.name} ${command.usage}\``;
        }
        return message.channel.send(reply);
    }
    // Check if staff required and member not staff. If so, throw error.
    if(command.requireStaff && (message.member.highestRole.name != ('Staff' || 'AlmostStaff' || 'MaybeStaff'))) {
        return message.channel.send('**[ERROR]** You\'re not a staff member.');
    }

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        // Hi BloatedC! I'm sure this is gonna be the first thing you change x3
        message.channel.send('**[ERROR]** OOPSIE WOOPSIE!! Uwu we made a fucky wucky!! A wittle fucko boingo!\nThe code monkeys at our headquarters are working VEWY HAWD to fix this!');
    }
});

client.login(token);