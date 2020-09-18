import { ReptilianClient } from '../lib/struct/ReptilianClient';
import { Message } from '../lib/interfaces';
import { filterMessage } from './message';

export default async (client: ReptilianClient, before: Message, after: Message) => {
	if (!after.guild || (before.partial as boolean) || before.guild?.id !== client.config.guild || before.content === after.content) return;

	filterMessage(after, await client.database.guildSettings.findById(after.guild.id));

	const embed = client.helpers.discord
		.embed('INFO', true)
		.setDescription(`[Jump to message](${before.url})`)
		.setTitle('Message updated')
		.addFields([
			{
				name: 'Before',
				value: before.client.helpers.text.shorten(before.content, 1024)
			},
			{
				name: 'After',
				value: after.client.helpers.text.shorten(after.content, 1024)
			},
			{
				name: 'Channel',
				value: before.channel
			},
			{
				name: 'Author',
				value: `${before.author.toString()} - ${before.author.tag} (${before.author.id})}`
			}
		]);

	void client.config.channels.messagelog.send(embed);
};
