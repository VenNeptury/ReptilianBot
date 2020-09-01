import { PermissionString, Message as BaseMessage } from 'discord.js';
import { Message } from '.';

export interface Command {
	cooldown?: number;
	aliases: string[];
	description: string;
	usage: string;
	argCount: number;
	guildOnly: boolean;
	ownerOnly: boolean;
	userPermissions: PermissionString[];
	botPermissions: PermissionString[];
	callback(msg: Message, args: string[]): Promise<BaseMessage | void>;
}

export interface FullCommand extends Command {
	cooldown: number;
	name: string;
	category: string;
}
