/* eslint-disable no-eval */
/* eslint-disable no-multi-assign */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command, Message } from '../../lib/interfaces';
import { stripIndents } from 'common-tags';

const callback = async (msg: Message, args: string[]) => {
	// @ts-ignore
	const [message, client, commands, database, guild, channel] = [msg, msg.client, msg.client.commands, msg.client.database, msg.guild, msg.channel];

	// Remove leading and ending white spaces
	let content = args.join(' ').replace(/^\s+/, '').replace(/\s*$/, '');

	// Remove code-blocks
	if (content.startsWith('```') && content.endsWith('```')) {
		content = content.substring(3, content.length - 3);
		if (content.startsWith('js') || content.startsWith('ts')) content = content.substr(2);
	}

	// Create a dummy console
	const console: any = {
		_lines: [],
		_logger(...things: string[]) {
			this._lines.push(...things.join(' ').split('\n'));
		},
		_formatLines() {
			return this._lines.join('\n');
		}
	};
	console.log = console.error = console.warn = console.info = console._logger.bind(console);

	let result;

	try {
		result = eval(content);
		// Is promise?
		if (result && typeof result.then === 'function') {
			result = await result;
		}
	} catch (err) {
		result = err;
	}

	if (typeof result !== 'string') result = require('util').inspect(result);

	const consoleOutput = console._formatLines() as string;
	let response = stripIndents`
		${msg.client.helpers.text.toCodeBlock(result, 'ts')}
	`;
	if (consoleOutput) response += `\nConsole Output:${msg.client.helpers.text.toCodeBlock(consoleOutput, 'ts')}`;

	if (response.length < 2000) return msg.channel.send(response);

	const haste = await msg.client.helpers.web.uploadHaste(result).catch(() => null);
	return msg.channel.send(
		`${haste ?? 'Failed uploading to hastebin.'}${consoleOutput ? `\n\nConsole Output:${msg.client.helpers.text.toCodeBlock(consoleOutput, 'ts')}` : ''}`
	);
};

export const command: Command = {
	aliases: [],
	description: '',
	usage: '',
	ownerOnly: true,
	guildOnly: false,
	argCount: 0,
	userPermissions: [],
	botPermissions: [],
	callback: callback
};
