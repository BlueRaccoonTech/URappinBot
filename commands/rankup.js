const { prefix, roleList } = require('../config.json');
module.exports = {
    name: 'rankup',
    description: '**[STAFF ONLY]** Increases user\'s rank.',
    usage: '<user>',
    args: true,
    guildOnly: true,
    requireStaff: true,
    execute(message, args) {
        // - If they gave an invalid number of arguments, throw an error. Stop.
        if(args.length > 2) {
            return message.channel.send(`**[ERROR]** Invalid number of arguments.\nUsage: \`${prefix}${this.name} ${this.usage}\``);
        }
        // - If they're not in the server, throw an error. Stop.
        const mentMember = message.mentions.members.first();
        if (mentMember === undefined) {
            return message.channel.send('**[ERROR]** Either you forgot to mention a user, or you mentioned\na user that isn\'t in this server. A for effort, though!');
        }
        // Define all roles.
        const cool = message.guild.roles.find('name', roleList.cool);
        const good = message.guild.roles.find('name', roleList.good);
        const bad = message.guild.roles.find('name', roleList.bad);
        const awful = message.guild.roles.find('name', roleList.awful);
        let goodToCool = false;
        let rankURL = null;
        let newRole = null;
        // - Figure out the rank above theirs, then promote them to that rank.
        if(mentMember.roles.exists('name', roleList.cool)) {
            return message.channel.send('**[ERROR]** Target user is as cool as they can get!');
        } else if(mentMember.roles.exists('name', roleList.good)) {
            mentMember.removeRole(good);
            mentMember.addRole(cool);
            goodToCool = true;
        } else if(mentMember.roles.exists('name', roleList.bad)) {
            mentMember.removeRole(bad);
            mentMember.addRole(good);
            rankURL = 'https://i.imgur.com/b3LPpxn.png';
            newRole = roleList.good;
        } else if(mentMember.roles.exists('name', roleList.awful)) {
            mentMember.removeRole(awful);
            mentMember.addRole(bad);
            rankURL = 'https://i.imgur.com/4hOE8Ua.png';
            newRole = roleList.bad;
        } else {
            // - If they're not on *any* rank, inform the staff member of the issue. Stop.
            return message.channel.send('**[ERROR]** Target user doesn\'t have a role identifying their rank.\nI don\'t know what to promote them to!');
        }

        // - Send them a DM telling them they've been ranked up. and why.
        if(goodToCool) {
            const embed = {
                'title': 'Woah man, you\'re __way__ too cool for me to moderate!',
                'description': 'I\'ve gotta take care of some other members!',
                'color': 14782,
                'timestamp': new Date(),
                'footer': {
                    'icon_url': 'https://cdn.discordapp.com/attachments/305797485769523202/319251953827840000/unknown.png',
                    'text': 'From the Parappa the Rapper 2 Modding Community',
                },
                'thumbnail': {
                    'url': 'https://i.imgur.com/eg6GRxf.png',
                },
                'fields': [
                    {
                        'name': 'Congratulations!',
                        'value': `If you're reading this, you've been ranked up to **${roleList.cool}** in our community. With this comes 24/7 access to #shitposts, as well as other features we may add in the future!\n\nTo stay in **${roleList.cool}**, just make sure you continue to follow our community guidelines and continue to stay active.`,
                    },
                ],
            };
            mentMember.send({ embed })
            .then(() => {
                if (message.channel.type !== 'dm') {
                    message.channel.send('Done!');
                }
            })
            .catch(() => message.channel.send('**[ERROR]** Could not send a DM to the target member.'));
        } else {
            const embed = {
                'title': 'Getting better!',
                'description': `Enough time has elapsed from your previous infraction to allow you to rank back up to **${newRole}**.`,
                'color': 238337,
                'timestamp': new Date(),
                'footer': {
                  'icon_url': 'https://cdn.discordapp.com/attachments/305797485769523202/319251953827840000/unknown.png',
                  'text': 'From the Parappa the Rapper 2 Modding Community',
                },
                'thumbnail': {
                  'url': rankURL,
                },
              };
            mentMember.send({ embed })
            .then(() => {
                if (message.channel.type !== 'dm') {
                    message.channel.send('Done! If they were on rank Awful, please use ~rankup again on them in another two weeks.');
                }
            })
            .catch(() => message.channel.send('**[ERROR]** Could not send a DM to the target member.'));
        }
    },
};