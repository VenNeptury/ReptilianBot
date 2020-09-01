import { Message as BaseMessage } from 'discord.js';
import { ReptilianClient } from '../struct/ReptilianClient';

export interface Message extends BaseMessage {
	client: ReptilianClient;
}
