import { Command, Message } from '../../lib/interfaces';
import { regex } from '../../lib/constants/regex';

const callback = async (msg: Message, args: string[]) => {
	const emojis = [];
	const re = regex.emotesG;
	let match;

	while ((match = re.exec(args.join(' ')))) emojis.push({ id: match[3], animated: Boolean(match[1]) });

	if (!emojis.length) return msg.channel.send('You did not provide any valid emojis!');

	const urls = emojis.map(e => `<https://cdn.discordapp.com/emojis/${e.id}.${e.animated ? 'gif' : 'png'}>`);

	const result = urls.length > 1 ? urls.join('\n') : urls[0].replace(/[<>]/g, '');

	return msg.channel.send(result.length > 2000 ? "That's too many emojis lmao" : result).catch(console.log);
};

export const command: Command = {
	aliases: ['e'],
	description: "Get an emoji's url",
	usage: '<Emojis>',
	argCount: 1,
	ownerOnly: false,
	guildOnly: false,
	botPermissions: [],
	userPermissions: [],
	callback
};
