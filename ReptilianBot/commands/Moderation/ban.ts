import { Command, Message } from '../../lib/interfaces';

const callback = async (msg: Message, args: string[]) => {
	const member = await msg.client.helpers.discord.getMember(msg, args, 0);
	if (!member) return;

	const reason = args.slice(1).join('') || 'No reason provided';

	if (!msg.client.helpers.discord.isHigher(msg.member!, member)) return msg.channel.send('You are not permitted to ban this member.');
	if (!member.bannable) return msg.channel.send('I am unable to ban this member.');

	const embed = msg.client.helpers.discord
		.embed('INFO', true)
		.setTitle('Ban')
		.setDescription(`You have been banned from \`${msg.guild!.name}\``)
		.addFields([
			{ name: 'Reason', value: reason },
			{ name: 'Moderator', value: `${msg.author.tag} (${msg.author.id})` }
		]);

	const m = await member.send(embed).catch(() => null);

	const success = await member.ban().catch(() => null);
	if (!success) m?.delete().catch(() => null);

	embed.setDescription(`${member.user.tag} has been banned!`);
	void msg.channel.send(embed.description!);

	void msg.client.config.channels.modlog.send(embed.addField('Member', `${member.user.tag} (${member.user.id})`));
};

export const command: Command = {
	aliases: [],
	description: 'Ban a member',
	usage: '<User> [Reason]',
	argCount: 1,
	ownerOnly: false,
	guildOnly: true,
	botPermissions: ['BAN_MEMBERS'],
	userPermissions: ['BAN_MEMBERS'],
	callback
};
