import { BigNumber, Wallet } from 'ethers'
import { formatEther } from 'ethers/lib/utils'
import { getTestTokenDistributor, getTokenDistributor } from './getTokenDistributor'
import { setRecipients } from './setRecipients'

export interface EligibilityCheckResult<T> {
	claimableAmount: BigNumber
	eligibleAddresses: T[]
	notEligibleAddresses: T[]
}

const delimiter = '-------------------------------------'

export async function checkEligibility(
	signers: string[],
	showResults?: boolean
): Promise<EligibilityCheckResult<string>>
export async function checkEligibility(
	signers: Wallet[],
	showResults?: boolean,
	isTestCall?: boolean
): Promise<EligibilityCheckResult<Wallet>>

export async function checkEligibility(
	signers: string[] | Wallet[],
	showResults = true,
	isTestCall = false
): Promise<EligibilityCheckResult<string | Wallet>> {
	const eligibilityCheckResult: EligibilityCheckResult<string | Wallet> = {
		claimableAmount: BigNumber.from(0),
		eligibleAddresses: [],
		notEligibleAddresses: [],
	}
	const tokenDistributor = isTestCall ? getTestTokenDistributor() : getTokenDistributor()

	for (const signer of signers) {
		const address: string = typeof signer === 'string' ? signer : signer.address
		const [claimableTokens] = await tokenDistributor.functions.claimableTokens(address)

		if (claimableTokens.eq(0)) {
			eligibilityCheckResult.notEligibleAddresses.push(signer)
		} else {
			eligibilityCheckResult.claimableAmount = eligibilityCheckResult.claimableAmount.add(claimableTokens)
			eligibilityCheckResult.eligibleAddresses.push(signer)
		}
	}

	if (showResults) showEligibilityCheckResult(eligibilityCheckResult)

	if (eligibilityCheckResult.claimableAmount.eq(0)) {
		console.log('There are no claimable tokens')

		if (isTestCall) {
			await setRecipients(signers as Wallet[])
			console.log('Recipients set in test contract')
		}
	}

	return eligibilityCheckResult
}

// function getClaimableTokensFuncCallData(address: string): string {
// 	const iface = getTokenDistributorInterface()
// 	return iface.encodeFunctionData('claimableTokens', [address])
// }

function showEligibilityCheckResult(eligibilityCheckResult: EligibilityCheckResult<string | Wallet>): void {
	const eligibleAmount = eligibilityCheckResult.eligibleAddresses.length
	const notEligibleAmount = eligibilityCheckResult.notEligibleAddresses.length
	console.log(delimiter)
	console.log('Total wallets eligible/not: ', eligibleAmount, '/', notEligibleAmount)

	console.log('Total claimable tokens: ', eligibilityCheckResult.claimableAmount.toString())
	console.log(delimiter)
}
