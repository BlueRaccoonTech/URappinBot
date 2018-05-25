module.exports = {
    name: 'ping',
    description: 'Ping!',
    args: false,
    guildOnly: false,
    execute(message, args) {
        message.channel.send('Pong.');
    },
};