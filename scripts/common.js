import BigNumber from 'bignumber.js'
import util from 'ethereumjs-util'
import utf8 from 'utf8'
import moment from 'moment'

export default {
  fromWei(value) {
    return new BigNumber(value).div(1000000000000000000).toString()
  },
  fromWeiToGwei(value) {
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
    return new BigNumber(a)
      .times(b)
      .toFixed(decimals)
      .toString()
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
  toTH(diff, decimals) {
    return new BigNumber(diff)
      .div(1000000000000)
      .toFixed(decimals)
      .toString()
  },
  toGH(hashrate, decimals) {
    return new BigNumber(hashrate)
      .div(1000000000)
      .toFixed(decimals)
      .toString()
  },
  formatNumber(val) {
    if (val) {
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    } else {
      return null
    }
  },
  toChecksumAddress(address) {
    return util.toChecksumAddress(address)
  },
  calcTime(timestamp) {
    return (
      moment().to(timestamp * 1000) +
      ' (' +
      moment.utc(timestamp * 1000).format('lll') +
      ' UTC)'
    )
  }
}
