export interface ISignedParams {
	signature: string
	expirationTimestampInSeconds: number
	mutationId: number
	weiCost: string
}

export type ISignedParamsArray = [string, number, string, number]
