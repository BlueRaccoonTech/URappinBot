module.exports = {
    name: 'user-info',
    description: 'Returns information about the user.',
    args: false,
    guildOnly: false,
    execute(message, args) {
        message.channel.send(`Your user ID, ${message.author.username}, is ${message.author.id}.`);
    },
};