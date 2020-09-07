import { Command, Message } from '../../lib/interfaces';

const callback = async (msg: Message, args: string[]) => {
	const user =
		msg.mentions.users.first()?.username ?? (await msg.client.users.fetch(args[0]).catch(() => null))?.username ?? (args.join(' ') || msg.author.username);

	const iq = user.toLowerCase().includes('xinto') || user.toLowerCase().includes('x1nto') ? 5 : Math.floor(Math.random() * 301);

	const embed = msg.client.helpers.discord.embed('BASIC').setTitle('IQ Machine').setDescription(`${user} has an IQ of **${iq}**`);

	return msg.channel.send(embed);
};

export const command: Command = {
	aliases: ['howsmart'],
	description: "Check someone's iq",
	usage: '',
	argCount: 0,
	ownerOnly: false,
	guildOnly: false,
	botPermissions: [],
	userPermissions: [],
	callback
};
