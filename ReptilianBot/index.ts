/* eslint-disable @typescript-eslint/naming-convention */
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
	owners: ['265560538937819137'],
	guild: '750423432172142674',
	channels: {
		errors: '695788085681586273',
		modlog: '750485749039628299',
		messagelog: '750508237215760454',
		tweets: '750429096051474504'
	},
	twitter: {
		consumer_key: process.env.TWT_API_KEY!,
		consumer_secret: process.env.TWT_API_SECRET!,
		access_token: process.env.TWT_ACCESS_TOKEN!,
		access_token_secret: process.env.TWT_ACCESS_SECRET!
	}
});

const tweeterId = '1249350606122143746';

client
	.registerCommands()
	.hookEvents()
	.start()
	.twitter.stream('statuses/filter', { follow: tweeterId })
	.on('tweet', tweet => {
		if (tweet.user.id_str !== tweeterId || !tweet.user?.screen_name || !tweet.id_str) return;

		void client.config.channels.tweets.send(`Leafy just tweeted! https://twitter.com/${tweet.user.screen_name as string}/status/${tweet.id_str as string}`);
	});
