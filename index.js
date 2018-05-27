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
        // Okay Bloated, how about a compromise?
        // My silly little error message only shows up if I'm the one who encounters the error. Everyone else gets a normal error message.
        if(message.author.id == '87801266440278016') {
            message.channel.send('**[ERROR]** OOPSIE WOOPSIE!! Uwu we made a fucky wucky!! A wittle fucko boingo!\nThe code monkeys at our headquarters are working VEWY HAWD to fix this!');
        } else {
            message.channel.send('**[ERROR]** Something unexpected happened when attempting to run the command.\nThe developer has been notified.');
        }
        const codemonkey = client.users.get('87801266440278016');
        codemonkey.send(`**[NOTICE**] A user has encountered an error upon attempting to launch a command.\n\nCommand name: ${commandName}\nArguments: ${args.toString()}`);
    }
});

client.login(token);