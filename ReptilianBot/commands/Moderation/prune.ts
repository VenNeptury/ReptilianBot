import { Command, Message } from '../../lib/interfaces';
import { regex } from '../../lib/constants/regex';
import { Message as BaseMessage, DMChannel } from 'discord.js';

const filters = {
	links: (msg: BaseMessage) => regex.links.test(msg.content),
	bots: (msg: BaseMessage) => msg.author.bot,
	attachments: (msg: BaseMessage) => Boolean(msg.attachments.size),
	emojis: (msg: BaseMessage) => regex.emotes.test(msg.content) || regex.emojis.test(msg.content),
	member: (msg: BaseMessage, id: string) => msg.author.id === id,
	text: (msg: BaseMessage, text: string) => msg.content.toLowerCase().includes(text.toLowerCase())
};
const callback = async (msg: Message, args: string[]) => {
	if (msg.channel instanceof DMChannel) return;

	const query = args.join(' ');
	const amountRaw = /\d+/.exec(query)?.[0];
	const amount = amountRaw ? parseInt(amountRaw, 10) : 20;

	let messages = await msg.channel.messages.fetch({ limit: amount > 100 ? 100 : amount }).catch(() => null);
	if (!messages) return msg.channel.send(`Something went wrong while fetching messages`);

	messages = messages.filter(m => !m.pinned);

	new RegExp(Object.keys(filters).join('|'), 'ig').exec(query)?.forEach(match => (messages = messages!.filter(filters[match as keyof typeof filters])));

	const snowflake = regex.snowflake.exec(query);
	if (snowflake) messages = messages.filter(msg => filters.member(msg, snowflake[0]));

	const text = /"(.+)"/.exec(query);
	if (text) messages = messages.filter(msg => filters.text(msg, text[1]));

	if (!messages.size) return msg.channel.send("I didn't find any messages matching your query!");

	const success = await msg.channel.bulkDelete(messages, true).catch(() => null);
	if (!success) return msg.channel.send("I wasn't able to prune the messages!");

	void msg.channel.send(`Successfully pruned ${messages.size.toString()} messages.`).then(m => m.delete({ timeout: 5000 }).catch(() => null));
};

export const command: Command = {
	aliases: ['purge', 'nuke', 'delete'],
	description: 'Prune messages',
	usage: '[Amount (defaults to 20)] [Filters: Links | Bots | Attachments | Emojis | Mention/UserID | "text to delete here"]',
	argCount: 0,
	ownerOnly: false,
	guildOnly: true,
	botPermissions: ['MANAGE_MESSAGES'],
	userPermissions: ['MANAGE_MESSAGES'],
	callback
};
