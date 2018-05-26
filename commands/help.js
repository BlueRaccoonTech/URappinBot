const { prefix } = require('../config.json');
module.exports = {
    name: 'help',
    description: 'List all of my commands or info about a specific command.',
    usage: '[command name]',
    execute(message, args) {
        const { commands } = message.client;
        const data = [];

        if (!args.length) {
            data.push('Here\'s a list of all of my commands:');
            data.push(commands.map(command => command.name).join(', '));
            data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);
        } else {
            if (!commands.has(args[0])) {
                return message.reply('**[ERROR]** You\'re asking for help for a command that doesn\'t exist.');
            }
            const command = commands.get(args[0]);
            data.push(`**Name:** ${command.name}`);
            if (command.description) data.push(`**Description:** ${command.description}`);
            // if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
            if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);
        }
        message.author.send(data, { split: true })
            .then(() => {
                if (message.channel.type !== 'dm') {
                    message.channel.send('Sent you a DM!');
                }
            })
            .catch(() => message.reply('**[ERROR]** My DM failed to reach you!'));
    },
};