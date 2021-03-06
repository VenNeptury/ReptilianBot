/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-dynamic-delete */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
import { Client, Collection } from 'discord.js';
import { readdirSync } from 'fs';
import { LoggingService, LogLevel } from './LoggingService';
import { join } from 'path';
import { Discord, Web, text } from '../util/';
import { FullCommand, ClientOptions, Config } from '../interfaces/';
import Twit from 'twit';
import { Database } from '../../Database/index';
export * from '../interfaces';

export class ReptilianClient extends Client {
	public constructor(options: ClientOptions) {
		super(options.base);
		this.config = options as Config;
		this.twitter = new Twit(this.config.twitter);
	}

	public readonly config: Config;
	public readonly logging = new LoggingService(LogLevel.info);
	public readonly twitter: Twit;
	public readonly commands: Collection<string, FullCommand> = new Collection();
	public readonly lastMessage: Collection<string, string> = new Collection();
	public readonly database = new Database(this);
	public readonly helpers = {
		web: new Web(this),
		discord: new Discord(this),
		text
	};

	public getCommand(name: string) {
		return this.commands.get(name.toLowerCase()) ?? this.commands.find(c => c.aliases.includes(name.toLowerCase()));
	}

	public registerCommands() {
		let amount = 0;
		this.logging.log('INIT', 'Initialising commands', LogLevel.debug);
		const path = join(__dirname, '../../commands');
		readdirSync(path).forEach(folder => {
			readdirSync(join(path, folder)).forEach(file => {
				const fullPath = join(path, folder, file);
				this.logging.log('INIT', `Now importing command ${fullPath}`, LogLevel.debug);
				const command = require(fullPath).command;

				command.category = folder;
				command.name = file.replace(/\.[tj]s/, '');

				this.commands.set(command.name, command);
				delete require.cache[fullPath];
				amount++;
			});
		});

		this.logging.log('INIT', `Loaded ${amount.toString()} commands!`);
		return this;
	}

	public hookEvents() {
		let amount = 0;
		this.logging.log('INIT', 'Initialising events', LogLevel.debug);
		const path = join(__dirname, '../../events');
		readdirSync(path).forEach(file => {
			const fullPath = join(path, file);
			this.logging.log('INIT', `Now importing event ${fullPath}`, LogLevel.debug);
			const event = require(fullPath).default;

			this.on(file.replace(/\.[tj]s/, '') as any, event.bind(null, this));
			delete require.cache[fullPath];
			amount++;
		});
		this.logging.log('INIT', `Loaded ${amount.toString()} event listeners!`);
		return this;
	}

	public start() {
		void this.login(this.config.token);
		return this;
	}
}
