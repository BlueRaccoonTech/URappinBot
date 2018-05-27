const { rules, rulesURL, appealURL } = require('../ruleset.json');
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
        let newRank = null;
        let rankURL = null;
        let rdownMsg = 'Getting worse.';
        // - Figure out the rank below theirs, then demote them to that rank.
        if(mentMember.roles.exists('name', roleList.cool)) {
            mentMember.removeRole(message.guild.roles.find('name', roleList.cool), `Violating rule #${args[1]}`);
            mentMember.addRole(message.guild.roles.find('name', roleList.good));
            newRank = roleList.good;
            rankURL = 'https://i.imgur.com/b3LPpxn.png';
            rdownMsg = 'Uh-oh. Looks like you need some help. I\'m here for ya~';
        } else if(mentMember.roles.exists('name', roleList.good)) {
            mentMember.removeRole(message.guild.roles.find('name', roleList.good), `Violating rule #${args[1]}`);
            mentMember.addRole(message.guild.roles.find('name', roleList.bad));
            newRank = roleList.bad;
            rankURL = 'https://i.imgur.com/4hOE8Ua.png';
        } else if(mentMember.roles.exists('name', roleList.bad)) {
            mentMember.removeRole(message.guild.roles.find('name', roleList.bad), `Violating rule #${args[1]}`);
            mentMember.addRole(message.guild.roles.find('name', roleList.awful));
            newRank = roleList.awful;
            rankURL = 'https://i.imgur.com/4MBqQAY.png';
        } else if(mentMember.roles.exists('name', roleList.awful)) {
            // - If they're already on "U Chattin' Awful", just tell the staff member to ban them. Stop.
            return message.channel.send('**[ERROR]** Target user is already at the lowest rank, consider banning user.');
        } else {
            // - If they're not on *any* rank, inform the staff member of the issue. Stop.
            return message.channel.send('**[ERROR]** Target user doesn\'t have a role identifying their rank.\nI don\'t know what to demote them to!');
        }

        // - Send them a DM telling them they've been deranked and why.
        const embed = {
            'title': rdownMsg,
            'description': 'Hello. You\'re receiving this message because you\'ve violated one of the rules in the Parappa the Rapper 2 Modding Community.',
            'color': 12451840,
            'timestamp': new Date(),
            'footer': {
              'icon_url': 'https://cdn.discordapp.com/attachments/305797485769523202/319251953827840000/unknown.png',
              'text': 'From the Parappa the Rapper 2 Modding Community',
            },
            'thumbnail': {
              'url': rankURL,
            },
            'fields': [
              {
                'name': `Rule #${args[1]}`,
                'value': `_${rules[(args[1])]}_`,
              },
              {
                'name': 'Our Decision',
                'value': `You are officially being warned for your actions in our community. As such, we are demoting you to "${newRank}". Further violations of our rules will result in more severe punishments.`,
              },
              {
                'name': 'Rules and Appealing Our Decision',
                'value': `The rules for our server can be found [here](${rulesURL}). It is highly suggested that you re-read these rules in full, as you will be expected to conform to them.\n\nIf, after reading through our rules, you feel like this decision was unjust, please submit an appeal [at this link](${appealURL}).`,
              },
            ],
          };
        mentMember.send({ embed })
            .then(() => {
                if (message.channel.type !== 'dm') {
                    message.channel.send('Done! Please use ~rankup on the user in two weeks (if applicable).');
                }
            })
            .catch(() => message.channel.send('**[ERROR]** Could not send a DM to the target member.'));
        // **POSSIBLE ALTERNATE** Post the derank publicly in #bot-warnings.
    },
};