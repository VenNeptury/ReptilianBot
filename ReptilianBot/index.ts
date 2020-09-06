/* eslint-disable @typescript-eslint/naming-convention */
import { ReptilianClient } from './lib/struct/ReptilianClient';
import { TextChannel } from 'discord.js';

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
		messagelog: '750508237215760454'
		// tweets: '750423581229580379'
	},
	twitter: {
		consumer_key: process.env.TWT_API_KEY!,
		consumer_secret: process.env.TWT_API_SECRET!,
		access_token: process.env.TWT_ACCESS_TOKEN!,
		access_token_secret: process.env.TWT_ACCESS_SECRET!
	}
});

const tweeters = [
	{ id: '1249350606122143746', channel: '750423581229580379', message: 'New Leafy tweet lol' }
	// { id: '872683897', channel: '751466995970605147', message: 'What is up, DramaAlert nation?  }
];
const ids = tweeters.map(t => t.id);

client
	.registerCommands()
	.hookEvents()
	.start()
	.twitter.stream('statuses/filter', { follow: ids })
	.on('tweet', tweet => {
		const tweeter = tweeters.find(t => t.id === tweet.user.id_str);
		if (!tweeter || !tweet.user?.screen_name || !tweet.id_str) return;

		void (client.channels.cache.get(tweeter.channel) as TextChannel | null)?.send(
			`${tweeter.message} https://twitter.com/${tweet.user.screen_name as string}/status/${tweet.id_str as string}`
		);
	});
