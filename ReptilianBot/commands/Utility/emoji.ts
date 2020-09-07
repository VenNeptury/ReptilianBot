import { Command, Message } from '../../lib/interfaces';
import { regex } from '../../lib/constants/regex';

const callback = async (msg: Message, args: string[]) => {
	const emojis = regex.emotes.exec(args.join(' '));

	if (!emojis || !emojis.length) return msg.channel.send('You did not provide any valid emojis!');

	const urls = emojis.map(e => `<https://cdn.discordapp.com/emojis/${regex.snowflake.exec(e)![0]}.${e.startsWith('<a') ? 'gif' : 'png'}>`);

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
