import BigNumber from 'bignumber.js'
import contracts from './contracts.js'

const NULL_ADDRESS = '0x0000000000000000000000000000000000000000'
const WUBQ_ADDRESS = '0x1fa6a37c64804c0d797ba6bc1955e50068fbf362'
const SHINOBI_ROUTER = '0xf3ce4655a44146c8eefbf45651f6479f9d67a77a'

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
  return addHexPrefix(str.substr(26)).toLowerCase()
}

function toBigNumber(str) {
  if (typeof str !== 'string') {
    return str
  }
  return new BigNumber(addHexPrefix(str), 16)
}

export default {
  processInputData(txn, inputData) {
    const logs = contracts.processEventLogs(txn.logs)
    const transfers = []
    // if value > 0 push default standard transfer
    if (txn.value > 0) {
      transfers.push({
        from: txn.from,
        to: txn.to,
        value: txn.value,
        action: 'Transferred',
        type: 'native',
      })
    }
    // check for additional transfers in the event logs
    for (const log of logs) {
      let action = 'Transferred'
      let from = txn.from
      let to = txn.to
      let type = 'native'
      let contract = null
      let value = txn.value
      let push = false
      if (log.isKnown) {
        contract = log.address
        value = toBigNumber(log.data[0])
        if (log.name.startsWith('Transfer')) {
          // is a TransferEvent TODO: check TransferFrom - iquidus
          from = toAddress(log.topics[1])
          to = toAddress(log.topics[2])
          type = 'erc20'
          if (from === NULL_ADDRESS) {
            action = 'Minted'
          } else if (to === NULL_ADDRESS) {
            action = 'Burned'
          }
          push = true
        } else if (
          log.name.startsWith('Deposit') &&
          log.address === WUBQ_ADDRESS
        ) {
          // UBQ wrapped to WUBQ
          type = 'native'
          action = 'Wrapped'
          from = toAddress(log.topics[1])
          to = log.address
          push = true
        } else if (
          log.name.startsWith('Withdrawal') &&
          log.address === WUBQ_ADDRESS
        ) {
          // WUBQ unwrapped to UBQ
          to = null
          type = 'native'
          action = 'Unwrapped'
          from = toAddress(log.topics[1])
          // shinobi hack for liquidity removes (display the final event)
          if (from === SHINOBI_ROUTER) {
            // push the unwrap and prep the ubiq transfer
            transfers.push({
              type,
              from,
              to,
              value,
              contract,
              action,
            })
            to = txn.from
            action = 'Transferred'
          }
          push = true
        }
        if (push) {
          // push to transfers
          transfers.push({
            type,
            from,
            to,
            value,
            contract,
            action,
          })
        }
      }
    }
    return transfers
  },
  zeroPadAddress(str) {
    if (typeof str !== 'string') {
      return str
    }
    return zeroPad(24) + stripHexPrefix(str)
  },
}
