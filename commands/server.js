module.exports = {
    name: 'server',
    description: 'Returns information about the server.',
    args: false,
    guildOnly: true,
    execute(message, args) {
        message.channel.send(`This server's name is: ${message.guild.name}, and it has ${message.guild.memberCount} members in it.\nIt was created on ${message.guild.createdAt} and runs on the ${message.guild.region} Discord server.`);
    },
};