import BigNumber from 'bignumber.js'
import contracts from './contracts'
import tokens from './tokens'

test('erc20 - transfer', () => {
  const txn = testData.transfer
  const inputData = contracts.processTxnInput(txn.input)
  const transfers = tokens.processInputData(txn, inputData)
  expect(transfers.length).toBe(1)
  expect(transfers[0].type).toBe('erc20')
  expect(transfers[0].contract).toBe(
    '0x596430df1662b39d481265752a0c694f72c99ad3'
  )
  expect(transfers[0].from).toBe('0x744b835c60172b6e6eb9f5449a72959fc23d445e')
  expect(transfers[0].to).toBe('0x64ba17efe5de3e95bfc4ca1e716ea5d7281affcf')
  expect(transfers[0].value.toString()).toBe('6969076146339723')
})

test('erc20 - sweep [bittrex]', () => {
  const txn = testData.sweep
  const inputData = contracts.processTxnInput(txn.input)
  const transfers = tokens.processInputData(txn, inputData)
  expect(transfers.length).toBe(1)
  expect(transfers[0].type).toBe('erc20')
  expect(transfers[0].contract).toBe(
    '0x20e3dd746ddf519b23ffbbb6da7a5d33ea6349d6'
  )
  expect(transfers[0].from).toBe('0x3b71ced72953fb9a20615312004b0e9365b5fa33')
  expect(transfers[0].to).toBe('0xb3c4e9ca7c12a6277deb9eef2dece65953d1c864')
  expect(transfers[0].value.toString()).toBe('28125160562')
})

test('shinobi - addLiquidityETH [1]', () => {
  const txn = testData.addLiquidityETH1
  const inputData = contracts.processTxnInput(txn.input)
  const transfers = tokens.processInputData(txn, inputData)
  expect(transfers.length).toBe(3)
  expect(transfers[0].type).toBe('native')
  expect(transfers[0].value.toString()).toBe('1288894215254449224')
  expect(transfers[1].type).toBe('erc20')
  expect(transfers[1].contract).toBe(
    '0x0826180a4c981d5095cb5c48bb2a098a44cf6f73'
  ) // GRANS
  expect(transfers[1].value.toString()).toBe('4010194373598320')
  expect(transfers[2].type).toBe('erc20')
  expect(transfers[2].action).toBe('Minted')
  expect(transfers[2].contract).toBe(
    '0x6321c294f34c2cdaf61012ac4f3588a527f4d990'
  ) // SLPT (UBQ/GRANS)
  expect(transfers[2].value.toString()).toBe('70732403579702299')
})

test('shinobi - addLiquidityETH [2]', () => {
  const txn = testData.addLiquidityETH2
  const inputData = contracts.processTxnInput(txn.input)
  const transfers = tokens.processInputData(txn, inputData)
  expect(transfers.length).toBe(3)
  expect(transfers[0].type).toBe('native')
  expect(transfers[0].value.toString()).toBe('22113275362024400707')
  expect(transfers[1].type).toBe('erc20')
  expect(transfers[1].contract).toBe(
    '0x20e3dd746ddf519b23ffbbb6da7a5d33ea6349d6'
  ) // SPHR
  expect(transfers[1].value.toString()).toBe('2000000000')
  expect(transfers[2].type).toBe('erc20')
  expect(transfers[2].action).toBe('Minted')
  expect(transfers[2].contract).toBe(
    '0x039bc8983df1203290d4bc9263d75c7440b1e4bb'
  ) // SLPT (UBQ/SPHR)
  expect(transfers[2].value.toString()).toBe('203763931768760')
})

test('shinobi - addLiquidity [1]', () => {
  const txn = testData.addLiquidity1
  const inputData = contracts.processTxnInput(txn.input)
  const transfers = tokens.processInputData(txn, inputData)
  expect(transfers.length).toBe(3)
  expect(transfers[0].type).toBe('erc20')
  expect(transfers[0].contract).toBe(
    '0x20e3dd746ddf519b23ffbbb6da7a5d33ea6349d6'
  ) // SPHR
  expect(transfers[0].value.toString()).toBe('185027408488')
  expect(transfers[1].type).toBe('erc20')
  expect(transfers[1].contract).toBe(
    '0x402c2c3aceeb52b8654a0631012ced49cbc9bdc4'
  ) // SPHRC
  expect(transfers[1].value.toString()).toBe('114741125517468141877')
  expect(transfers[2].type).toBe('erc20')
  expect(transfers[2].action).toBe('Minted')
  expect(transfers[2].contract).toBe(
    '0x596430df1662b39d481265752a0c694f72c99ad3'
  ) // SLPT (SPHR/SPHRC)
  expect(transfers[2].value.toString()).toBe('4576916750867197')
})

test('shinobi - addLiquidity [2]', () => {
  const txn = testData.addLiquidity2
  const inputData = contracts.processTxnInput(txn.input)
  const transfers = tokens.processInputData(txn, inputData)
  expect(transfers.length).toBe(3)
  expect(transfers[0].type).toBe('erc20')
  expect(transfers[0].contract).toBe(
    '0x0826180a4c981d5095cb5c48bb2a098a44cf6f73'
  ) // GRANS
  expect(transfers[0].value.toString()).toBe('3875056450336449868')
  expect(transfers[1].type).toBe('erc20')
  expect(transfers[1].contract).toBe(
    '0x20e3dd746ddf519b23ffbbb6da7a5d33ea6349d6'
  ) // SPHR
  expect(transfers[1].value.toString()).toBe('93513949543')
  expect(transfers[2].type).toBe('erc20')
  expect(transfers[2].action).toBe('Minted')
  expect(transfers[2].contract).toBe(
    '0xa75f2649ba3fe3144f0c1662fe1ed0c6fb96aac1'
  ) // SLPT (SPHR/SPHRC)
  expect(transfers[2].value.toString()).toBe('597645735246503')
})

test('shinobi - swapExactTokensForETH [1]', () => {
  const txn = testData.swapExactTokensForETH1
  const inputData = contracts.processTxnInput(txn.input)
  const transfers = tokens.processInputData(txn, inputData)
  expect(transfers.length).toBe(2)
  expect(transfers[0].type).toBe('erc20')
  expect(transfers[0].contract).toBe(
    '0x20e3dd746ddf519b23ffbbb6da7a5d33ea6349d6'
  )
  expect(transfers[0].value.toString()).toBe('276036466743')
  expect(transfers[1].type).toBe('native')
  expect(
    transfers[1].value.isEqualTo(new BigNumber('3067001630217440467586'))
  ).toBe(true)
})

test('shinobi - swapExactTokensForTokens [1]', () => {
  const txn = testData.swapExactTokensForTokens1
  const inputData = contracts.processTxnInput(txn.input)
  const transfers = tokens.processInputData(txn, inputData)
  expect(transfers.length).toBe(2)
  expect(transfers[0].type).toBe('erc20')
  expect(transfers[0].contract).toBe(
    '0x402c2c3aceeb52b8654a0631012ced49cbc9bdc4'
  )
  expect(transfers[0].value.toString()).toBe('187549835098626636085')
  expect(transfers[1].type).toBe('erc20')
  expect(transfers[1].contract).toBe(
    '0x20e3dd746ddf519b23ffbbb6da7a5d33ea6349d6'
  )
  expect(transfers[1].value.toString()).toBe('234732418611')
})

test('shinobi - swapExactTokensForTokens [2]', () => {
  const txn = testData.swapExactTokensForTokens2
  const inputData = contracts.processTxnInput(txn.input)
  const transfers = tokens.processInputData(txn, inputData)
  expect(transfers.length).toBe(2)
  expect(transfers[0].type).toBe('erc20')
  expect(transfers[0].contract).toBe(
    '0x20e3dd746ddf519b23ffbbb6da7a5d33ea6349d6'
  )
  expect(transfers[0].value.toString()).toBe('3500000000')
  expect(transfers[1].type).toBe('erc20')
  expect(transfers[0].contract).toBe(
    '0x20e3dd746ddf519b23ffbbb6da7a5d33ea6349d6'
  )
  expect(transfers[1].value.toString()).toBe('39469554653550699149')
})

// live test data
const testData = {
  transfer: {
    blockHash:
      '0x77eba5260431a8d6a569d7d17719e01759b2ab50581cdc2b04339eaca89bb44d',
    blockNumber: 1485662,
    hash: '0xa778a9ab0993b7bd6c3996d4705230296895e4fe036d42c08c0a10ede9cc441b',
    timestamp: 1614990806,
    input:
      '0xa9059cbb00000000000000000000000064ba17efe5de3e95bfc4ca1e716ea5d7281affcf0000000000000000000000000000000000000000000000000018c2567c1d7f8b',
    value: '0',
    gas: 53922,
    gasPrice: 11900000000,
    nonce: '0x4f',
    transactionIndex: 1,
    from: '0x744b835c60172b6e6eb9f5449a72959fc23d445e',
    to: '0x596430df1662b39d481265752a0c694f72c99ad3',
    status: true,
    gasUsed: 21396,
    contractAddress: '',
    logs: [
      {
        address: '0x596430df1662b39d481265752a0c694f72c99ad3',
        topics: [
          '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
          '0x000000000000000000000000744b835c60172b6e6eb9f5449a72959fc23d445e',
          '0x00000000000000000000000064ba17efe5de3e95bfc4ca1e716ea5d7281affcf',
        ],
        data:
          '0x0000000000000000000000000000000000000000000000000018c2567c1d7f8b',
        blockNumber: '0x16ab5e',
        transactionIndex: '0x1',
        transactionHash:
          '0xa778a9ab0993b7bd6c3996d4705230296895e4fe036d42c08c0a10ede9cc441b',
        blockHash:
          '0x77eba5260431a8d6a569d7d17719e01759b2ab50581cdc2b04339eaca89bb44d',
        logIndex: '0x0',
        removed: false,
      },
    ],
  },
  sweep: {
    blockHash:
      '0x42819621192145376d586b6279bee996b378155d17b726357da2e1e0a1c0bf95',
    blockNumber: 1482826,
    hash: '0x52e5be2526cb88102ad8357a6bdf5da465d17f5eb6bda28711b69e95ca6a5949',
    timestamp: 1614744695,
    input:
      '0x6ea056a900000000000000000000000020e3dd746ddf519b23ffbbb6da7a5d33ea6349d6000000000000000000000000000000000000000000000000000000068c63e472',
    value: '0',
    gas: 150000,
    gasPrice: 11809800000,
    nonce: '0x245ed',
    transactionIndex: 2,
    from: '0xb3c4e9ca7c12a6277deb9eef2dece65953d1c864',
    to: '0x3b71ced72953fb9a20615312004b0e9365b5fa33',
    status: true,
    gasUsed: 41778,
    contractAddress: '',
    logs: [
      {
        address: '0x20e3dd746ddf519b23ffbbb6da7a5d33ea6349d6',
        topics: [
          '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
          '0x0000000000000000000000003b71ced72953fb9a20615312004b0e9365b5fa33',
          '0x000000000000000000000000b3c4e9ca7c12a6277deb9eef2dece65953d1c864',
        ],
        data:
          '0x000000000000000000000000000000000000000000000000000000068c63e472',
        blockNumber: '0x16a04a',
        transactionIndex: '0x2',
        transactionHash:
          '0x52e5be2526cb88102ad8357a6bdf5da465d17f5eb6bda28711b69e95ca6a5949',
        blockHash:
          '0x42819621192145376d586b6279bee996b378155d17b726357da2e1e0a1c0bf95',
        logIndex: '0xb',
        removed: false,
      },
      {
        address: '0x52598fbd7005fd6b0c00b94c91268fc8f0ccd0ec',
        topics: [
          '0x3ffd89314c7891190d2190d5299c9887128a3d4081cf6e41a67722cae685d296',
        ],
        data:
          '0x0000000000000000000000003b71ced72953fb9a20615312004b0e9365b5fa3300000000000000000000000020e3dd746ddf519b23ffbbb6da7a5d33ea6349d6000000000000000000000000000000000000000000000000000000068c63e472',
        blockNumber: '0x16a04a',
        transactionIndex: '0x2',
        transactionHash:
          '0x52e5be2526cb88102ad8357a6bdf5da465d17f5eb6bda28711b69e95ca6a5949',
        blockHash:
          '0x42819621192145376d586b6279bee996b378155d17b726357da2e1e0a1c0bf95',
        logIndex: '0xc',
        removed: false,
      },
    ],
  },
  addLiquidityETH1: {
    blockHash:
      '0x900d918514828cc1b84e4caa1edcf119af1038c316aa3625e1b7d1a096d2e46b',
    blockNumber: 1485556,
    hash: '0xf8949b848409d66750f4fb16f50a72a49093bf0704333da5163402eaab06c239',
    timestamp: 1614984378,
    input:
      '0xf305d7190000000000000000000000000826180a4c981d5095cb5c48bb2a098a44cf6f73000000000000000000000000000000000000000000000000000e3f40231e5c70000000000000000000000000000000000000000000000000000e2d03a810211800000000000000000000000000000000000000000000000011cc2d3f6407e3d1000000000000000000000000ec962b8ffdf7ef12ceb6824ba9f5826b4838a4d6000000000000000000000000000000000000000000000000000000006042b984',
    value: '1288894215254449224',
    gas: 202477,
    gasPrice: 11809800000,
    nonce: '0x359',
    transactionIndex: 1,
    from: '0xec962b8ffdf7ef12ceb6824ba9f5826b4838a4d6',
    to: '0xf3ce4655a44146c8eefbf45651f6479f9d67a77a',
    status: true,
    gasUsed: 137990,
    contractAddress: '',
    logs: [
      {
        address: '0x0826180a4c981d5095cb5c48bb2a098a44cf6f73',
        topics: [
          '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
          '0x000000000000000000000000ec962b8ffdf7ef12ceb6824ba9f5826b4838a4d6',
          '0x0000000000000000000000006321c294f34c2cdaf61012ac4f3588a527f4d990',
        ],
        data:
          '0x000000000000000000000000000000000000000000000000000e3f40231e5c70',
        blockNumber: '0x16aaf4',
        transactionIndex: '0x1',
        transactionHash:
          '0xf8949b848409d66750f4fb16f50a72a49093bf0704333da5163402eaab06c239',
        blockHash:
          '0x900d918514828cc1b84e4caa1edcf119af1038c316aa3625e1b7d1a096d2e46b',
        logIndex: '0x2',
        removed: false,
      },
      {
        address: '0x1fa6a37c64804c0d797ba6bc1955e50068fbf362',
        topics: [
          '0xe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c',
          '0x000000000000000000000000f3ce4655a44146c8eefbf45651f6479f9d67a77a',
        ],
        data:
          '0x00000000000000000000000000000000000000000000000011e31275bd4c1c48',
        blockNumber: '0x16aaf4',
        transactionIndex: '0x1',
        transactionHash:
          '0xf8949b848409d66750f4fb16f50a72a49093bf0704333da5163402eaab06c239',
        blockHash:
          '0x900d918514828cc1b84e4caa1edcf119af1038c316aa3625e1b7d1a096d2e46b',
        logIndex: '0x3',
        removed: false,
      },
      {
        address: '0x1fa6a37c64804c0d797ba6bc1955e50068fbf362',
        topics: [
          '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
          '0x000000000000000000000000f3ce4655a44146c8eefbf45651f6479f9d67a77a',
          '0x0000000000000000000000006321c294f34c2cdaf61012ac4f3588a527f4d990',
        ],
        data:
          '0x00000000000000000000000000000000000000000000000011e31275bd4c1c48',
        blockNumber: '0x16aaf4',
        transactionIndex: '0x1',
        transactionHash:
          '0xf8949b848409d66750f4fb16f50a72a49093bf0704333da5163402eaab06c239',
        blockHash:
          '0x900d918514828cc1b84e4caa1edcf119af1038c316aa3625e1b7d1a096d2e46b',
        logIndex: '0x4',
        removed: false,
      },
      {
        address: '0x6321c294f34c2cdaf61012ac4f3588a527f4d990',
        topics: [
          '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
          '0x0000000000000000000000000000000000000000000000000000000000000000',
          '0x000000000000000000000000ec962b8ffdf7ef12ceb6824ba9f5826b4838a4d6',
        ],
        data:
          '0x00000000000000000000000000000000000000000000000000fb4abf0d7a4c1b',
        blockNumber: '0x16aaf4',
        transactionIndex: '0x1',
        transactionHash:
          '0xf8949b848409d66750f4fb16f50a72a49093bf0704333da5163402eaab06c239',
        blockHash:
          '0x900d918514828cc1b84e4caa1edcf119af1038c316aa3625e1b7d1a096d2e46b',
        logIndex: '0x5',
        removed: false,
      },
      {
        address: '0x6321c294f34c2cdaf61012ac4f3588a527f4d990',
        topics: [
          '0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1',
        ],
        data:
          '0x0000000000000000000000000000000000000000000000302498e6dabbdafc21000000000000000000000000000000000000000000003c715c18549750356e93',
        blockNumber: '0x16aaf4',
        transactionIndex: '0x1',
        transactionHash:
          '0xf8949b848409d66750f4fb16f50a72a49093bf0704333da5163402eaab06c239',
        blockHash:
          '0x900d918514828cc1b84e4caa1edcf119af1038c316aa3625e1b7d1a096d2e46b',
        logIndex: '0x6',
        removed: false,
      },
      {
        address: '0x6321c294f34c2cdaf61012ac4f3588a527f4d990',
        topics: [
          '0x4c209b5fc8ad50758f13e2e1088ba56a560dff690a1c6fef26394f4c03821c4f',
          '0x000000000000000000000000f3ce4655a44146c8eefbf45651f6479f9d67a77a',
        ],
        data:
          '0x000000000000000000000000000000000000000000000000000e3f40231e5c7000000000000000000000000000000000000000000000000011e31275bd4c1c48',
        blockNumber: '0x16aaf4',
        transactionIndex: '0x1',
        transactionHash:
          '0xf8949b848409d66750f4fb16f50a72a49093bf0704333da5163402eaab06c239',
        blockHash:
          '0x900d918514828cc1b84e4caa1edcf119af1038c316aa3625e1b7d1a096d2e46b',
        logIndex: '0x7',
        removed: false,
      },
    ],
  },
  addLiquidityETH2: {
    blockHash:
      '0x61fa73852e55188da3bcbb4301aedbf5cb01091803ce2a09879bb97436a939b6',
    blockNumber: 1486255,
    hash: '0x8cbfb85a438e0bf0c3d42b3edcf709fccc40da1c68c9411aeffdf274ff7d1f87',
    timestamp: 1615043699,
    input:
      '0xf305d71900000000000000000000000020e3dd746ddf519b23ffbbb6da7a5d33ea6349d6000000000000000000000000000000000000000000000000000000007735940000000000000000000000000000000000000000000000000000000000769cfd800000000000000000000000000000000000000000000000013159533f27fe1c2f00000000000000000000000050c6fd7401fafec2f49745675c10e5dd23bc37d3000000000000000000000000000000000000000000000000000000006043a14c',
    value: '22113275362024400707',
    gas: 202238,
    gasPrice: 11809800000,
    nonce: '0x30e',
    transactionIndex: 2,
    from: '0x50c6fd7401fafec2f49745675c10e5dd23bc37d3',
    to: '0xf3ce4655a44146c8eefbf45651f6479f9d67a77a',
    status: true,
    gasUsed: 152772,
    contractAddress: '',
    logs: [
      {
        address: '0x20e3dd746ddf519b23ffbbb6da7a5d33ea6349d6',
        topics: [
          '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
          '0x00000000000000000000000050c6fd7401fafec2f49745675c10e5dd23bc37d3',
          '0x000000000000000000000000039bc8983df1203290d4bc9263d75c7440b1e4bb',
        ],
        data:
          '0x0000000000000000000000000000000000000000000000000000000077359400',
        blockNumber: '0x16adaf',
        transactionIndex: '0x2',
        transactionHash:
          '0x8cbfb85a438e0bf0c3d42b3edcf709fccc40da1c68c9411aeffdf274ff7d1f87',
        blockHash:
          '0x61fa73852e55188da3bcbb4301aedbf5cb01091803ce2a09879bb97436a939b6',
        logIndex: '0x1',
        removed: false,
      },
      {
        address: '0x1fa6a37c64804c0d797ba6bc1955e50068fbf362',
        topics: [
          '0xe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c',
          '0x000000000000000000000000f3ce4655a44146c8eefbf45651f6479f9d67a77a',
        ],
        data:
          '0x00000000000000000000000000000000000000000000000132e222c7d5dca743',
        blockNumber: '0x16adaf',
        transactionIndex: '0x2',
        transactionHash:
          '0x8cbfb85a438e0bf0c3d42b3edcf709fccc40da1c68c9411aeffdf274ff7d1f87',
        blockHash:
          '0x61fa73852e55188da3bcbb4301aedbf5cb01091803ce2a09879bb97436a939b6',
        logIndex: '0x2',
        removed: false,
      },
      {
        address: '0x1fa6a37c64804c0d797ba6bc1955e50068fbf362',
        topics: [
          '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
          '0x000000000000000000000000f3ce4655a44146c8eefbf45651f6479f9d67a77a',
          '0x000000000000000000000000039bc8983df1203290d4bc9263d75c7440b1e4bb',
        ],
        data:
          '0x00000000000000000000000000000000000000000000000132e222c7d5dca743',
        blockNumber: '0x16adaf',
        transactionIndex: '0x2',
        transactionHash:
          '0x8cbfb85a438e0bf0c3d42b3edcf709fccc40da1c68c9411aeffdf274ff7d1f87',
        blockHash:
          '0x61fa73852e55188da3bcbb4301aedbf5cb01091803ce2a09879bb97436a939b6',
        logIndex: '0x3',
        removed: false,
      },
      {
        address: '0x039bc8983df1203290d4bc9263d75c7440b1e4bb',
        topics: [
          '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
          '0x0000000000000000000000000000000000000000000000000000000000000000',
          '0x00000000000000000000000050c6fd7401fafec2f49745675c10e5dd23bc37d3',
        ],
        data:
          '0x0000000000000000000000000000000000000000000000000000b9527cc567b8',
        blockNumber: '0x16adaf',
        transactionIndex: '0x2',
        transactionHash:
          '0x8cbfb85a438e0bf0c3d42b3edcf709fccc40da1c68c9411aeffdf274ff7d1f87',
        blockHash:
          '0x61fa73852e55188da3bcbb4301aedbf5cb01091803ce2a09879bb97436a939b6',
        logIndex: '0x4',
        removed: false,
      },
      {
        address: '0x039bc8983df1203290d4bc9263d75c7440b1e4bb',
        topics: [
          '0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1',
        ],
        data:
          '0x000000000000000000000000000000000000000000000bae3573639b7e061d04000000000000000000000000000000000000000000000000000004898d10cb24',
        blockNumber: '0x16adaf',
        transactionIndex: '0x2',
        transactionHash:
          '0x8cbfb85a438e0bf0c3d42b3edcf709fccc40da1c68c9411aeffdf274ff7d1f87',
        blockHash:
          '0x61fa73852e55188da3bcbb4301aedbf5cb01091803ce2a09879bb97436a939b6',
        logIndex: '0x5',
        removed: false,
      },
      {
        address: '0x039bc8983df1203290d4bc9263d75c7440b1e4bb',
        topics: [
          '0x4c209b5fc8ad50758f13e2e1088ba56a560dff690a1c6fef26394f4c03821c4f',
          '0x000000000000000000000000f3ce4655a44146c8eefbf45651f6479f9d67a77a',
        ],
        data:
          '0x00000000000000000000000000000000000000000000000132e222c7d5dca7430000000000000000000000000000000000000000000000000000000077359400',
        blockNumber: '0x16adaf',
        transactionIndex: '0x2',
        transactionHash:
          '0x8cbfb85a438e0bf0c3d42b3edcf709fccc40da1c68c9411aeffdf274ff7d1f87',
        blockHash:
          '0x61fa73852e55188da3bcbb4301aedbf5cb01091803ce2a09879bb97436a939b6',
        logIndex: '0x6',
        removed: false,
      },
    ],
  },
  swapExactTokensForTokens1: {
    blockHash:
      '0x432fb6091e9698a3bc2b5e6b260922bb78245b4726e7b43285b7fbfb8e6120a0',
    blockNumber: 1488255,
    hash: '0x79078a37c02e013a7b4db9cabea76937c8ce3ff138ffb5b45576ca94c0b73a88',
    timestamp: 1615221292,
    input:
      '0x38ed173900000000000000000000000000000000000000000000000a2ac6dd5730bab935000000000000000000000000000000000000000000000000000000366188e5b000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000002ac840f384eacaec65cbc77bc5ded36a845a1b4f00000000000000000000000000000000000000000000000000000000604657190000000000000000000000000000000000000000000000000000000000000002000000000000000000000000402c2c3aceeb52b8654a0631012ced49cbc9bdc400000000000000000000000020e3dd746ddf519b23ffbbb6da7a5d33ea6349d6',
    value: '0',
    gas: 159352,
    gasPrice: 11809800000,
    nonce: '0x356',
    transactionIndex: 0,
    from: '0x2ac840f384eacaec65cbc77bc5ded36a845a1b4f',
    to: '0xf3ce4655a44146c8eefbf45651f6479f9d67a77a',
    status: true,
    gasUsed: 113993,
    contractAddress: '',
    logs: [
      {
        address: '0x402c2c3aceeb52b8654a0631012ced49cbc9bdc4',
        topics: [
          '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
          '0x0000000000000000000000002ac840f384eacaec65cbc77bc5ded36a845a1b4f',
          '0x000000000000000000000000596430df1662b39d481265752a0c694f72c99ad3',
        ],
        data:
          '0x00000000000000000000000000000000000000000000000a2ac6dd5730bab935',
        blockNumber: '0x16b57f',
        transactionIndex: '0x0',
        transactionHash:
          '0x79078a37c02e013a7b4db9cabea76937c8ce3ff138ffb5b45576ca94c0b73a88',
        blockHash:
          '0x432fb6091e9698a3bc2b5e6b260922bb78245b4726e7b43285b7fbfb8e6120a0',
        logIndex: '0x0',
        removed: false,
      },
      {
        address: '0x402c2c3aceeb52b8654a0631012ced49cbc9bdc4',
        topics: [
          '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
          '0x0000000000000000000000002ac840f384eacaec65cbc77bc5ded36a845a1b4f',
          '0x000000000000000000000000f3ce4655a44146c8eefbf45651f6479f9d67a77a',
        ],
        data:
          '0xfffffffffffffffffffffffffffffffffffffffffffffc99a1397228b30d05ac',
        blockNumber: '0x16b57f',
        transactionIndex: '0x0',
        transactionHash:
          '0x79078a37c02e013a7b4db9cabea76937c8ce3ff138ffb5b45576ca94c0b73a88',
        blockHash:
          '0x432fb6091e9698a3bc2b5e6b260922bb78245b4726e7b43285b7fbfb8e6120a0',
        logIndex: '0x1',
        removed: false,
      },
      {
        address: '0x20e3dd746ddf519b23ffbbb6da7a5d33ea6349d6',
        topics: [
          '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
          '0x000000000000000000000000596430df1662b39d481265752a0c694f72c99ad3',
          '0x0000000000000000000000002ac840f384eacaec65cbc77bc5ded36a845a1b4f',
        ],
        data:
          '0x00000000000000000000000000000000000000000000000000000036a7247633',
        blockNumber: '0x16b57f',
        transactionIndex: '0x0',
        transactionHash:
          '0x79078a37c02e013a7b4db9cabea76937c8ce3ff138ffb5b45576ca94c0b73a88',
        blockHash:
          '0x432fb6091e9698a3bc2b5e6b260922bb78245b4726e7b43285b7fbfb8e6120a0',
        logIndex: '0x2',
        removed: false,
      },
      {
        address: '0x596430df1662b39d481265752a0c694f72c99ad3',
        topics: [
          '0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1',
        ],
        data:
          '0x00000000000000000000000000000000000000000000000000002ed8e2a95c0c0000000000000000000000000000000000000000000008ba83ae6131e69d0959',
        blockNumber: '0x16b57f',
        transactionIndex: '0x0',
        transactionHash:
          '0x79078a37c02e013a7b4db9cabea76937c8ce3ff138ffb5b45576ca94c0b73a88',
        blockHash:
          '0x432fb6091e9698a3bc2b5e6b260922bb78245b4726e7b43285b7fbfb8e6120a0',
        logIndex: '0x3',
        removed: false,
      },
      {
        address: '0x596430df1662b39d481265752a0c694f72c99ad3',
        topics: [
          '0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822',
          '0x000000000000000000000000f3ce4655a44146c8eefbf45651f6479f9d67a77a',
          '0x0000000000000000000000002ac840f384eacaec65cbc77bc5ded36a845a1b4f',
        ],
        data:
          '0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a2ac6dd5730bab93500000000000000000000000000000000000000000000000000000036a72476330000000000000000000000000000000000000000000000000000000000000000',
        blockNumber: '0x16b57f',
        transactionIndex: '0x0',
        transactionHash:
          '0x79078a37c02e013a7b4db9cabea76937c8ce3ff138ffb5b45576ca94c0b73a88',
        blockHash:
          '0x432fb6091e9698a3bc2b5e6b260922bb78245b4726e7b43285b7fbfb8e6120a0',
        logIndex: '0x4',
        removed: false,
      },
    ],
  },
  swapExactTokensForTokens2: {
    blockHash:
      '0xdf74f1afadf6c4359615f9548b3ddff4c84460a1f0d9f8d166c210a79171f7e8',
    blockNumber: 1487333,
    hash: '0x7235f1557fc8f91f674df4162f2e0eb8a5e9436ad77d8f2c7aeeea2d7121db0d',
    timestamp: 1615138320,
    input:
      '0x38ed173900000000000000000000000000000000000000000000000000000000d09dc3000000000000000000000000000000000000000000000000002544cdc91962e02600000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000cc11418f3e46a54e54d508848f8781f51274da6000000000000000000000000000000000000000000000000000000006045132d000000000000000000000000000000000000000000000000000000000000000300000000000000000000000020e3dd746ddf519b23ffbbb6da7a5d33ea6349d60000000000000000000000001fa6a37c64804c0d797ba6bc1955e50068fbf362000000000000000000000000402c2c3aceeb52b8654a0631012ced49cbc9bdc4',
    value: '0',
    gas: 224937,
    gasPrice: 11809800000,
    nonce: '0xa50',
    transactionIndex: 3,
    from: '0x0cc11418f3e46a54e54d508848f8781f51274da6',
    to: '0xf3ce4655a44146c8eefbf45651f6479f9d67a77a',
    status: true,
    gasUsed: 173933,
    contractAddress: '',
    logs: [
      {
        address: '0x20e3dd746ddf519b23ffbbb6da7a5d33ea6349d6',
        topics: [
          '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
          '0x0000000000000000000000000cc11418f3e46a54e54d508848f8781f51274da6',
          '0x000000000000000000000000039bc8983df1203290d4bc9263d75c7440b1e4bb',
        ],
        data:
          '0x00000000000000000000000000000000000000000000000000000000d09dc300',
        blockNumber: '0x16b1e5',
        transactionIndex: '0x3',
        transactionHash:
          '0x7235f1557fc8f91f674df4162f2e0eb8a5e9436ad77d8f2c7aeeea2d7121db0d',
        blockHash:
          '0xdf74f1afadf6c4359615f9548b3ddff4c84460a1f0d9f8d166c210a79171f7e8',
        logIndex: '0x0',
        removed: false,
      },
      {
        address: '0x1fa6a37c64804c0d797ba6bc1955e50068fbf362',
        topics: [
          '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
          '0x000000000000000000000000039bc8983df1203290d4bc9263d75c7440b1e4bb',
          '0x0000000000000000000000007f35d076ad816f70ecc88576ff60596124e46e35',
        ],
        data:
          '0x00000000000000000000000000000000000000000000000223c006d6b7c1628d',
        blockNumber: '0x16b1e5',
        transactionIndex: '0x3',
        transactionHash:
          '0x7235f1557fc8f91f674df4162f2e0eb8a5e9436ad77d8f2c7aeeea2d7121db0d',
        blockHash:
          '0xdf74f1afadf6c4359615f9548b3ddff4c84460a1f0d9f8d166c210a79171f7e8',
        logIndex: '0x1',
        removed: false,
      },
      {
        address: '0x039bc8983df1203290d4bc9263d75c7440b1e4bb',
        topics: [
          '0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1',
        ],
        data:
          '0x000000000000000000000000000000000000000000003b9faf6d532dbe6ec42b000000000000000000000000000000000000000000000000000016a4b4d12c6e',
        blockNumber: '0x16b1e5',
        transactionIndex: '0x3',
        transactionHash:
          '0x7235f1557fc8f91f674df4162f2e0eb8a5e9436ad77d8f2c7aeeea2d7121db0d',
        blockHash:
          '0xdf74f1afadf6c4359615f9548b3ddff4c84460a1f0d9f8d166c210a79171f7e8',
        logIndex: '0x2',
        removed: false,
      },
      {
        address: '0x039bc8983df1203290d4bc9263d75c7440b1e4bb',
        topics: [
          '0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822',
          '0x000000000000000000000000f3ce4655a44146c8eefbf45651f6479f9d67a77a',
          '0x0000000000000000000000007f35d076ad816f70ecc88576ff60596124e46e35',
        ],
        data:
          '0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000d09dc30000000000000000000000000000000000000000000000000223c006d6b7c1628d0000000000000000000000000000000000000000000000000000000000000000',
        blockNumber: '0x16b1e5',
        transactionIndex: '0x3',
        transactionHash:
          '0x7235f1557fc8f91f674df4162f2e0eb8a5e9436ad77d8f2c7aeeea2d7121db0d',
        blockHash:
          '0xdf74f1afadf6c4359615f9548b3ddff4c84460a1f0d9f8d166c210a79171f7e8',
        logIndex: '0x3',
        removed: false,
      },
      {
        address: '0x402c2c3aceeb52b8654a0631012ced49cbc9bdc4',
        topics: [
          '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
          '0x0000000000000000000000007f35d076ad816f70ecc88576ff60596124e46e35',
          '0x0000000000000000000000000cc11418f3e46a54e54d508848f8781f51274da6',
        ],
        data:
          '0x00000000000000000000000000000000000000000000000025748203b464a664',
        blockNumber: '0x16b1e5',
        transactionIndex: '0x3',
        transactionHash:
          '0x7235f1557fc8f91f674df4162f2e0eb8a5e9436ad77d8f2c7aeeea2d7121db0d',
        blockHash:
          '0xdf74f1afadf6c4359615f9548b3ddff4c84460a1f0d9f8d166c210a79171f7e8',
        logIndex: '0x4',
        removed: false,
      },
      {
        address: '0x7f35d076ad816f70ecc88576ff60596124e46e35',
        topics: [
          '0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1',
        ],
        data:
          '0x00000000000000000000000000000000000000000000013a051d45e01269d18600000000000000000000000000000000000000000000001563f95ebc53fa6539',
        blockNumber: '0x16b1e5',
        transactionIndex: '0x3',
        transactionHash:
          '0x7235f1557fc8f91f674df4162f2e0eb8a5e9436ad77d8f2c7aeeea2d7121db0d',
        blockHash:
          '0xdf74f1afadf6c4359615f9548b3ddff4c84460a1f0d9f8d166c210a79171f7e8',
        logIndex: '0x5',
        removed: false,
      },
      {
        address: '0x7f35d076ad816f70ecc88576ff60596124e46e35',
        topics: [
          '0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822',
          '0x000000000000000000000000f3ce4655a44146c8eefbf45651f6479f9d67a77a',
          '0x0000000000000000000000000cc11418f3e46a54e54d508848f8781f51274da6',
        ],
        data:
          '0x00000000000000000000000000000000000000000000000223c006d6b7c1628d0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000025748203b464a664',
        blockNumber: '0x16b1e5',
        transactionIndex: '0x3',
        transactionHash:
          '0x7235f1557fc8f91f674df4162f2e0eb8a5e9436ad77d8f2c7aeeea2d7121db0d',
        blockHash:
          '0xdf74f1afadf6c4359615f9548b3ddff4c84460a1f0d9f8d166c210a79171f7e8',
        logIndex: '0x6',
        removed: false,
      },
    ],
  },
  addLiquidity1: {
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
  addLiquidity2: {
    blockHash:
      '0x30647a4380f82606cb1538bf56bf95d5ce3d97ffd5f9753b454cd8c555915c0c',
    blockNumber: 1485449,
    hash: '0x89d2e9345c01630a3d0a7357bc015288c1f91c914cda4f6d83ea06844078da04',
    timestamp: 1614974539,
    input:
      '0xe8e337000000000000000000000000000826180a4c981d5095cb5c48bb2a098a44cf6f7300000000000000000000000020e3dd746ddf519b23ffbbb6da7a5d33ea6349d600000000000000000000000000000000000000000000000035c6f74f86e3e54c00000000000000000000000000000000000000000000000000000015c5dda1670000000000000000000000000000000000000000000000003582219816db138200000000000000000000000000000000000000000000000000000015a9ff151300000000000000000000000036e2bcfe0348bf33ecbcf01415714f394e519da9000000000000000000000000000000000000000000000000000000006042934a',
    value: '0',
    gas: 178934,
    gasPrice: 11809800000,
    nonce: '0xe1',
    transactionIndex: 1,
    from: '0x36e2bcfe0348bf33ecbcf01415714f394e519da9',
    to: '0xf3ce4655a44146c8eefbf45651f6479f9d67a77a',
    status: true,
    gasUsed: 131576,
    contractAddress: '',
    logs: [
      {
        address: '0x0826180a4c981d5095cb5c48bb2a098a44cf6f73',
        topics: [
          '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
          '0x00000000000000000000000036e2bcfe0348bf33ecbcf01415714f394e519da9',
          '0x000000000000000000000000a75f2649ba3fe3144f0c1662fe1ed0c6fb96aac1',
        ],
        data:
          '0x00000000000000000000000000000000000000000000000035c6f74f86e3e54c',
        blockNumber: '0x16aa89',
        transactionIndex: '0x1',
        transactionHash:
          '0x89d2e9345c01630a3d0a7357bc015288c1f91c914cda4f6d83ea06844078da04',
        blockHash:
          '0x30647a4380f82606cb1538bf56bf95d5ce3d97ffd5f9753b454cd8c555915c0c',
        logIndex: '0x0',
        removed: false,
      },
      {
        address: '0x20e3dd746ddf519b23ffbbb6da7a5d33ea6349d6',
        topics: [
          '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
          '0x00000000000000000000000036e2bcfe0348bf33ecbcf01415714f394e519da9',
          '0x000000000000000000000000a75f2649ba3fe3144f0c1662fe1ed0c6fb96aac1',
        ],
        data:
          '0x00000000000000000000000000000000000000000000000000000015c5dda167',
        blockNumber: '0x16aa89',
        transactionIndex: '0x1',
        transactionHash:
          '0x89d2e9345c01630a3d0a7357bc015288c1f91c914cda4f6d83ea06844078da04',
        blockHash:
          '0x30647a4380f82606cb1538bf56bf95d5ce3d97ffd5f9753b454cd8c555915c0c',
        logIndex: '0x1',
        removed: false,
      },
      {
        address: '0xa75f2649ba3fe3144f0c1662fe1ed0c6fb96aac1',
        topics: [
          '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
          '0x0000000000000000000000000000000000000000000000000000000000000000',
          '0x00000000000000000000000036e2bcfe0348bf33ecbcf01415714f394e519da9',
        ],
        data:
          '0x00000000000000000000000000000000000000000000000000021f8e3dc03aa7',
        blockNumber: '0x16aa89',
        transactionIndex: '0x1',
        transactionHash:
          '0x89d2e9345c01630a3d0a7357bc015288c1f91c914cda4f6d83ea06844078da04',
        blockHash:
          '0x30647a4380f82606cb1538bf56bf95d5ce3d97ffd5f9753b454cd8c555915c0c',
        logIndex: '0x2',
        removed: false,
      },
      {
        address: '0xa75f2649ba3fe3144f0c1662fe1ed0c6fb96aac1',
        topics: [
          '0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1',
        ],
        data:
          '0x000000000000000000000000000000000000000000000011d5222b27f4af6ad1000000000000000000000000000000000000000000000000000007384c0378ff',
        blockNumber: '0x16aa89',
        transactionIndex: '0x1',
        transactionHash:
          '0x89d2e9345c01630a3d0a7357bc015288c1f91c914cda4f6d83ea06844078da04',
        blockHash:
          '0x30647a4380f82606cb1538bf56bf95d5ce3d97ffd5f9753b454cd8c555915c0c',
        logIndex: '0x3',
        removed: false,
      },
      {
        address: '0xa75f2649ba3fe3144f0c1662fe1ed0c6fb96aac1',
        topics: [
          '0x4c209b5fc8ad50758f13e2e1088ba56a560dff690a1c6fef26394f4c03821c4f',
          '0x000000000000000000000000f3ce4655a44146c8eefbf45651f6479f9d67a77a',
        ],
        data:
          '0x00000000000000000000000000000000000000000000000035c6f74f86e3e54c00000000000000000000000000000000000000000000000000000015c5dda167',
        blockNumber: '0x16aa89',
        transactionIndex: '0x1',
        transactionHash:
          '0x89d2e9345c01630a3d0a7357bc015288c1f91c914cda4f6d83ea06844078da04',
        blockHash:
          '0x30647a4380f82606cb1538bf56bf95d5ce3d97ffd5f9753b454cd8c555915c0c',
        logIndex: '0x4',
        removed: false,
      },
    ],
  },
  swapExactTokensForETH1: {
    blockHash:
      '0xc337a7e977172da185b91e3bb2c822ffccb87e400c521d335f0eaa7f67ad776a',
    blockNumber: 1487384,
    hash: '0x2996b349c3986337295c3758b88a6008168a288818cb48fbdfffc557e613babb',
    timestamp: 1615143907,
    input:
      '0x18cbafe500000000000000000000000000000000000000000000000000000040450e38370000000000000000000000000000000000000000000000a618ad59e9ed9d6f2100000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000b38c19f4300e35c8ca44003a4c67f9a45f1d37a90000000000000000000000000000000000000000000000000000000060452832000000000000000000000000000000000000000000000000000000000000000200000000000000000000000020e3dd746ddf519b23ffbbb6da7a5d33ea6349d60000000000000000000000001fa6a37c64804c0d797ba6bc1955e50068fbf362',
    value: '0',
    gas: 184730,
    gasPrice: 11809800000,
    nonce: '0x3ac',
    transactionIndex: 0,
    from: '0xb38c19f4300e35c8ca44003a4c67f9a45f1d37a9',
    to: '0xf3ce4655a44146c8eefbf45651f6479f9d67a77a',
    status: true,
    gasUsed: 121055,
    contractAddress: '',
    logs: [
      {
        address: '0x20e3dd746ddf519b23ffbbb6da7a5d33ea6349d6',
        topics: [
          '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
          '0x000000000000000000000000b38c19f4300e35c8ca44003a4c67f9a45f1d37a9',
          '0x000000000000000000000000039bc8983df1203290d4bc9263d75c7440b1e4bb',
        ],
        data:
          '0x00000000000000000000000000000000000000000000000000000040450e3837',
        blockNumber: '0x16b218',
        transactionIndex: '0x0',
        transactionHash:
          '0x2996b349c3986337295c3758b88a6008168a288818cb48fbdfffc557e613babb',
        blockHash:
          '0xc337a7e977172da185b91e3bb2c822ffccb87e400c521d335f0eaa7f67ad776a',
        logIndex: '0x0',
        removed: false,
      },
      {
        address: '0x1fa6a37c64804c0d797ba6bc1955e50068fbf362',
        topics: [
          '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
          '0x000000000000000000000000039bc8983df1203290d4bc9263d75c7440b1e4bb',
          '0x000000000000000000000000f3ce4655a44146c8eefbf45651f6479f9d67a77a',
        ],
        data:
          '0x0000000000000000000000000000000000000000000000a64332a502fe7e1a82',
        blockNumber: '0x16b218',
        transactionIndex: '0x0',
        transactionHash:
          '0x2996b349c3986337295c3758b88a6008168a288818cb48fbdfffc557e613babb',
        blockHash:
          '0xc337a7e977172da185b91e3bb2c822ffccb87e400c521d335f0eaa7f67ad776a',
        logIndex: '0x1',
        removed: false,
      },
      {
        address: '0x039bc8983df1203290d4bc9263d75c7440b1e4bb',
        topics: [
          '0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1',
        ],
        data:
          '0x000000000000000000000000000000000000000000003add05bf537b5caeab6b000000000000000000000000000000000000000000000000000016efd0780625',
        blockNumber: '0x16b218',
        transactionIndex: '0x0',
        transactionHash:
          '0x2996b349c3986337295c3758b88a6008168a288818cb48fbdfffc557e613babb',
        blockHash:
          '0xc337a7e977172da185b91e3bb2c822ffccb87e400c521d335f0eaa7f67ad776a',
        logIndex: '0x2',
        removed: false,
      },
      {
        address: '0x039bc8983df1203290d4bc9263d75c7440b1e4bb',
        topics: [
          '0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822',
          '0x000000000000000000000000f3ce4655a44146c8eefbf45651f6479f9d67a77a',
          '0x000000000000000000000000f3ce4655a44146c8eefbf45651f6479f9d67a77a',
        ],
        data:
          '0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040450e38370000000000000000000000000000000000000000000000a64332a502fe7e1a820000000000000000000000000000000000000000000000000000000000000000',
        blockNumber: '0x16b218',
        transactionIndex: '0x0',
        transactionHash:
          '0x2996b349c3986337295c3758b88a6008168a288818cb48fbdfffc557e613babb',
        blockHash:
          '0xc337a7e977172da185b91e3bb2c822ffccb87e400c521d335f0eaa7f67ad776a',
        logIndex: '0x3',
        removed: false,
      },
      {
        address: '0x1fa6a37c64804c0d797ba6bc1955e50068fbf362',
        topics: [
          '0x7fcf532c15f0a6db0bd6d0e038bea71d30d808c7d98cb3bf7268a95bf5081b65',
          '0x000000000000000000000000f3ce4655a44146c8eefbf45651f6479f9d67a77a',
        ],
        data:
          '0x0000000000000000000000000000000000000000000000a64332a502fe7e1a82',
        blockNumber: '0x16b218',
        transactionIndex: '0x0',
        transactionHash:
          '0x2996b349c3986337295c3758b88a6008168a288818cb48fbdfffc557e613babb',
        blockHash:
          '0xc337a7e977172da185b91e3bb2c822ffccb87e400c521d335f0eaa7f67ad776a',
        logIndex: '0x4',
        removed: false,
      },
    ],
  },
}
