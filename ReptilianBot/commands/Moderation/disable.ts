import { Command, Message } from '../../lib/interfaces';

const callback = async (msg: Message) => {
	if (!msg.guild) return;

	const settings =
		(await msg.client.database.guildSettings.findById(msg.guild.id)) ??
		(await msg.client.database.guildSettings.create({ _id: msg.guild.id, disabledChannels: [], blacklist: [], channelsToPrune: [] }));

	let m;
	if (settings.disabledChannels.includes(msg.channel.id)) {
		settings.disabledChannels.splice(settings.disabledChannels.indexOf(msg.channel.id), 1);
		m = msg.channel.send(`Successfully enabled commands in this channel`);
	} else {
		settings.disabledChannels.push(msg.channel.id);
		m = msg.channel.send(`Successfully disabled commands in this channel`);
	}

	void settings.save();

	return m;
};

export const command: Command = {
	aliases: [],
	description: 'Disable commands in this channel (bypassed by members with the `Manage Messages` permission',
	usage: '',
	argCount: 0,
	ownerOnly: false,
	guildOnly: true,
	botPermissions: [],
	userPermissions: ['MANAGE_CHANNELS'],
	callback
};
