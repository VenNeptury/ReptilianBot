import { ReptilianClient } from './lib/struct/ReptilianClient';

const client = new ReptilianClient({
	base: {
		disableMentions: 'all',
		partials: ['MESSAGE', 'GUILD_MEMBER', 'REACTION'],
		ws: {
			properties: {
				$browser: 'Discord iOS'
			}
		}
	},
	prefix: '$',
	database: process.env.DATABASE!,
	token: process.env.DISCORD_TOKEN!,
	owners: ['265560538937819137']
});

client.registerCommands().hookEvents().start();
