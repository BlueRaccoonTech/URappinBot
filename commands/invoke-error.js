module.exports = {
    name: 'invoke-error',
    description: '**[DEBUG ONLY]** Throws an error. Intended only to test reporting mechanisms.',
    guildOnly: false,
    execute(message, args) {
        const fgsfds = message.author.roles.first().toString();
        // Everything beyond this will never be reached. I just want my linter to stop bugging me :V
        message.channel.send(`${fgsfds} ${args}`);
    },
};