import { ISignedParams } from '../interfaces/signed-params'

export abstract class IParamsSigner {
	abstract getPublicKey(): Promise<string> | string
	abstract getSignedMintCallParams(mutationId: number, ethCost: number): Promise<ISignedParams>
}
