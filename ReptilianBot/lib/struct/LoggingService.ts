export class LoggingService {
	private logLevel: LogLevel = LogLevel.info;

	public setLevel(level: LogLevel) {
		this.logLevel = level;
		return this;
	}

	public constructor(level: LogLevel) {
		this.setLevel(level);
	}

	public log(source: string, message: string, level: LogLevel = LogLevel.info) {
		if (level > this.logLevel) return;

		const date = new Date();
		console.log(`${this.getLevelString(level)}) ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} [${source}] ${message}`);
	}

	private getLevelString(level: LogLevel) {
		switch (level) {
			case LogLevel.error:
				return 'E';
			case LogLevel.info:
				return 'I';
			case LogLevel.debug:
				return 'D';
		}
	}
}

export enum LogLevel {
	error,
	info,
	debug
}
