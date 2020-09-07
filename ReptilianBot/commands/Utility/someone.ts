import { Command, Message } from '../../lib/interfaces';

const callback = async (msg: Message) => {
	if (!msg.guild) return;

	const m = msg.guild.members.cache.random();

	return msg.channel.send(msg.client.helpers.discord.embed('BASIC').setDescription(`${m.toString()} - ${m.user.tag} (${m.user.id})`));
};

export const command: Command = {
	aliases: [],
	description: 'Get a random person',
	usage: '',
	argCount: 0,
	ownerOnly: false,
	guildOnly: false,
	botPermissions: [],
	userPermissions: [],
	callback
};
