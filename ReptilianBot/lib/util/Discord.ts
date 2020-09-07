import { Message, ReptilianClient } from '../struct/ReptilianClient';
import { PermissionString, GuildMember, MessageEmbed, User, Role } from 'discord.js';

export class Discord {
	private readonly client: ReptilianClient;

	public constructor(client: ReptilianClient) {
		this.client = client;
	}

	public embed(category: 'INFO' | 'ERROR' | 'BASIC', timestamp = false) {
		const embed = new MessageEmbed().setColor('RANDOM');
		if (timestamp) embed.setTimestamp();

		return embed;
	}

	public checkPermissions(msg: Message, permissions: PermissionString[], member?: GuildMember) {
		if (!msg.guild) return true;

		if (!member) member = msg.guild.me as GuildMember | undefined;
		if (!member) return false;

		if (permissions.some(p => !member!.hasPermission(p))) return false;

		return true;
	}

	public isHigher(member1: GuildMember, member2: GuildMember) {
		return (
			member1.id === member1.guild.ownerID || (member2.id !== member2.guild.ownerID && member1.roles.highest.position > member2.roles.highest.position)
		);
	}

	public async getUser(msg: Message, args: string[], spot?: number) {
		const input = typeof spot === 'undefined' ? args.join(' ').toLowerCase() : args[spot].toLowerCase();

		const user = msg.mentions.users.first() ?? (await msg.client.users.fetch(input).catch(() => null));
		if (user) return user;

		const search = this.client.users.cache.filter(user => user.tag.toLowerCase().includes(input));
		if (search.size === 1) {
			return search.first();
		}
		if (!search.size) {
			void msg.channel.send(`I was not able to find a user matching your input. Please try again`);
			return null;
		}
		if (search.size < 11) {
			return this.prompt(msg, [...search.values()]);
		}
		void msg.channel.send(`I found too many (${search.size}) users matching your input. Please try again`);
		return null;
	}

	public async getMember(msg: Message, args: string[], spot?: number) {
		if (!msg.guild) throw new SyntaxError('GetMember was called in a dm!');

		const input = typeof spot === 'undefined' ? args.join(' ').toLowerCase() : args[spot].toLowerCase();

		const member = msg.mentions.members?.first() ?? (await msg.guild.members.fetch(input).catch(() => null));
		if (member) return member;

		const search = msg.guild.members.cache.filter(m => m.displayName.toLowerCase().includes(input) || m.user.tag.toLowerCase().includes(input));
		if (search.size === 1) {
			return search.first();
		}
		if (!search.size) {
			void msg.channel.send(`I was not able to find a member matching your input. Please try again`);
			return null;
		}
		if (search.size < 11) {
			return this.prompt(msg, [...search.values()]);
		}
		void msg.channel.send(`I found too many (${search.size}) members matching your input. Please try again`);
		return null;
	}

	private readonly getName = <T>(thing: T) =>
		thing instanceof GuildMember ? thing.user.tag : thing instanceof User ? thing.tag : thing instanceof Role ? thing.name : ((thing as unknown) as string);

	public async prompt<T>(msg: Message, choices: T[]) {
		if (choices.length > 10) throw new SyntaxError(`Too many choices: ${choices.length}`);

		const options = choices.map((opt, i) => ({ index: ++i, option: opt }));
		const m = await msg.channel.send(
			`Please choose one of the options below:\n>>> ${options.map(o => `${o.index.toString()} | ${this.getName(o.option)}`).join('\n')}`
		);
		const input = await (await msg.channel.awaitMessages((m: Message) => m.author.id === msg.author.id, { max: 1, time: 1000 * 30 })).first();
		if (!input) {
			void m.edit(`The time ran out, so I closed the prompt.`);
			return null;
		}
		const parsed = parseInt(input.content, 10);
		const choice = options.find(o => o.index === parsed)?.option;

		if (!choice) {
			void m.edit(`That was not a valid choice. Please try again`);
			return null;
		}

		if (m.deletable) void m.delete().catch(() => 0);
		return choice;
	}
}
