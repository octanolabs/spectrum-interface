import BigNumber from 'bignumber.js'

BigNumber.set({ DECIMAL_PLACES: 18 })

export default {
  baseBlockReward(height) {
    if (height > 2508545) {
      return new BigNumber(1000000000000000000)
    } else if (height > 2150181) {
      return new BigNumber(2000000000000000000)
    } else if (height > 1791818) {
      return new BigNumber(3000000000000000000)
    } else if (height > 1433454) {
      return new BigNumber(4000000000000000000)
    } else if (height > 1075090) {
      return new BigNumber(5000000000000000000)
    } else if (height > 716727) {
      return new BigNumber(6000000000000000000)
    } else if (height > 358363) {
      return new BigNumber(7000000000000000000)
    } else if (height > 0) {
      return new BigNumber(8000000000000000000)
    } else {
      // genesis
      return new BigNumber(0)
    }
  },

  includeUnclesReward(blockHeight, unclesCount) {
    const reward = new BigNumber(
      this.baseBlockReward(blockHeight).dividedBy(32).times(unclesCount)
    )
    if (reward > 0) {
      return reward
    } else {
      return new BigNumber(0)
    }
  },

  calculateUncleReward(blockNumber, uncleNumber) {
    const baseReward = this.baseBlockReward(blockNumber)
    const uncleReward = ((uncleNumber + 2 - blockNumber) * baseReward) / 2
    if (uncleReward < 0) {
      return 0
    } else {
      return uncleReward
    }
  },

  calculateMintedCoins(blockNumber, unclesCount) {
    const baseReward = this.baseBlockReward(blockNumber)
    const unclesReward = this.includeUnclesReward(blockNumber, unclesCount)
    return new BigNumber(baseReward)
      .plus(unclesReward)
      .div(1000000000000000000)
      .toString()
  },

  calculateTotalRewards(reward, uncles, fees) {
    BigNumber.set({ DECIMAL_PLACES: 18 })
    // base reward
    let r = new BigNumber(reward)
    // add reward for including any uncles
    const u = r.dividedBy(32).times(uncles)
    r = r.plus(u)
    // add txFees
    r = r.plus(fees)
    // from wei
    r = r.div(1000000000000000000)
    return r.toString()
  },
}
