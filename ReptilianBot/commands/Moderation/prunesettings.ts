import { Command, Message } from '../../lib/interfaces';
import { emojis } from '../../lib/constants/emojis';

const callback = async (msg: Message, args: string[]) => {
	if (!msg.guild) return;

	const settings =
		(await msg.client.database.guildSettings.findById(msg.guild.id)) ??
		(await msg.client.database.guildSettings.create({ _id: msg.guild.id, blacklist: [], channelsToPrune: [], disabledChannels: [] }));

	let action = args.shift()?.toLowerCase() as 'add' | 'remove';
	if (!['add', 'remove'].includes((action as string | null) ?? '')) action = 'add' as 'add' | 'remove';

	const channels = msg.mentions.channels.filter(c => msg.guild!.channels.cache.has(c.id));

	if (action === 'add') {
		channels.forEach(c => {
			if (!settings.channelsToPrune.includes(c.id)) settings.channelsToPrune.push(c.id);
		});
	} else {
		channels.forEach(c => {
			if (settings.channelsToPrune.includes(c.id)) settings.channelsToPrune.splice(settings.channelsToPrune.indexOf(c.id), 1);
		});
	}

	void settings.save();
	msg.react(emojis.success).catch(() => null);
};

export const command: Command = {
	aliases: [],
	description: 'Add/Remove channels from the list of channels to be pruned',
	usage: '<add|remove> <#channel> [#channel ....]',
	argCount: 1,
	ownerOnly: false,
	guildOnly: false,
	botPermissions: [],
	userPermissions: ['MANAGE_CHANNELS'],
	callback
};
