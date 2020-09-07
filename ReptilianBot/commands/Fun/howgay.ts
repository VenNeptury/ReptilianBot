import { Command, Message } from '../../lib/interfaces';

const callback = async (msg: Message, args: string[]) => {
	const user =
		msg.mentions.users.first()?.username ?? (await msg.client.users.fetch(args[0]).catch(() => null))?.username ?? (args.join(' ') || msg.author.username);

	const percentage = Math.floor(Math.random() * 101);
	const barAmount = Math.round(percentage / 10);
	const bar = '▰'.repeat(barAmount) + '▱'.repeat(10 - barAmount);

	const embed = msg.client.helpers.discord.embed('BASIC').setTitle('Gay rater 100™️').setDescription(`${user} is ${percentage}% gay\n${bar}`);

	return msg.channel.send(embed);
};

export const command: Command = {
	aliases: ['gay', 'hg', 'gayrate'],
	description: 'Find out how gay something is',
	usage: '',
	argCount: 0,
	ownerOnly: false,
	guildOnly: false,
	botPermissions: [],
	userPermissions: [],
	callback
};
