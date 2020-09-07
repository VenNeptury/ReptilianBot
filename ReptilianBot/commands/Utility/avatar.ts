import { Command, Message } from '../../lib/interfaces';
import { AllowedImageFormat, ImageSize } from 'discord.js';
import { stripIndents } from 'common-tags';

const callback = async (msg: Message, args: string[]) => {
	const user = args.length ? await msg.client.helpers.discord.getUser(msg, args) : msg.author;
	if (!user) return;

	const formats: AllowedImageFormat[] = ['webp', 'png', 'jpg', 'jpeg'];
	if (user.displayAvatarURL({ dynamic: true }).includes('gif')) formats.push('gif');

	const sizes: ImageSize[] = [16, 32, 64, 128, 256, 512, 1024, 2048, 4096];

	const embed = msg.client.helpers.discord
		.embed('INFO')
		.setTitle(`${user.username}'s Avatar`)
		.setImage(user.displayAvatarURL({ size: 2048, dynamic: true })!)
		.setDescription(
			stripIndents`
			    ${formats.map(f => `[${f}](${user.displayAvatarURL({ size: 2048, format: f })})`).join(' | ')}
			    ${sizes.map(s => `[${s}](${user.displayAvatarURL({ size: s, dynamic: true })})`).join(' | ')}
			`
		);
	return msg.channel.send(embed);
};

export const command: Command = {
	aliases: ['av', 'pfp', 'icon'],
	description: "Check someone's avatar",
	usage: '[Member]',
	argCount: 0,
	ownerOnly: false,
	guildOnly: false,
	botPermissions: [],
	userPermissions: [],
	callback
};
