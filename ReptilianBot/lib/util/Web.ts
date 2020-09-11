import fetch, { RequestInfo, RequestInit } from 'node-fetch';
import { ReptilianClient } from '../struct/ReptilianClient';

export class Web {
	private readonly client: ReptilianClient;
	public constructor(client: ReptilianClient) {
		this.client = client;
	}

	public async fetch(requestInfo: RequestInfo, requestOptions?: RequestInit): Promise<any> {
		return new Promise((resolve, reject) => {
			fetch(requestInfo, requestOptions)
				.then(res => {
					if (!res.ok) reject(`${res.status} | ${res.statusText}`);

					const cT = res.headers.get('content-type') ?? 'application/json';
					res[cT.includes('image') ? 'buffer' : cT.includes('text') ? 'text' : 'json']().then(resolve).catch(reject);
				})
				.catch(reject);
		});
	}

	public uploadHaste(text: string): Promise<string | null> {
		return this.fetch('https://hastebin.com/documents', { method: 'POST', body: this.client.helpers.text.shorten(text, 400000) })
			.then(res => `https://hastebin.com/${res.key as string}`)
			.catch(() => null);
	}
}
