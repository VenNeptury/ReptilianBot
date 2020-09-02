import { Command, Message } from '../../lib/interfaces';

const callback = async (msg: Message) => {
	const m = await msg.channel.send(`Pinging...`);
	const ping = m.createdTimestamp - msg.createdTimestamp;
	return m.edit(
		`Pong! \`${ping}ms\`${
			ping > 0 ? '' : '\n\nThis number is negative, since due to the nature of the Discord Api, my response was sent before your message.'
		}`
	);
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
