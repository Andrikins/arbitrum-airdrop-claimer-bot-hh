import { BigNumber } from 'ethers'
import { ClaimAndTransferResponses } from './sendTxs'

export async function showResultOfTxResponses(responses: ClaimAndTransferResponses[]): Promise<void> {
	console.log('\n\n')
	console.log('______________________________________________________________')
	console.log(`Address                                    | Cl | Tr | Amount`)
	console.log('______________________________________________________________')

	// 0xcd7923fd9D79CFBe92Cf43df8d3EAdB71622fEdf | ✓ | ✓ | 0
	for (const claimAndTransfer of responses) {
		const claim = await claimAndTransfer[0]
		const transfer = await claimAndTransfer[1]

		let claimResult = '🗙'
		let transferResult = '✓'

		try {
			const claimReceipt = await claim.wait()
			claimResult = claimReceipt.status ? '✓' : '🗙'

			const transferReceipt = await transfer.wait()
			transferResult = transferReceipt.status ? '✓' : '🗙'

			// console.log(claimReceipt.logs)
			const amount = BigNumber.from(claimReceipt.logs[1].data).div('1000000000000000000').toNumber()
			console.log(`${claimReceipt.from} | ${claimResult}  | ${transferResult}  | ${amount}`)
			// console.log(`[${receipt.status ? '✓ succ' : '🗙 fail'}]`, 'to get from', receipt.from, 1000, 'tokens')
		} catch (error) {
			const delimiter = '-------------------------------------------------------------'

			console.log(`${claim.from} | ${claimResult} | ${transferResult}`)
			console.log('Reason:', (error as any).reason)
			console.log('Code:', (error as any).code)
			console.log(delimiter)
		}
	}
	console.log('______________________________________________________________')
}
