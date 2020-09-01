import { ClientOptions as BaseOptions } from 'discord.js';

export interface ClientOptions {
	base?: BaseOptions;
	prefix: string;
	token: string;
	database: string;
	owners: string[];
}
