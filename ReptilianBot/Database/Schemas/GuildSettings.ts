import { Document, Schema, model } from 'mongoose';

export interface GuildSettings extends Document {
	_id: string;
	disabledChannels: string[];
	blacklist: string[];
}

const guildSettingsSchema = new Schema<GuildSettings>({
	_id: String,
	disabledChannels: [String],
	blacklist: [String]
});

export default model<GuildSettings>('GuildSettings', guildSettingsSchema);
