import { Command, Message } from '../../lib/interfaces';

const callback = async (msg: Message, args: string[]) => {
	const user =
		msg.mentions.users.first()?.username ?? (await msg.client.users.fetch(args[0]).catch(() => null))?.username ?? (args.join(' ') || msg.author.username);

	const halalLevel = Math.floor(Math.random() * 101);

	const barLevel = Math.round(halalLevel / 5);
	const bar = `\`Halal\` ${'-'.repeat(barLevel)}🔵${'-'.repeat(20 - barLevel)} \`Haram\``;

	const embed = msg.client.helpers.discord.embed('BASIC').setTitle(`Halal Meter`).setDescription(`${user} is ${halalLevel}% haram. \n${bar}`);

	return msg.channel.send(embed);
};

export const command: Command = {
	aliases: ['halal', 'howharam', 'haram'],
	description: 'Find out how halal something is',
	usage: '',
	argCount: 0,
	ownerOnly: false,
	guildOnly: false,
	botPermissions: [],
	userPermissions: [],
	callback
};
