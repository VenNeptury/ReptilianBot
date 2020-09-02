import { ReptilianClient } from '../lib/struct/ReptilianClient';
import { Message } from '../lib/interfaces/';

export default (client: ReptilianClient, msg: Message) => {
	if ((msg.partial as boolean) || msg.guild?.id !== client.config.guild || !msg.content) return;

	const embed = client.helpers.discord
		.embed('INFO', true)
		.setTitle('Message deleted')
		.addFields([
			{
				name: 'Content',
				value: msg.client.helpers.text.shorten(msg.content, 1024)
			},
			{
				name: 'Channel',
				value: msg.channel
			},
			{
				name: 'Author',
				value: `${msg.author.toString()} - ${msg.author.tag} (${msg.author.id})}`
			}
		]);

	void client.config.channels.messagelog.send(embed);
};
