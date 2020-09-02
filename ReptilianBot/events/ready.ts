import { ReptilianClient } from '../lib/struct/ReptilianClient';
import { TextChannel } from 'discord.js';

export default (client: ReptilianClient) => {
	for (const key in client.config.channels) {
		if (!['errors', 'messagelog', 'modlog'].includes(key)) continue;

		const channelID = (client.config.channels[key as keyof typeof client.config.channels] as unknown) as string;
		const channel = client.channels.cache.get(channelID);
		if (!channel || !(channel instanceof TextChannel)) {
			console.error(`Invalid or unreachable channel: ${channelID}`);
			process.exit(1);
		}
		client.config.channels[key as keyof typeof client.config.channels] = channel;
	}

	client.logging.log('READY', `Logged in as ${client.user!.tag} (${client.user!.id})`);
	client.logging.log('READY', `Prefix: ${client.config.prefix}`);

	// void client.user?.setStatus('dnd');
	void client.user?.setActivity({
		name: 'hisss | @ me for help',
		url: 'https://www.twitch.tv/leafylive',
		type: 'LISTENING'
	});
};
