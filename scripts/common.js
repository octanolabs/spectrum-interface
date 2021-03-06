import BigNumber from 'bignumber.js'
import { toChecksumAddress } from 'ethereumjs-util'
import utf8 from 'utf8'
import moment from 'moment'

export default {
  fromWei(value, roundTo = -1) {
    if (roundTo !== -1) {
      BigNumber.config({ DECIMAL_PLACES: roundTo })
    }

    return new BigNumber(value).div(1000000000000000000).toString()
  },
  fromWeiToGwei(value, roundTo = -1) {
    if (roundTo !== -1) {
      BigNumber.config({ DECIMAL_PLACES: roundTo })
    }

    return new BigNumber(value).div(1000000000).toString()
  },
  calcTxFee(gasUsed, gasPrice) {
    return new BigNumber(gasUsed).times(gasPrice).toString()
  },
  addTxFees(reward, txFees) {
    return new BigNumber(reward).plus(txFees).toString()
  },
  hexToDecimal(hex) {
    return new BigNumber(hex.substring(2), 16).toString()
  },
  mulFiat(a, b, decimals) {
    const num = new BigNumber(a)
    if (num.toString() === '0') {
      return '0'
    } else {
      return num.times(b).toFixed(decimals).toString()
    }
  },
  toUtf8(hex) {
    if (hex) {
      let str = ''
      let i = 0
      const l = hex.length
      if (hex.substring(0, 2) === '0x') {
        i = 2
      }
      for (; i < l; i += 2) {
        const code = parseInt(hex.substr(i, 2), 16)
        if (code === 0) {
          break
        }
        str += String.fromCharCode(code)
      }
      try {
        return utf8.decode(str)
      } catch (err) {
        return null
      }
    } else {
      return null
    }
  },
  toAscii(hex) {
    if (hex) {
      let str = ''
      let i = 0
      const l = hex.length
      if (hex.substring(0, 2) === '0x') {
        i = 2
      }
      for (; i < l; i += 2) {
        const code = parseInt(hex.substr(i, 2), 16)
        str += String.fromCharCode(code)
      }

      return str
    } else {
      return null
    }
  },
  toTH(diff, roundTo = -1) {
    if (roundTo !== -1) {
      BigNumber.config({ DECIMAL_PLACES: roundTo })
    }
    return new BigNumber(diff).div(1000000000000).toString()
  },
  toGH(hashrate, roundTo = -1) {
    if (roundTo !== -1) {
      BigNumber.config({ DECIMAL_PLACES: roundTo })
    }
    return new BigNumber(hashrate).div(1000000000).toString()
  },
  formatNumber(val) {
    const split = val.toString().split('.')
    const withCommas = split[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')

    if (split.length < 2) {
      return withCommas
    } else {
      return `${withCommas}.${split[1]}`
    }
  },
  toChecksumAddress(address) {
    return toChecksumAddress(address)
  },
  calcTime(timestamp) {
    return (
      moment().to(timestamp * 1000) +
      ' (' +
      moment.utc(timestamp * 1000).format('lll') +
      ' UTC)'
    )
  },
  calcMarketcap(supply, price) {
    BigNumber.config({ DECIMAL_PLACES: 2 })

    return new BigNumber(supply).multipliedBy(new BigNumber(price)).toString(10)
  },
  calcAvgBlocktime(blocks) {
    const blocktimes = []
    BigNumber.config({ DECIMAL_PLACES: 2 })

    let avgBlockTime = 0
    let hashrate = 0

    let sum = 0
    let count = 0

    blocks.forEach((block) => {
      if (blocks[count + 1]) {
        const btime = block.timestamp - blocks[count + 1].timestamp
        blocktimes.push(btime)
        sum += btime
        count += 1
      }
    })
    avgBlockTime = new BigNumber(sum).div(new BigNumber(blocktimes.length))

    // estimate hashrate based on avg blocktime (GH/s)
    hashrate = new BigNumber(blocks[0].difficulty)
      .div(new BigNumber(avgBlockTime))
      .div(new BigNumber(1000000000))

    return { blocktime: avgBlockTime, hashrate }
  },
}
