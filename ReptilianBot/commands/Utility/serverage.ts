import { Command, Message } from '../../lib/interfaces';

const callback = async (msg: Message) => {
	if (!msg.guild) return;

	const d = msg.guild.createdAt;
	const h = msg.client.helpers.text;
	return msg.channel.send(`${h.formatDate(d)} ~ ${h.formatTime(d)} ~ ${h.age(d)} ago`);
};

export const command: Command = {
	aliases: ['guildage', 'sa', 'ga'],
	description: 'Check how old this server is',
	usage: '',
	argCount: 0,
	ownerOnly: false,
	guildOnly: false,
	botPermissions: [],
	userPermissions: [],
	callback
};
