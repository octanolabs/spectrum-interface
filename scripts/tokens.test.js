import axios from 'axios'
import contracts from './contracts'
import tokens from './tokens'

test('erc20 transfer', async () => {
  try {
    const response = await axios.post('http://127.0.0.1:8080/v4', {
      jsonrpc: '2.0',
      method: 'explorer_transactionByHash',
      params: [
        '0xdaa9b740f14f10edb26399b0a5b4e8612de0972758bc839abd9f8a7299e80434',
      ],
      id: 88,
    })
    const txn = response.data.result
    const inputData = contracts.processTxnInput(txn.input)
    const transfers = tokens.processInputData(txn, inputData)

    const testTxn = testData['0xa9059cbb'][0]
    const liveTxn = transfers[0]

    expect(liveTxn.type).toBe(testTxn.type)
  } catch (e) {
    console.log(e)
  }
})

// live test data

const testData = {
  '0xa9059cbb': [
    {
      hash:
        '0xdaa9b740f14f10edb26399b0a5b4e8612de0972758bc839abd9f8a7299e80434',
      type: 'erc20',
      from: '0x7e622a8b58de6817ac95081147c9f146c3613cc1',
      to: '0x64ba17efe5de3e95bfc4ca1e716ea5d7281affcf',
      value: '7860000000000938405',
      contract: '0x0826180a4c981d5095cb5c48bb2a098a44cf6f73',
    },
  ],
}
