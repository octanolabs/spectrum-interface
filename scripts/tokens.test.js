import contracts from './contracts'
import tokens from './tokens'

test('shinobi - addLiquidity', () => {
  const txn = testData.addLiquidity
  const inputData = contracts.processTxnInput(txn.input)
  const transfers = tokens.processInputData(txn, inputData)
  expect(transfers.length).toBe(3)
})

// live test data
const testData = {
  addLiquidity: {
    blockHash:
      '0x1d012c4e3ad28ef3b7f3fd4f5bbd3f90fdc24ca5333513f68da3aee87efb9290',
    blockNumber: 1485647,
    hash: '0xcaef94bf3b94f7ac7f120fff5a3a0079fa47dd71055bc86a39e599e8e40d395e',
    timestamp: 1614989797,
    input:
      '0xe8e3370000000000000000000000000020e3dd746ddf519b23ffbbb6da7a5d33ea6349d6000000000000000000000000402c2c3aceeb52b8654a0631012ced49cbc9bdc40000000000000000000000000000000000000000000000000000002b147e3268000000000000000000000000000000000000000000000006385a5dbbf0b4dc5e000000000000000000000000000000000000000000000000000000204f5ea5ce000000000000000000000000000000000000000000000004aa43c64cf487a54600000000000000000000000064ba17efe5de3e95bfc4ca1e716ea5d7281affcf000000000000000000000000000000000000000000000000000000006042cf5e',
    value: '0',
    gas: 163732,
    gasPrice: 11809800000,
    nonce: '0x879',
    transactionIndex: 6,
    from: '0x64ba17efe5de3e95bfc4ca1e716ea5d7281affcf',
    to: '0xf3ce4655a44146c8eefbf45651f6479f9d67a77a',
    status: true,
    gasUsed: 132996,
    contractAddress: '',
    logs: [
      {
        address: '0x20e3dd746ddf519b23ffbbb6da7a5d33ea6349d6',
        topics: [
          '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
          '0x00000000000000000000000064ba17efe5de3e95bfc4ca1e716ea5d7281affcf',
          '0x000000000000000000000000596430df1662b39d481265752a0c694f72c99ad3',
        ],
        data:
          '0x0000000000000000000000000000000000000000000000000000002b147e3268',
        blockNumber: '0x16ab4f',
        transactionIndex: '0x6',
        transactionHash:
          '0xcaef94bf3b94f7ac7f120fff5a3a0079fa47dd71055bc86a39e599e8e40d395e',
        blockHash:
          '0x1d012c4e3ad28ef3b7f3fd4f5bbd3f90fdc24ca5333513f68da3aee87efb9290',
        logIndex: '0xa',
        removed: false,
      },
      {
        address: '0x402c2c3aceeb52b8654a0631012ced49cbc9bdc4',
        topics: [
          '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
          '0x00000000000000000000000064ba17efe5de3e95bfc4ca1e716ea5d7281affcf',
          '0x000000000000000000000000596430df1662b39d481265752a0c694f72c99ad3',
        ],
        data:
          '0x000000000000000000000000000000000000000000000006385a5dbbcd328935',
        blockNumber: '0x16ab4f',
        transactionIndex: '0x6',
        transactionHash:
          '0xcaef94bf3b94f7ac7f120fff5a3a0079fa47dd71055bc86a39e599e8e40d395e',
        blockHash:
          '0x1d012c4e3ad28ef3b7f3fd4f5bbd3f90fdc24ca5333513f68da3aee87efb9290',
        logIndex: '0xb',
        removed: false,
      },
      {
        address: '0x402c2c3aceeb52b8654a0631012ced49cbc9bdc4',
        topics: [
          '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
          '0x00000000000000000000000064ba17efe5de3e95bfc4ca1e716ea5d7281affcf',
          '0x000000000000000000000000f3ce4655a44146c8eefbf45651f6479f9d67a77a',
        ],
        data:
          '0xfffffffffffffffffffffffffffffffffffffffffffff2238859ff8761ffe415',
        blockNumber: '0x16ab4f',
        transactionIndex: '0x6',
        transactionHash:
          '0xcaef94bf3b94f7ac7f120fff5a3a0079fa47dd71055bc86a39e599e8e40d395e',
        blockHash:
          '0x1d012c4e3ad28ef3b7f3fd4f5bbd3f90fdc24ca5333513f68da3aee87efb9290',
        logIndex: '0xc',
        removed: false,
      },
      {
        address: '0x596430df1662b39d481265752a0c694f72c99ad3',
        topics: [
          '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
          '0x0000000000000000000000000000000000000000000000000000000000000000',
          '0x00000000000000000000000064ba17efe5de3e95bfc4ca1e716ea5d7281affcf',
        ],
        data:
          '0x000000000000000000000000000000000000000000000000001042ae791a1afd',
        blockNumber: '0x16ab4f',
        transactionIndex: '0x6',
        transactionHash:
          '0xcaef94bf3b94f7ac7f120fff5a3a0079fa47dd71055bc86a39e599e8e40d395e',
        blockHash:
          '0x1d012c4e3ad28ef3b7f3fd4f5bbd3f90fdc24ca5333513f68da3aee87efb9290',
        logIndex: '0xd',
        removed: false,
      },
      {
        address: '0x596430df1662b39d481265752a0c694f72c99ad3',
        topics: [
          '0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1',
        ],
        data:
          '0x000000000000000000000000000000000000000000000000000036ad5a104e580000000000000000000000000000000000000000000007e503449652edb28205',
        blockNumber: '0x16ab4f',
        transactionIndex: '0x6',
        transactionHash:
          '0xcaef94bf3b94f7ac7f120fff5a3a0079fa47dd71055bc86a39e599e8e40d395e',
        blockHash:
          '0x1d012c4e3ad28ef3b7f3fd4f5bbd3f90fdc24ca5333513f68da3aee87efb9290',
        logIndex: '0xe',
        removed: false,
      },
      {
        address: '0x596430df1662b39d481265752a0c694f72c99ad3',
        topics: [
          '0x4c209b5fc8ad50758f13e2e1088ba56a560dff690a1c6fef26394f4c03821c4f',
          '0x000000000000000000000000f3ce4655a44146c8eefbf45651f6479f9d67a77a',
        ],
        data:
          '0x0000000000000000000000000000000000000000000000000000002b147e3268000000000000000000000000000000000000000000000006385a5dbbcd328935',
        blockNumber: '0x16ab4f',
        transactionIndex: '0x6',
        transactionHash:
          '0xcaef94bf3b94f7ac7f120fff5a3a0079fa47dd71055bc86a39e599e8e40d395e',
        blockHash:
          '0x1d012c4e3ad28ef3b7f3fd4f5bbd3f90fdc24ca5333513f68da3aee87efb9290',
        logIndex: '0xf',
        removed: false,
      },
    ],
  },
}
