import { Wallet } from 'ethers'
import { checkEligibility } from './checkEligibility'

async function checkEligibilityOnAddress() {
	await checkEligibility(['0x47515585ef943F8E56C17BA0f50fb7E28CE1c4Dc'])
}

checkEligibilityOnAddress()
	.then(() => process.exit(0))
	.catch((error) => {
		console.log(error)
		process.exit(1)
	})
