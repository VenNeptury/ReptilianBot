import { RequestInfo, RequestInit } from 'node-fetch';

export class Web {
	public async fetch(requestInfo: RequestInfo, requestOptions?: RequestInit): Promise<any> {
		return new Promise((resolve, reject) => {
			this.fetch(requestInfo, requestOptions)
				.then(async res => {
					if (res.status > 299 || res.status < 200) reject(`${res.status as string} | ${res.statusText as string}`);

					try {
						const contentType = res.headers.get('content-type') || 'application/json';

						let result;
						if (contentType.includes('image')) result = await res.buffer();
						else if (contentType.includes('text')) result = await res.text();
						else result = await res.json();
						resolve(result);
					} catch (error) {
						reject(error);
					}
				})
				.catch(reject);
		});
	}
}
