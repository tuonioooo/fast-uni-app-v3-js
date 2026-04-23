
const sampleApi = async (params = {}) => {
	return await uni.$uv.http.get('/api', {
		...params,
		custom: {ignoreCheck: true},
		baseURL: 'https://yesno.wtf',

	})
}

export {
	sampleApi
}