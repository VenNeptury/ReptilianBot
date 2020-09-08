import { ReptilianClient, Message } from '../lib/struct/ReptilianClient';
import { stripIndents } from 'common-tags';
import { regex } from '../lib/constants/regex';
import { TextChannel } from 'discord.js';
import { GuildSettings } from '../Database/Schemas/GuildSettings';

export default async (client: ReptilianClient, potentiallyPartialMessage: Message) => {
	const msg = (potentiallyPartialMessage.partial as boolean)
		? await (potentiallyPartialMessage.fetch() as Promise<Message>).catch(() => null)
		: potentiallyPartialMessage;
	if (!msg) return;

	if (msg.author.bot || msg.author.system) return;

	if (!client.helpers.discord.checkPermissions(msg, ['SEND_MESSAGES', 'VIEW_CHANNEL'])) return;

	const settings = msg.guild ? await client.database.guildSettings.findById(msg.guild.id) : null;
	void filterMessage(msg, settings);

	const prefixRegex = new RegExp(`^(<@!?${client.user!.id}>|${client.config.prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\s*`);
	const matched = prefixRegex.exec(msg.content);
	const prefix = matched?.[0];

	if ((!prefix && msg.guild) || (prefix && !msg.content.startsWith(prefix))) return;

	if (!msg.content.replace(new RegExp(`<@!?${client.user!.id}>`), '').length)
		return msg.channel.send(stripIndents`
		My prefix is \`${msg.client.config.prefix}\`
        For a list of commands, type \`${msg.client.config.prefix}help\``);

	let args = msg.content
		.slice(prefix?.length ?? 0)
		.trim()
		.split(/ +/);

	let commandName = args.shift();
	if (!commandName) return;

	if (args.length === 1 && args[0].toLowerCase() === 'help') {
		args = [commandName];
		commandName = 'help';
	}

	const command = client.getCommand(commandName);
	if (!command) return;

	const force = msg.client.config.owners.includes(msg.author.id) && args[args.length - 1] === '--force';
	if (force) args.pop();
	else {
		if (command.ownerOnly && !msg.client.config.owners.includes(msg.author.id)) return;

		if (msg.guild) {
			if (settings?.disabledChannels.includes(msg.channel.id) && !msg.client.helpers.discord.checkPermissions(msg, ['MANAGE_MESSAGES'], msg.member!))
				return;
		} else if (command.guildOnly) return msg.channel.send(`This command can only be used on a server`);

		if (!msg.client.helpers.discord.checkPermissions(msg, command.userPermissions, msg.member!))
			return msg.channel.send('You are not permitted to use this command bro lmao');

		if (!msg.client.helpers.discord.checkPermissions(msg, command.botPermissions))
			return msg.channel.send('I do not have the necessary permissions to execute this command');

		if (args.length < command.argCount)
			return msg.channel.send(
				`This command requires ${command.argCount} arguments, but you only provided ${args.length}.\n\nUsage: \`${client.config.prefix}${command.name} ${command.usage}\``
			);
	}
	command
		.callback(msg, args)
		.then(r => client.emit('commandUsed', msg, command, r))
		.catch(e => /* client.emit('commandFailed', msg, command, e)*/ console.error(e));
};

export const filterMessage = (msg: Message, settings: GuildSettings | null) => {
	if (!(msg.channel instanceof TextChannel)) return;

	if (msg.channel.id === '752644127400919111' && !/^.*(brick|bricked|🧱|<:bricked:752642688230097108>)+.*$/.test(msg.content))
		return msg.delete().catch(() => null);

	if (regex.links.test(msg.content) && !(msg.channel.permissionsFor(msg.author) || msg.member?.permissions)?.has('EMBED_LINKS')) {
		void msg.reply('No links pls lol');
		return msg.delete().catch(() => null);
	}

	if (settings?.blacklist.length && new RegExp(settings.blacklist.filter(w => w.length).join('|'), 'gi').test(msg.content)) msg.delete().catch(() => null);

	if (msg.content.length > 1000) {
		void msg.reply("Lmao why so much text bro I ain't reading all that shit");
		return msg.delete().catch(() => null);
	}
};
