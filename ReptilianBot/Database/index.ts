import mongoose, { Connection } from 'mongoose';
import guildSettings from './Schemas/GuildSettings';
import { ReptilianClient } from '../lib/struct/ReptilianClient';

export class Database {
	private readonly client: ReptilianClient;
	public constructor(client: ReptilianClient) {
		this.client = client;

		void mongoose.connect(process.env.DATABASE!, {
			useCreateIndex: true,
			useNewUrlParser: true,
			useFindAndModify: false,
			useUnifiedTopology: true
		});
		this.connection = mongoose.connection;

		this.connection.on('error', console.error);

		this.connection.once('open', () => this.client.logging.log('Database', `Connected to MongoDB Atlas at ${this.connection.name}!`));
	}

	public connection: Connection;
	public models = {
		guildSettings
	};

	public fetch = {
		guildSettings: async (id: string) =>
			(await this.models.guildSettings.findById(id)) ??
			this.models.guildSettings.create({ _id: id, blacklist: [], channelsToPrune: [], disabledChannels: [] })
	};
}
