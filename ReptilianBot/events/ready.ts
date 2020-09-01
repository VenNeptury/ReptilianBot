import { ReptilianClient } from '../lib/struct/ReptilianClient';

export default (client: ReptilianClient) => {
	client.logging.log('READY', `Logged in as ${client.user!.tag} (${client.user!.id})`);
	client.logging.log('READY', `Prefix: ${client.config.prefix}`);

	// void client.user?.setStatus('dnd');
	// void client.user?.setActivity({ name: 'h🌲h🌲', url: 'https://www.twitch.tv/leafylive', type: 'STREAMING' });
};
