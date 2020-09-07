import { Command, Message } from '../../lib/interfaces';

const callback = async (msg: Message, args: string[]) => {
	const user = args.length ? await msg.client.helpers.discord.getUser(msg, args) : msg.author;
	if (!user) return;

	const d = user.createdAt;
	const h = msg.client.helpers.text;
	return msg.channel.send(`${h.formatDate(d)} ~ ${h.formatTime(d)} ~ ${h.age(d)} ago`);
};

export const command: Command = {
	aliases: ['ua'],
	description: "Check someone's account age",
	usage: '[User (defaults to self)]',
	argCount: 0,
	ownerOnly: false,
	guildOnly: false,
	botPermissions: [],
	userPermissions: [],
	callback
};
