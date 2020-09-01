import { Command, Message } from '../../lib/interfaces';

const callback = async (msg: Message) => {
	const m = await msg.channel.send(`Pinging...`);
	return m.edit(`Pong! \`${m.createdTimestamp - msg.createdTimestamp}ms\``);
};

export const command: Command = {
	aliases: ['ms'],
	description: 'Check my ping',
	usage: '',
	argCount: 0,
	ownerOnly: false,
	guildOnly: false,
	botPermissions: [],
	userPermissions: [],
	callback
};
