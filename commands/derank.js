const { rules, rulesURL } = require('../ruleset.json');
const { prefix } = require('../config.json');
module.exports = {
    name: 'derank',
    description: '[STAFF ONLY] Warns a user for bad behavior and de-ranks them.',
    usage: '<user> <rule> [message]',
    args: true,
    guildOnly: true,
    execute(message, args) {
        // Since I barely have any sort of grasp as to what I'm doing, I'm first going to "program" this in comments.

        // - If the user submitting this command is not staff, throw an error. Stop.

        // - If they gave an invalid number of arguments, throw an error. Stop.
        if(args.length < 2 || args.length > 3) {
            return message.channel.send(`[ERROR] Invalid number of arguments.\nUsage: \`${prefix}${this.name} ${this.usage}\``);
        }

        // - If they're not in the server, throw an error. Stop.

        // - If the rule number isn't valid, throw an error. Stop.
        if(args[1] < 1 || args[1] > 10) {
            // ;-; i'm hardcoding the rule numbers here, this feels wrong
            return message.channel.send('[ERROR] That\'s not a rule.');
        }
        // - If they're already on "U Chattin' Awful", just tell the staff member to ban them. Stop.
        // - If they're not on *any* rank, inform the staff member of the issue. Stop.
        // - If they're on a non-awful rank, figure out the rank below theirs, then demote them to that rank.
        // - Send them a DM telling them they've been deranked and why.
        // **POSSIBLE ALTERNATE** Post the derank publicly in #bot-warnings.
        // - Figure out what the day two weeks from now is.
        // - Send staff member a message telling them that the action was successful and to use ~rankup on user two weeks from now.

        message.channel.send('[ERROR] Command not functional yet, please try again later.');
    },
};