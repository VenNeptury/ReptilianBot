export const text = {
	toTitleCase(text: string) {
		return text
			.split(/[\s_]+/)
			.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(' ');
	},
	toCodeBlock(text: string, language?: string) {
		return `\`\`\`${language ?? ''}\n${text}\`\`\``;
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
	}
};
