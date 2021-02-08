const functions = {
  // erc20
  '0x095ea7b3': 'approve(address _spender, uint256 _value)',
  '0x42966c68': 'burn(uint256 _value)',
  '0x79cc6790': 'burnFrom(address _from, uint256 _value)',
  '0x66188463': 'decreaseApproval(address _spender, uint256 _subtractedValue)',
  '0x7d64bcb4': 'finishMinting()',
  '0xd73dd623': 'increaseApproval(address _spender, uint256 _addedValue)',
  '0x40c10f19': 'mint(address _to, uint256 _amount)',
  '0xf2fde38b': 'transferOwnership(address newOwner)',
  '0xa9059cbb': 'transfer(address _to, uint256 _value)',
  '0x23b872dd': 'transferFrom(address _from, address _to, uint256 _value)',
  // multisig (Fusion)
  '0x173825d9': 'removeOwner(address _owner)',
  '0x5c52c2f5': 'resetSpentToday()',
  '0x7065cb48': 'addOwner(address _owner)',
  '0x797af627': 'confirm(bytes32 _h)',
  '0xb20d30a9': 'setDailyLimit(uint256 _newLimit)',
  '0xb61d27f6': 'execute(address _to, uint256 _value, bytes _data)',
  '0xb75c7dc6': 'revoke(bytes32 _operation)',
  '0xba51a6df': 'changeRequirement(uint256 _newRequired)',
  '0xc2cf7326': 'hasConfirmed(bytes32 _operation, address _owner)',
  '0xcbf0b0c0': 'kill(address _to)',
  '0xf00d4b5d': 'changeOwner(address _from, address _to)',
  // escher
  '0x4e71d92d': 'claim()',
  '0x0121b93f': 'vote(uint256 candidate)',
  // trex user wallet
  '0x6ea056a9': 'sweep(address _token, uint256 _amount)',
  '0xc0ee0b8a': 'tokenFallback(address _from, uint256 _value, bytes _data)',
  // trex controller
  '0x19449cb2': 'changeAuthorizedCaller(address _newCaller)',
  '0x28090abb':
    'logSweep(address from, address to, address token, uint256 amount)',
  '0x3c18d318': 'sweeperOf(address _token)',
  '0x5e949fa0': 'changeDestination(address _dest)',
  '0x5ed7ca5b': 'halt()',
  '0x77bb09eb': 'addSweeper(address _token, address _sweeper)',
  '0xa6f9dae1': 'changeOwner(address _owner)',
  '0xa9b1d507': 'makeWallet()',
  '0xbe9a6555': 'start()',
  // Erc20.exchange
  '0x04804ee8': 'sell(string token, uint256 amount, uint256 price)',
  '0x06909f69': 'cancel(string token, uint256 index)',
  '0x07da68f5': 'stop()',
  '0x1dffdbe6': 'trade(string token, uint256 maker, uint256 taker)',
  '0x7b8bf4fd':
    'set_fee(uint256 the_maker_fee, uint256 the_taker_fee, uint256 the_deploy_fee)',
  '0x7cb97b2b': 'set_owner(address new_owner)',
  '0x9b0a5e67': 'buy(string token, uint256 amount, uint256 price)',
  '0x9d2cd67c': 'collect_main_fee()',
  '0xb2f05133': 'set_trader(address new_trader)',
  '0xc5346fb1': 'approve_coin(string coin, bool approved)',
  '0xe142400e':
    'createToken(string symbol, string name, address coin_address, uint8 decimals)',
  '0xe7b1a7ae': 'collect_fee(string token)',
  '0xe95d74e0':
    'set_coin_minimum_trade(string token, uint256 the_minimum_trade)',
  '0xeca6e42d': 'set_minimum_trade(uint256 the_minimum_trade)',
  '0xf29f7b1b': 'remove_coin(uint256 index)',
  '0xf780d867':
    'add_coin(string coin, string name, address base, uint8 digits)',
  // tornado.cash
  '0xb214faa5': 'deposit(bytes32 _commitment)',
  '0x21a0adb6':
    'withdraw(bytes _proof, bytes32 _root, bytes32 _nullifierHash, address _recipient, address _relayer, uint256 _fee, unit256 _refund)',
  '0x97fc007c': 'updateVerifier(address _newVerifier)',
  '0x06394c9b': 'changeOperator(address _newOperator)',
  // uniswap-v2-core
  '0xc9c65396': 'createPair(address tokenA, address tokenB)',
  '0xf46901ed': 'setFeeTo(address _feeTo)',
  '0xa2e74af6': 'setFeeToSetter(address _feeToSetter)',
  '0x89afcb44': 'burn(address to)',
  '0x485cc955': 'initialize(address _token0, address _token1)',
  '0x6a627842': 'mint(address to)',
  '0xd505accf':
    'permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s)',
  '0xbc25cf77': 'skim(address to)',
  '0x022c0d9f':
    'swap(uint256 amount0out, uint256 amount1Out, address to, bytes data)',
  '0xfff6cae9': 'sync()',
  // uniswap-v2-periphery
  '0xe8e33700':
    'addLiquidity(address tokenA, address tokenB, uint256 amountADesired, uint256 amountAMin, uint256 amountBMin, address to, uint256 deadline)',
  '0xf305d719':
    'addLiquidityETH(address token, uint256 amountTokenDesired, uint256 amountTokenMin, uint256 amountETHMin, uint256 deadline)',
  '0xbaa2abde':
    'removeLiquidity(address tokenA, address tokenB, uint256 liquidity, uint256 amountAMin, uint256 amountBMin, address to, uint256 deadline)',
  '0x02751cec':
    'removeLiquidityETH(address token, uint256 liquidity, uint256 amountTokenMin, uint256 amountETHMin, address to, uint256 deadline)',
  '0xaf2979eb':
    'removeLiquidityETHSupportingFeeOnTransferTokens(address token, uint256 liquidity, uint256 amountTokenMin, uint256 amountETHMin, address to, uint256 deadline)',
  '0xded9382a':
    'removeLiquidityETHWithPermit(address token, uint256 liquidity, uint256 amountTokenMin, uint256 amountETHMin, address to, uint256 deadline, bool approveMax, uint8 v, bytes32 r, bytes32 s)',
  '0x5b0d5984':
    'removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(address token, uint256 liquidity, uint256 amountTokenMin, uint256 amountETHMin, address to, uint256 deadline, bool approveMax, uint8 v, bytes32 r, bytes32 s)',
  '0x2195995c':
    'removeLiquidityWithPermit(address tokenA, address tokenB, uint256 liquidity, uint256 amountAMin, unit256 amountBMin, address to, uint256 deadline, bool approveMax, uint8 v, bytes32 r, bytes32 s)',
  '0xfb3bdb41':
    'swapETHForExactTokens(uint256 amountOut, address[] path, address to, uint256 deadline)',
  '0x7ff36ab5':
    'swapExactETHForTokens(uint256 amountOutMin, address[] path, address to, uint256 deadline)',
  '0xb6f9de95':
    'swapExactETHForTokensSupportingFeeOnTransferTokens(uint256 amountOutMin, address[] path, address to, uint256 deadline)',
  '0x18cbafe5':
    'swapExactTokensForETH(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline)',
  '0x791ac947':
    'swapExactTokensForETHSupportingFeeOnTransferTokens(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline)',
  '0x38ed1739':
    'swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline)',
  '0x5c11d795':
    'swapExactTokensForTokensSupportingFeeOnTransferTokens(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline)',
  '0x4a25d94a':
    'swapTokensForExactETH(uint256 amountOut, uint256 amountInMax, address[] path, address to, uint256 deadline)',
  '0x8803dbee':
    'swapTokensForExactTokens(uint256 amountOut, uint256 amountInMax, address[] path, address to, uint256 deadline)',
  // staking rewards
  '0xa694fc3a': 'stake(uint256 amount)',
  '0x2e1a7d4d': 'withdraw(uint256 amount)',
  '0x3d18b912': 'getReward()',
  '0xe9fad8ee': 'exit()',
  // ERC1155
  '0xa22cb465': 'setApprovalForAll(address operator, bool approved)',
  '0xf242432a':
    'safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes data)',
  '0x2eb2c2d6':
    'safeBatchTransferFrom(address from, address to, uint256[] ids, uint256[] amounts, bytes data)',
}

const events = {
  // erc20
  '0x0f6798a5': 'Mint(index_topic_1 address to, uint256 amount)',
  '0xae5184fb': 'Mintfinished()',
  '0xcc16f5db': 'Burn(index_topic_1 address burner, uint256 value)',
  '0x8be0079c':
    'OwnershipTransferred(index_topic_1 address previousOwner, index_topic_2 address newOwner)',
  '0x8c5be1e5':
    'Approval(index_topic_1 address owner, index_topic_2 address spender, uint256 value)',
  '0xddf252ad':
    'Transfer(index_topic_1 address from, index_topic_2 address to, uint256 value)',
  // multisig (Fusion)
  '0xe1c52dc6': 'Confirmation(address owner, bytes32 operation)',
  '0xc7fb647e': 'Revoke(address owner, bytes32 operation)',
  '0xb532073b': 'OwnerChanged(address oldOwner, address newOwner)',
  '0x994a9366': 'OwnerAdded(address newOwner)',
  '0x58619076': 'OwnerRemoved(address oldOwner)',
  '0xacbdb084': 'RequirementChanged(uint256 newRequirement)',
  '0xe1fffcc4': 'Deposit(address from, uint256 value)',
  '0x92ca3a80':
    'SingleTransact(address owner, uint256 value, address to, bytes data)',
  '0xe7c957c0':
    'MultiTransact(address owner, bytes32 operation, uint256 value, address to, bytes data)',
  '0x1733cbb5':
    'ConfirmationNeeded(bytes32 operation, address initiator, uint256 value, address to, bytes data)',
  // escher
  '0x5ff467d6': 'onClaim(index_topic_1 address claimer)',
  '0x3fa7ed1e':
    'onVote(index_topic_1 address voter, index_topic_2 uint256 candidate)',
  // trex controller
  '0xef4c8685': 'LogNewWallet(address receiver)',
  '0xa64da754':
    'LogSweep(index_topic_1 address from, index_topic_2 address to, index_topic_3 address token, uint256 amount)',
  // tornado
  '0xa945e51e':
    'Deposit(index_topic_1 bytes32 commitment, uint32 leafIndex, uint256 timestamp)',
  '0xe9e508ba':
    'Withdrawal(address to, bytes32 nullifierHash, index_topic_1 address relayer, uint256 fee)',
  // uniswap-v2-core
  '0x0d3648bd':
    'PairCreated(index_topic_1 address token0, index_topic_2 address token1, address pair, uint256)',
  '0xdccd412f':
    'Burn(index_topic_1 address sender, uint256 amount0, uint256 amount1, index_topic_2 address to)',
  '0x4c209b5f':
    'Mint(index_topic_1 address sender, uint256 amount0, unint256 amount1)',
  '0xd78ad95f':
    'Swap(index_topic_1 address sender, uint256 amount0In, uint256 amount1In, uint256 amount0Out uint256 amount1Out, index_topic_2 address to)',
  '0x1c411e9a': 'Sync(uint112 reserve0, uint112 reserve1)',
  // ERC1155
  '0x17307eab':
    'ApprovalForAll(index_topic_1 address account, index_topic_2 address operator, bool approved)',
  '0x4a39dc06':
    'TransferBatch(index_topic_1 address operator, index_topic_2 address from, index_topic_3 address to, uint256[] ids, uint256[] values)',
  '0xc3d58168':
    'TransferSingle(index_topic_1 address operator, index_topic_2 address from, index_topic_3 address to, uint256 id, uint256 value)',
  '0x6bb7ff70': 'URI(string value, index_topic_1 uint256 id)',
}

export default {
  processTxnInput(str) {
    if (!str || str.length < 10) {
      return {
        isKnown: false,
      }
    }
    const methodId = str.substr(0, 10).toLowerCase()
    if (functions[methodId]) {
      return {
        isKnown: true,
        methodId,
        function: functions[methodId],
        params: str.substr(10).match(/.{1,64}/g),
      }
    } else {
      return {
        isKnown: false,
      }
    }
  },
  processEventLogs(logs_) {
    const logs = []
    logs_.forEach(function (item) {
      const eventId = item.topics[0].substr(0, 10).toLowerCase()
      let isKnown = false
      let name = ''
      if (events[eventId]) {
        isKnown = true
        name = events[eventId]
      }
      logs.push({
        address: item.address,
        index: item.logIndex,
        isKnown,
        name,
        topics: item.topics,
        data: item.data.substr(2).match(/.{1,64}/g),
      })
    })
    return logs
  },
  tokenTransferSuccess(txnLogs) {
    const eventId = txnLogs[0].topics[0].substr(0, 10).toLowerCase()
    if (events[eventId]) {
      return true
    } else {
      return false
    }
  },
}
