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

	const role = msg.guild.roles.cache.get('750433152979173417');
	if (!role) return msg.channel.send('Invalid role lol');

	await msg.channel.send(`Now pruning:\n>>> ${channels.join('\n')}`);

	const m = await msg.channel.send(`Are you sure? [Y/N]`);
	const r = (await msg.channel.awaitMessages(m => m.author.id === msg.author.id, { max: 1, time: 1000 * 30 })).first();
	if (!r) return m.edit('The prompt ran out. Please run the command again.');

	if ('yes'.startsWith(r.content.toLowerCase())) {
		r.delete().catch(() => null);
		m.delete().catch(() => null);
	} else return m.edit(`Purge cancelled!`);

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
