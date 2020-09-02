import { ClientOptions as BaseOptions, TextChannel } from 'discord.js';

export interface ClientOptions {
	base?: BaseOptions;
	prefix: string;
	token: string;
	database: string;
	owners: string[];
	guild: string;
	channels: Record<'errors' | 'modlog' | 'messagelog', string | TextChannel>;
}

export interface Config extends ClientOptions {
	channels: Record<'errors' | 'modlog' | 'messagelog', TextChannel>;
}
