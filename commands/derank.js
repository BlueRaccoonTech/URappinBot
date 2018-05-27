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

        // Define all roles.
        const cool = message.guild.roles.find('name', roleList.cool);
        const good = message.guild.roles.find('name', roleList.good);
        const bad = message.guild.roles.find('name', roleList.bad);
        const awful = message.guild.roles.find('name', roleList.awful);
        let coolToGood = false;
        // - Figure out the rank below theirs, then demote them to that rank.
        if(mentMember.roles.exists('name', roleList.cool)) {
            mentMember.removeRole(cool, `Violating rule #${args[1]}`);
            mentMember.addRole(good);
            coolToGood = true;
        } else if(mentMember.roles.exists('name', roleList.good)) {
            mentMember.removeRole(good, `Violating rule #${args[1]}`);
            mentMember.addRole(bad);
        } else if(mentMember.roles.exists('name', roleList.bad)) {
            mentMember.removeRole(bad, `Violating rule #${args[1]}`);
            mentMember.addRole(awful);
        } else if(mentMember.roles.exists('name', roleList.awful)) {
            // - If they're already on "U Chattin' Awful", just tell the staff member to ban them. Stop.
            return message.channel.send('**[ERROR]** Target user is already at the lowest rank, consider banning user.');
        } else {
            // - If they're not on *any* rank, inform the staff member of the issue. Stop.
            return message.channel.send('**[ERROR]** Target user doesn\'t have a role identifying their rank.\nI don\'t know what to demote them to!');
        }

        // - Send them a DM telling them they've been deranked and why.
        if(coolToGood) {
            mentMember.send(`Looks like you need a little help staying in-between the lines. Don't worry, I'm back~\n\n(You're being sent this message because you've been found to have violated the rules of the community.\nPlease refer to rule #${args[1]} at this link: ${rulesURL})`)
            .then(() => {
                if (message.channel.type !== 'dm') {
                    message.channel.send('Done! Please use ~rankup on the user in two weeks.');
                }
            })
            .catch(() => message.channel.send('**[ERROR]** Could not send a DM to the target member.'));
        } else {
            mentMember.send(`**GETTING WORSE.**\n\nYou're being sent this message because you've been found to have violated the rules of the community.\nPlease refer to rule #${args[1]} at this link: ${rulesURL}`)
            .then(() => {
                if (message.channel.type !== 'dm') {
                    message.channel.send('Done! Please use ~rankup on the user in two weeks.');
                }
            })
            .catch(() => message.channel.send('**[ERROR]** Could not send a DM to the target member.'));
        }
        // **POSSIBLE ALTERNATE** Post the derank publicly in #bot-warnings.
    },
};