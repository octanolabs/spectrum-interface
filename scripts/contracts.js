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
  // ERC1155 / Poster
  '0xa22cb465': 'setApprovalForAll(address operator, bool approved)',
  '0xf242432a':
    'safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes data)',
  '0x2eb2c2d6':
    'safeBatchTransferFrom(address from, address to, uint256[] ids, uint256[] amounts, bytes data)',
  '0xf5298aca': 'burn(address account, uint256 id, uint256 value)',
  '0x6b20c454': 'burnBatch(address account, uint256[] ids, uint256[] values)',
  '0x2f2ff15d': 'grantRole(bytes32 role, address account)',
  '0x731133e9': 'mint(address to, uint256 id, uint256 amount, bytes data)',
  '0x1f7fdffa':
    'mintBatch(address to, uint256[] ids, uint256[] values, bytes data)',
  '0x8456cb59': 'pause()',
  '0x36568abe': 'renounceRole(bytes role, address account)',
  '0xd547741f': 'revokeRole(bytes role, address account)',
  '0x3f4ba83a': 'upause()',
  // PosterShop
  '0xec8ac4d8': 'buyTokens(address beneficiary)',
  '0x715018a6': 'renounceOwnership()',
  '0x34fcf437': 'setRate(uint256 _rate)',
  '0x144fa6d7': 'setToken(address _token)',
  '0x8ee25267': 'setTokenID(uint256 _tokenID)',
  '0xdeaa59df': 'setWallet(address _wallet)',
  // WUBQ
  '0xd0e30db0': 'deposit()',
  // 0x - ZeroEx
  '0x972fdd26': 'getFunctionImplementation(bytes4)',
  // 0x - OwnableFeature
  '0x261fe679': 'migrate(address,bytes,address)',
  '0x8da5cb5b': 'owner()',
  // 0x - BootstrapFeature
  '0x73f208d5': 'bootstrap(address,bytes)',
  '0x35f46994': 'die()',
  // 0x - SimpleFunctionRegistryFeature
  '0x6eb224cb': 'extend(bytes4,address)',
  '0x6ba6bbc2': 'getRollbackEntryAtIndex(bytes4,uint256)',
  '0xdfd00749': 'getRollbackLength(bytes4)',
  '0x9db64a40': 'rollback(bytes4,address)',
  // 0x - generic
  '0xfb969b0a': 'bootstrap()',
  '0x8fd3ab80': 'migrate()',
  // 0x - ERC721OrdersFeature
  '0xeae93ee7':
    'batchBuyERC721s((uint8,address,address,uint256,uint256,address,uint256,(address,uint256,bytes)[],address,uint256,(address,bytes)[])[],(uint8,uint8,bytes32,bytes32)[],bytes[],bool)',
  '0x86219940': 'batchCancelERC721Orders(uint256[])',
  '0x7da9e2cf':
    'batchMatchERC721Orders((uint8,address,address,uint256,uint256,address,uint256,(address,uint256,bytes)[],address,uint256,(address,bytes)[])[],(uint8,address,address,uint256,uint256,address,uint256,(address,uint256,bytes)[],address,uint256,(address,bytes)[])[],(uint8,uint8,bytes32,bytes32)[],(uint8,uint8,bytes32,bytes32)[])',
  '0xfbee349d':
    'buyERC721((uint8,address,address,uint256,uint256,address,uint256,(address,uint256,bytes)[],address,uint256,(address,bytes)[]),(uint8,uint8,bytes32,bytes32),bytes)',
  '0xbe167b9d': 'cancelERC721Order(uint256)',
  '0xb73a6027':
    'getERC721OrderHash((uint8,address,address,uint256,uint256,address,uint256,(address,uint256,bytes)[],address,uint256,(address,bytes)[]))',
  '0xfbc4a518':
    'getERC721OrderStatus((uint8,address,address,uint256,uint256,address,uint256,(address,uint256,bytes)[],address,uint256,(address,bytes)[]))',
  '0x030b2730': 'getERC721OrderStatusBitVector(address,uint248)',
  '0x0d8261eb':
    'matchERC721Orders((uint8,address,address,uint256,uint256,address,uint256,(address,uint256,bytes)[],address,uint256,(address,bytes)[]),(uint8,address,address,uint256,uint256,address,uint256,(address,uint256,bytes)[],address,uint256,(address,bytes)[]),(uint8,uint8,bytes32,bytes32),(uint8,uint8,bytes32,bytes32))',
  '0x150b7a02': 'onERC721Received(address,address,uint256,bytes)',
  '0x462103af':
    'preSignERC721Order((uint8,address,address,uint256,uint256,address,uint256,(address,uint256,bytes)[],address,uint256,(address,bytes)[]))',
  '0xafde1b3c':
    'sellERC721((uint8,address,address,uint256,uint256,address,uint256,(address,uint256,bytes)[],address,uint256,(address,bytes)[]),(uint8,uint8,bytes32,bytes32),uint256,bool,bytes)',
  '0x4a13d797':
    'validateERC721OrderProperties((uint8,address,address,uint256,uint256,address,uint256,(address,uint256,bytes)[],address,uint256,(address,bytes)[]),uint256)',
  '0xd1ca183b':
    'validateERC721OrderSignature((uint8,address,address,uint256,uint256,address,uint256,(address,uint256,bytes)[],address,uint256,(address,bytes)[]),(uint8,uint8,bytes32,bytes32))',
  // 0x - ERC1155OrdersFeature
  '0x84680615':
    'batchBuyERC1155s((uint8,address,address,uint256,uint256,address,uint256,(address,uint256,bytes)[],address,uint256,(address,bytes)[],uint128)[],(uint8,uint8,bytes32,bytes32)[],uint128[],bytes[],bool)',
  '0xa1865d6f': 'batchCancelERC1155Orders(uint256[])',
  '0x7cdb54d8':
    'buyERC1155((uint8,address,address,uint256,uint256,address,uint256,(address,uint256,bytes)[],address,uint256,(address,bytes)[],uint128),(uint8,uint8,bytes32,bytes32),uint128,bytes)',
  '0x06d2596b': 'cancelERC1155Order(uint256)',
  '0x1de3a7ac':
    'getERC1155OrderHash((uint8,address,address,uint256,uint256,address,uint256,(address,uint256,bytes)[],address,uint256,(address,bytes)[],uint128))',
  '0x4991fd72':
    'getERC1155OrderInfo((uint8,address,address,uint256,uint256,address,uint256,(address,uint256,bytes)[],address,uint256,(address,bytes)[],uint128))',
  '0xf23a6e61': 'onERC1155Received(address,address,uint256,uint256,bytes)',
  '0x7b757d97':
    'preSignERC1155Order((uint8,address,address,uint256,uint256,address,uint256,(address,uint256,bytes)[],address,uint256,(address,bytes)[],uint128))',
  '0x6e2eec9e':
    'sellERC1155((uint8,address,address,uint256,uint256,address,uint256,(address,uint256,bytes)[],address,uint256,(address,bytes)[],uint128),(uint8,uint8,bytes32,bytes32),uint256,uint128,bool,bytes)',
  '0x2ac6f62a':
    'validateERC1155OrderProperties((uint8,address,address,uint256,uint256,address,uint256,(address,uint256,bytes)[],address,uint256,(address,bytes)[],uint128),uint256)',
  '0x0d32a531':
    'validateERC1155OrderSignature((uint8,address,address,uint256,uint256,address,uint256,(address,uint256,bytes)[],address,uint256,(address,bytes)[],uint128),(uint8,uint8,bytes32,bytes32))',
  // 0x - ERC165Feature
  '0x75e79be6': 'supportInterface(bytes4)',
  // 0x - OtcOrdersFeature
  '0xe52d1764':
    'batchFillTakerSignedOtcOrders((address,address,uint128,uint128,address,address,address,uint256)[],(uint8,uint8,bytes32,bytes32)[],(uint8,uint8,bytes32,bytes32)[],bool[])',
  '0xdac748d4':
    'fillOtcOrder((address,address,uint128,uint128,address,address,address,uint256),(uint8,uint8,bytes32,bytes32),uint128)',
  '0xa578efaf':
    'fillOtcOrderForEth((address,address,uint128,uint128,address,address,address,uint256),(uint8,uint8,bytes32,bytes32),uint128)',
  '0x706394d5':
    'fillOtcOrderWithEth((address,address,uint128,uint128,address,address,address,uint256),(uint8,uint8,bytes32,bytes32))',
  '0x4f948110':
    'fillTakerSignedOtcOrder((address,address,uint128,uint128,address,address,address,uint256),(uint8,uint8,bytes32,bytes32),(uint8,uint8,bytes32,bytes32))',
  '0x724d3953':
    'fillTakerSignedOtcOrderForEth((address,address,uint128,uint128,address,address,address,uint256),(uint8,uint8,bytes32,bytes32),(uint8,uint8,bytes32,bytes32))',
  '0x53476b89':
    'getOtcOrderHash((address,address,uint128,uint128,address,address,address,uint256))',
  '0x8c807c43':
    'getOtcOrderInfo((address,address,uint128,uint128,address,address,address,uint256))',
  '0x59ebfb45': 'lastOtcTxOriginNonce(address,uint64)',
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
  // ERC1155 / Poster
  '0x17307eab':
    'ApprovalForAll(index_topic_1 address account, index_topic_2 address operator, bool approved)',
  '0x4a39dc06':
    'TransferBatch(index_topic_1 address operator, index_topic_2 address from, index_topic_3 address to, uint256[] ids, uint256[] values)',
  '0xc3d58168':
    'TransferSingle(index_topic_1 address operator, index_topic_2 address from, index_topic_3 address to, uint256 id, uint256 value)',
  '0x6bb7ff70': 'URI(string value, index_topic_1 uint256 id)',
  '0x62e78cea': 'Paused(address account)',
  '0xbd79b86f':
    'RoleAdminChanged(index_topic_1 bytes32 role, index_topic_2 bytes32 previousAdminRole, index_topic_3 bytes32 newAdminRole)',
  '0x2f878811':
    'RoleGranted(index_topic_1 bytes32 role, index_topic_2 address account, index_topic_3 address sender)',
  '0xf6391f5c':
    'RoleRevoked(index_topic_1 bytes32 role, index_topic_2 address account, index_topic_3 address sender)',
  '0x5db9ee0a': 'Unpaused(address account)',
  // Postershop
  '0xe65c987b': 'RateUpdated(uint256 newRate)',
  '0x9842cf83': 'TokenIDUpdated(uint256 tokenID)',
  '0x5ba6b30c': 'TokenUpdated(address token)',
  '0x6faf9323':
    'TokensPurchased(index_topic_1 address purchaser, index_topic_2 address beneficiary, uint256 value, uint256 amount)',
  '0x4edbfac5': 'WalletUpdated(address wallet)',
  // WUBQ
  '0x7fcf532c': 'Withdrawal(index_topic_1 address src, uint256 wad)',
  // 0x - OwnableFeature
  '0xe1b831b0': 'Migrated(address,address,address)',
  // 0x - SimpleFunctionRegistryFeature
  '0x2ae22108': 'ProxyFunctionUpdated(bytes4,address,address)',
  // 0x - ERC721OrdersFeature
  '0xa015ad2d': 'ERC721OrderCancelled(address,uint256)',
  '0x50273fa0':
    'ERC721OrderFilled(uint8,address,address,uint256,address,uint256,address,uint256,address)',
  '0x8c5d0c41':
    'ERC721OrderPreSigned(uint8,address,address,uint256,uint256,address,uint256,(address,uint256,bytes)[],address,uint256,(address,bytes)[])',
  // 0x - ERC1155OrdersFeature
  '0x4d5ea7da': 'ERC1155OrderCancelled(address,uint256)',
  '0x20cca81b':
    'ERC1155OrderFilled(uint8,address,address,uint256,address,uint256,address,uint256,uint128,address)',
  '0x5e91ddfe':
    'ERC1155OrderPreSigned(uint8,address,address,uint256,uint256,address,uint256,(address,uint256,bytes)[],address,uint256,(address,bytes)[],uint128)',
  // 0x - OtcOrdersFeature
  '0xac75f773':
    'OtcOrderFilled(bytes32,address,address,address,address,uint128,uint128)',
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
