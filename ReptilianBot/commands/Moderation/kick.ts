import { Command, Message } from '../../lib/interfaces';
import { TextChannel } from 'discord.js';

const callback = async (msg: Message, args: string[]) => {
	const member = await msg.client.helpers.discord.getMember(msg, args, 0);
	if (!member) return;

	const reason = args.slice(1).join('') || 'No reason provided';

	if (!msg.client.helpers.discord.isHigher(msg.member!, member)) return msg.channel.send('You are not permitted to kick this member.');
	if (!member.kickable) return msg.channel.send('I am unable to kick this member.');

	const embed = msg.client.helpers.discord
		.embed('INFO', true)
		.setTitle('Kick')
		.setDescription(`You have been kicked from \`${msg.guild!.name}\``)
		.addFields([
			{ name: 'Reason', value: reason },
			{ name: 'Moderator', value: `${msg.author.tag} (${msg.author.id})` }
		]);

	const m = await member.send(embed).catch(() => null);

	const success = await member.kick().catch(() => null);
	if (!success) m?.delete().catch(() => null);

	embed.setDescription(`${member.user.tag} has been kicked!`);
	void msg.channel.send(embed.description!);

	void (msg.guild?.channels.cache.get(msg.client.config.channels.modlog) as TextChannel | null)?.send(
		embed.addField('Member', `${member.user.tag} (${member.user.id})`)
	);
};

export const command: Command = {
	aliases: [],
	description: 'Kick a member',
	usage: '<User> [Reason]',
	argCount: 1,
	ownerOnly: false,
	guildOnly: true,
	botPermissions: ['KICK_MEMBERS'],
	userPermissions: ['KICK_MEMBERS'],
	callback
};
