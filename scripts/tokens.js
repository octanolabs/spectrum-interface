import BigNumber from 'bignumber.js'

function stripHexPrefix(str) {
  if (typeof str !== 'string') {
    return str
  }
  return isHexPrefixed(str) ? str.slice(2) : str
}

function zeroPad(len) {
  const str = '0'
  return str.repeat(len)
}

function isHexPrefixed(str) {
  if (typeof str !== 'string') {
    return false
  }
  return str.slice(0, 2) === '0x'
}

function addHexPrefix(str) {
  if (typeof str !== 'string') {
    return str
  }
  return isHexPrefixed(str) ? str : '0x' + str
}

function toAddress(str) {
  if (typeof str !== 'string') {
    return str
  }
  return addHexPrefix(str.substr(24)).toLowerCase()
}

function toBigNumber(str) {
  if (typeof str !== 'string') {
    return str
  }
  return new BigNumber(addHexPrefix(str), 16)
}

export default {
  processInputData(txn, inputData) {
    let v1 = []
    let v2 = []
    let v3 = []
    let a1 = ''
    let a2 = ''
    // let a3 = ''
    switch (inputData.methodId) {
      case '0xa9059cbb': // transfer
        return [
          {
            type: 'erc20',
            from: txn.from,
            to: toAddress(inputData.params[0]),
            value: toBigNumber(inputData.params[1]),
            contract: txn.to,
          },
        ]
      case '0x23b872dd': // transferFrom
        return [
          {
            type: 'erc20',
            from: toAddress(inputData.params[0]),
            to: toAddress(inputData.params[1]),
            value: toBigNumber(inputData.params[2]),
            contract: txn.to,
          },
        ]
      case '0x6ea056a9': // sweep
        return [
          {
            type: 'erc20', // bittrex
            from: txn.to,
            to: txn.from,
            value: toBigNumber(inputData.params[1]),
            contract: toAddress(inputData.params[0]),
          },
        ]
      case '0x40c10f19': // mint
        return [
          {
            type: 'erc20',
            from: '0x0',
            to: toAddress(inputData.params[0]),
            value: toBigNumber(inputData.params[1]),
            contract: txn.to,
          },
        ]
      case '0x7ff36ab5': // swapExactETHForTokens - shinobi
        v1 = txn.logs[2].data.match(/.{1,66}/g)
        return [
          {
            type: 'native',
            from: txn.from,
            to: txn.to,
            value: txn.value,
          },
          {
            type: 'erc20',
            from: txn.to,
            to: toAddress(inputData.params[2]),
            value: toBigNumber(v1[0]),
            contract: toAddress(inputData.params[6]),
          },
        ]
      case '0x18cbafe5': // swapExactTokensForETH - shinobi
        v1 = txn.logs[4].data.match(/.{1,66}/g)
        return [
          {
            type: 'erc20',
            from: toAddress(inputData.params[3]),
            to: txn.to,
            value: toBigNumber(inputData.params[0]),
            contract: toAddress(inputData.params[6]),
          },
          {
            type: 'native',
            from: txn.to,
            to: txn.from,
            value: toBigNumber(v1[0]),
          },
        ]
      case '0xf305d719': // addLiquidityETH - shinobi
        if (txn.logs.length === 6) {
          // add UBQ and ERC20
          a1 = txn.logs[3].address
          v1 = txn.logs[3].data.match(/.{1,66}/g)
        } else {
          // add ERC20 and UBQ
          a1 = txn.logs[4].address
          v1 = txn.logs[4].data.match(/.{1,66}/g)
        }
        return [
          {
            type: 'native',
            from: txn.from,
            to: txn.to,
            value: txn.value,
          },
          {
            type: 'erc20',
            from: txn.from,
            to: txn.to,
            value: toBigNumber(inputData.params[1]),
            contract: toAddress(inputData.params[0]),
          },
          {
            type: 'erc20',
            action: 'Minted',
            from: '0x0',
            to: txn.from,
            value: toBigNumber(v1[0]),
            contract: a1,
          },
        ]
      case '0x02751cec': // removeLiquidityETH - shinobi
        if (txn.logs.length === 6) {
          // add UBQ and ERC20
          a1 = txn.logs[3].address
          v1 = txn.logs[3].data.match(/.{1,66}/g)
        } else {
          // remove ERC20 and UBQ
          a1 = txn.logs[3].address
          a2 = txn.logs[1].address
          v1 = txn.logs[2].data.match(/.{1,66}/g)
          v2 = txn.logs[3].data.match(/.{1,66}/g)
          v3 = txn.logs[1].data.match(/.{1,66}/g)
        }
        return [
          {
            type: 'native',
            from: txn.to,
            to: txn.from,
            value: toBigNumber(v1[0]),
          },
          {
            type: 'erc20',
            from: txn.to,
            to: txn.from,
            value: toBigNumber(v2[0]),
            contract: a1,
          },
          {
            type: 'erc20',
            action: 'Burned',
            from: txn.from,
            to: '0x0',
            value: toBigNumber(v3[0]),
            contract: a2,
          },
        ]
      case '0xe8e33700': // addLiquidity - shinobi
        a1 = txn.logs[3].address
        v1 = txn.logs[0].data.match(/.{1,66}/g)
        v2 = txn.logs[1].data.match(/.{1,66}/g)
        v3 = txn.logs[3].data.match(/.{1,66}/g)
        return [
          {
            type: 'erc20',
            from: txn.from,
            to: txn.to,
            value: toBigNumber(v1[0]),
            contract: toAddress(inputData.params[0]),
          },
          {
            type: 'erc20',
            from: txn.from,
            to: txn.to,
            value: toBigNumber(v2[0]),
            contract: toAddress(inputData.params[1]),
          },
          {
            type: 'erc20',
            action: 'Minted',
            from: '0x0',
            to: txn.from,
            value: toBigNumber(v3[0]),
            contract: toAddress(a1),
          },
        ]
      default:
        return [
          {
            type: 'native',
            from: txn.from,
            to: txn.to,
            value: txn.value,
          },
        ]
    }
  },
  zeroPadAddress(str) {
    if (typeof str !== 'string') {
      return str
    }
    return zeroPad(24) + stripHexPrefix(str)
  },
}
