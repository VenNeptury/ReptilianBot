import { ReptilianClient } from '../lib/struct/ReptilianClient';
import { GuildMember, TextChannel } from 'discord.js';

export default (client: ReptilianClient, member: GuildMember) => {
	if (Date.now() - member.user.createdTimestamp > 604800000) return;

	const embed = client.helpers.discord
		.embed('INFO')
		.setTitle('Suspicious member')
		.addFields([
			{ name: 'Member', value: `${member.toString()} ${member.user.tag} (${member.id})` },
			{
				name: 'Account Age',
				value: `${client.helpers.text.age(member.user.createdAt)} ago\n\n${client.helpers.text.formatDate(
					member.user.createdAt
				)} at ${client.helpers.text.formatTime(member.user.createdAt)}`
			}
		]);

	void (client.channels.cache.get('753612686918680617') as TextChannel | null)?.send(embed);
};
