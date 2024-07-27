// index.js

const { Client, GatewayIntentBits, Events, EmbedBuilder } = require('discord.js');
const { token } = require('./config.json'); // Make sure to store your token securely

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences, // Ensure this is included
    ],
});

const ROLE_ID = 'REQUIREDROLEID'; // Replace with your required role ID

client.once(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setPresence({
        activities: [{ name: 'scflrlp.com/discord', type: 'PLAYING' }],
        status: 'online',
    });
});

client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;

    if (message.content.startsWith('-purge')) {
        if (message.member.roles.cache.has(ROLE_ID)) {
            const fetchedMessages = await message.channel.messages.fetch({ limit: 100 });
            await message.channel.bulkDelete(fetchedMessages);
            message.channel.send('All messages have been cleared!');
        } else {
            message.reply('You do not have the required role to use this command.');
        }
    } else if (message.content.startsWith('-quota')) {
        if (message.member.roles.cache.has(ROLE_ID)) {
            const embed = new EmbedBuilder()
                .setTitle('DHS - Quota')
                .setDescription('The quota for DEPNAME is NUMBER hours a week')
                .setColor('#0099ff');
            message.channel.send({ embeds: [embed] });
        } else {
            message.reply('You do not have the required role to use this command.');
        }
    } else if (message.content.startsWith('-terminate')) {
        if (message.member.roles.cache.has(ROLE_ID)) {
            const args = message.content.split(' ');
            const userId = args[1];
            const member = message.guild.members.cache.get(userId);

            if (member) {
                try {
                    await member.setNickname('Terminated');
                    message.channel.send(`User ${member.user.tag} has been terminated.`);
                } catch (error) {
                    console.error('Error terminating user:', error);
                    message.reply('There was an error terminating the user.');
                }
            } else {
                message.reply('User not found in this guild.');
            }
        } else {
            message.reply('You do not have the required role to use this command.');
        }
    } else if (message.content.startsWith('-kick')) {
        if (message.member.roles.cache.has(ROLE_ID)) {
            const member = message.mentions.members.first();
            if (member) {
                try {
                    await member.kick('Kicked by bot command');
                    message.channel.send(`${member.user.tag} has been kicked.`);
                } catch (error) {
                    console.error('Error kicking user:', error);
                    message.reply('There was an error kicking the user.');
                }
            } else {
                message.reply('Please mention a valid member.');
            }
        } else {
            message.reply('You do not have the required role to use this command.');
        }
    } else if (message.content.startsWith('-ban')) {
        if (message.member.roles.cache.has(ROLE_ID)) {
            const member = message.mentions.members.first();
            if (member) {
                try {
                    await member.ban({ reason: 'Banned by bot command' });
                    message.channel.send(`${member.user.tag} has been banned.`);
                } catch (error) {
                    console.error('Error banning user:', error);
                    message.reply('There was an error banning the user.');
                }
            } else {
                message.reply('Please mention a valid member.');
            }
        } else {
            message.reply('You do not have the required role to use this command.');
        }
    } else if (message.content.startsWith('-cmds')) {
        if (message.member.roles.cache.has(ROLE_ID)) {
            const embed = new EmbedBuilder()
                .setTitle('Available Commands')
                .setDescription(`
                    **-purge**: Clears all messages in the channel.
                    **-quota**: Displays the DEPNAME quota.
                    **-terminate @USER**: Changes the mentioned user's nickname to 'Terminated'.
                    **-kick @USER**: Kicks the mentioned user from the guild.
                    **-ban @USER**: Bans the mentioned user from the guild.
                `)
                .setColor('#0099ff');

            message.channel.send({ embeds: [embed] });
        } else {
            message.reply('You do not have the required role to use this command.');
        }
    }
});

client.login(token);
