import { Command, Message } from '../../lib/interfaces';
import { stripIndents } from 'common-tags';
import { emojis } from '../../lib/constants/emojis';

const callback = async (msg: Message, args: string[]) => {
	const dev = msg.client.config.owners.includes(msg.author.id);
	const prefix = msg.client.config.prefix;

	if (args.length) {
		const command = msg.client.getCommand(args.join('').toLowerCase());
		if (!command) return msg.channel.send(`That's not a valid command`);

		if (command.ownerOnly && !dev) return;

		const output = msg.client.helpers.discord
			.embed('INFO')
			.setTitle(prefix + command.name)
			.addFields([
				{ name: 'Description', value: command.description || 'No description provided' },
				{
					name: 'Usage',
					value: `\`\`\`${prefix}${command.name}${command.usage ? ` ${command.usage}` : ''}\`\`\``
				},
				{ name: 'Aliases', value: command.aliases.join(', ') || `${command.name} has no aliases.` }
			])
			.setDescription(
				stripIndents`
				Cooldown: ${command.cooldown ? `\`${command.cooldown}s\`` : emojis.fail}
				Guild only: ${command.guildOnly ? emojis.success : emojis.fail}
				Requires arguments: ${command.argCount || emojis.fail}
				Requires Permissions: ${command.userPermissions.map(p => msg.client.helpers.text.toTitleCase(p)).join(', ') || emojis.fail}
		`
			);

		return msg.channel.send(output);
	}
	const commands: Record<string, Array<string>> = {};

	msg.client.commands.forEach(cmd => {
		if (cmd.ownerOnly && !dev) return;

		if (!(commands[cmd.category] as any)) commands[cmd.category] = [];
		commands[cmd.category].push(`\`${prefix}${cmd.name}\` - ${cmd.description || 'No description provided'}`);
	});

	const output = msg.client.helpers.discord
		.embed('INFO')
		.setTitle('Help Menu')
		.setDescription(`For more info on a specific command, type \`${prefix}help command\`!`)
		.addFields(Object.keys(commands).map(key => ({ name: key, value: commands[key].join('\n') })));

	return msg.channel.send(output);
};

export const command: Command = {
	aliases: ['h', 'helpme'],
	description: '',
	usage: 'You are here ;)',
	ownerOnly: false,
	guildOnly: false,
	argCount: 0,
	userPermissions: [],
	botPermissions: [],
	callback
};
