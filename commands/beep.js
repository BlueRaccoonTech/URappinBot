module.exports = {
    name: 'beep',
    description: 'Boops your beeps!',
    args: false,
    guildOnly: false,
    execute(message, args) {
        message.channel.send('Boop!');
    },
};