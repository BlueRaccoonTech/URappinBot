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
        // - Figure out the rank above theirs, then promote them to that rank.
        if(mentMember.roles.exists('name', roleList.cool)) {
            return message.channel.send('**[ERROR]** Target user is about as cool as they can get!');
        } else if(mentMember.roles.exists('name', roleList.good)) {
            mentMember.removeRole(good);
            mentMember.addRole(cool);
            goodToCool = true;
        } else if(mentMember.roles.exists('name', roleList.bad)) {
            mentMember.removeRole(bad);
            mentMember.addRole(good);
        } else if(mentMember.roles.exists('name', roleList.awful)) {
            mentMember.removeRole(awful);
            mentMember.addRole(bad);
        } else {
            // - If they're not on *any* rank, inform the staff member of the issue. Stop.
            return message.channel.send('**[ERROR]** Target user doesn\'t have a role identifying their rank.\nI don\'t know what to promote them to!');
        }

        // - Send them a DM telling them they've been ranked up. and why.
        if(goodToCool) {
            mentMember.send('Woah, man, you\'re **way** too cool for me to moderate!\nI gotta go handle some other members.\n\n**You are now rank COOL!**')
            .then(() => {
                if (message.channel.type !== 'dm') {
                    message.channel.send('Done!');
                }
            })
            .catch(() => message.channel.send('**[ERROR]** Could not send a DM to the target member.'));
        } else {
            mentMember.send('**GETTING BETTER!**\n\nYou\'re being sent this message because enough time has passed from your previous infraction for it to be forgiven.')
            .then(() => {
                if (message.channel.type !== 'dm') {
                    message.channel.send('Done! If they were on rank Awful, please use ~rankup again on them in another two weeks.');
                }
            })
            .catch(() => message.channel.send('**[ERROR]** Could not send a DM to the target member.'));
        }
    },
};