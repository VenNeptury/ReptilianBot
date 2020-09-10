import { Command, Message } from '../../lib/interfaces';
import { TextChannel } from 'discord.js';

const callback = async (msg: Message) => {
	if (!msg.guild) return;
	const settings = await msg.client.database.guildSettings.findById(msg.guild.id);
	if (!settings || !settings.channelsToPrune.length) return msg.channel.send('Please add some channels to prune');

	const channels = msg.mentions.channels.size
		? msg.mentions.channels.filter(c => msg.guild!.channels.cache.has(c.id)).array()
		: (settings.channelsToPrune.map(c => msg.guild!.channels.cache.get(c)).filter(c => Boolean(c)) as TextChannel[]);

	if (!channels.length) return msg.channel.send(`Please add some channels to prune`);

	const role = msg.guild.roles.cache.get('696131018507288597');
	if (!role) return msg.channel.send('Invalid role lol');

	void msg.channel.send(`Now pruning:\n>>> ${channels.join('\n')}`);
	return msg.client.helpers.discord.pruneChannels(role, channels, settings);
};

export const command: Command = {
	aliases: [],
	description: '',
	usage: '',
	argCount: 0,
	ownerOnly: false,
	guildOnly: false,
	botPermissions: ['MANAGE_CHANNELS', 'MANAGE_ROLES'],
	userPermissions: ['MANAGE_CHANNELS'],
	callback
};
