const { rules, rulesURL } = require('../ruleset.json');
const { prefix, roleList } = require('../config.json');
module.exports = {
    name: 'derank',
    description: '**[STAFF ONLY]** Warns a user for bad behavior and de-ranks them.',
    usage: '<user> <rule>',
    args: true,
    guildOnly: true,
    requireStaff: true,
    execute(message, args) {
        // - If they gave an invalid number of arguments, throw an error. Stop.
        if(args.length < 2 || args.length > 3) {
            return message.channel.send(`**[ERROR]** Invalid number of arguments.\nUsage: \`${prefix}${this.name} ${this.usage}\``);
        }
        // - If they're not in the server, throw an error. Stop.
        const mentMember = message.mentions.members.first();
        if (mentMember === undefined) {
            return message.channel.send('**[ERROR]** Either you forgot to mention a user, or you mentioned\na user that isn\'t in this server. A for effort, though!');
        }
        // - If the rule number isn't valid, throw an error. Stop.
        if(args[1] < 1 || args[1] > Object.keys(rules).length) {
            return message.channel.send('**[ERROR]** That\'s not a rule.');
        }
        // - If they're already on "U Chattin' Awful", just tell the staff member to ban them. Stop.
        if(mentMember.roles.exists('name', roleList.awful)) {
            return message.channel.send('**[ERROR]** Target user is already at the lowest rank, consider banning user.');
        }
        // - If they're not on *any* rank, inform the staff member of the issue. Stop.
        if((!mentMember.roles.exists('name', roleList.cool)) && (!mentMember.roles.exists('name', roleList.good)) && (!mentMember.roles.exists('name', roleList.bad))) {
            return message.channel.send('**[ERROR]** Target user doesn\'t have a role identifying their rank.\nI don\'t know what to demote them to!');
        }

        // - Figure out the rank below theirs, then demote them to that rank.
        // - Send them a DM telling them they've been deranked and why.
        // **POSSIBLE ALTERNATE** Post the derank publicly in #bot-warnings.
        // - Figure out what the day two weeks from now is.
        // - Send staff member a message telling them that the action was successful and to use ~rankup on user two weeks from now.

        message.channel.send('**[ERROR]** Command not functional yet, please try again later.');
    },
};