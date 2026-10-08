export type RequestOptions = Omit<UniApp.RequestOptions, 'success' | 'fail' | 'complete'>

export type RequestErrorCode = 'CONFIG' | 'HTTP' | 'NETWORK' | 'TIMEOUT'
