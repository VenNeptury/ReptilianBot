import ordinal from 'ordinal';

export const text = {
	toTitleCase(text: string) {
		return text
			.split(/[\s_]+/)
			.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(' ');
	},
	toCodeBlock(text: string, language?: string) {
		return `\`\`\`${language ?? ''}\n${text || ''}\`\`\``;
	},
	escapeMarkdown(text: string) {
		return text.replace(/\\(\*|_|`|~|\\)/g, '$1').replace(/(\*|_|`|~|\\)/g, '\\$1');
	},
	substitue(text: string, obj: Record<string, string>) {
		for (const prop in obj) {
			if (prop.toUpperCase() === prop) text = text.replace(new RegExp(`{${prop}}`, 'g'), obj[prop]);
		}
		return text;
	},
	shorten(text: string, length = 2000) {
		return text.length > length ? `${text.substring(0, length - 3)}...` : text;
	},
	formatDate(date: Date | number) {
		if (!(date instanceof Date)) date = new Date(date);

		return `${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()]} ${ordinal(
			date.getDate()
		)} ${date.getFullYear()}`;
	},
	formatTime(date: Date | number) {
		if (!(date instanceof Date)) date = new Date(date);

		return `${text.addZeroes(date.getUTCHours())}:${text.addZeroes(date.getUTCMinutes())}:${text.addZeroes(date.getUTCSeconds())} UTC`;
	},
	addZeroes(n: number) {
		return n < 10 ? `0${n}` : n;
	},
	msToHuman(ms: number) {
		const seconds = Math.round(ms / 1000);
		const minutes = Math.round(ms / (1000 * 60));
		const hours = Math.round(ms / (1000 * 60 * 60));
		const days = Math.round(ms / (1000 * 60 * 60 * 24));

		if (seconds < 60) return `${seconds} seconds`;
		else if (minutes < 60) return `${minutes} minutes`;
		else if (hours < 24) return `${hours} hours`;
		return `${days} days`;
	},
	age(date: Date | number) {
		return text.msToHuman(Date.now() - (date instanceof Date ? date.getTime() : date));
	}
};
