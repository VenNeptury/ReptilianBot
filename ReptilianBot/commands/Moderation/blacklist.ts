import { Command, Message } from '../../lib/interfaces';

const callback = async (msg: Message, args: string[]) => {
	if (!msg.guild) return;
	const settings =
		(await msg.client.database.guildSettings.findById(msg.guild.id)) ??
		(await msg.client.database.guildSettings.create({ _id: msg.guild.id, blacklist: [], disabledChannels: [], channelsToPrune: [] }));

	const action = args.shift();
	if (!action) return msg.channel.send(msg.client.helpers.text.toCodeBlock(settings.blacklist.join('\n') || 'the blacklist is empty!'));

	let query = args.join(' ').toLowerCase();

	if (!query) return msg.channel.send('gimme some words to block lmao');

	const words = [];
	const re = /"([^"]+)"/g;
	let match;
	while ((match = re.exec(query))) {
		words.push(match[1]);
		query = query.replace(match[0], '');
	}
	query.split(/ +/).forEach(w => (w.length ? words.push(w) : void 0));

	if (action === 'add') {
		words.forEach(w => {
			if (!settings.blacklist.includes(w)) settings.blacklist.push(w);
		});
	} else if (action === 'remove') {
		words.forEach(w => {
			if (!w) return;
			if (settings.blacklist.includes(w)) settings.blacklist.splice(settings.blacklist.indexOf(w), 1);
		});
	} else return msg.channel.send('That is not a valid option!');

	void settings.save();
	msg.react('✅').catch(() => null);
};

export const command: Command = {
	aliases: [],
	description: 'Manage the blacklist',
	usage: '<add/remove/list> <words (multiple words that should be treated as one word need to be inside "" like "very bad word")>',
	argCount: 0,
	ownerOnly: false,
	guildOnly: true,
	botPermissions: [],
	userPermissions: ['MANAGE_GUILD'],
	callback
};
