const pools = {
  '0x8429ab69b8721ffb29f2e66fdf06b1c65d66eb58': 'UbiqPool.io',
  '0xa5786b319685e77ab8514fcec26d75557afa5c38': 'UbiqPool.fr',
  '0x6febea2097f777af4ee701e9a09cef1551a397e1': 'UbiqPool.com',
  '0xaeb7897adf9b1309d7ef2dca6f3f6afb65358abd': 'MaxHash.org',
  '0xd9881bacbec51b831ef221f96c05e3891cd99544': 'Minerpool.net',
  '0x8f7120734c25ab63b2a59baeb63b063fec1ba7ff': 'UBQKings.com',
  '0x3cb1f80ad907d10d58896b64bfe2c2f7483c8337': 'HODLPool.com',
  '0xc759e1606051432d4eb3be7a6c34866c3bceca50': 'Millio.nz',
  '0x5eaba45c3962d1522d9ccb2200f0cb6e45e7bf99': 'Suprnova.cc',
  '0xd5bcc99b340504f670e47a04580c1e0cc7678d58': 'Coin-Miners.info',
  '0x19dd880fe54f2259ac0b6952850833afbe2d7b28': 'ALTpool.pro',
  '0xd144e30a0571aaf0d0c050070ac435deba461fab': 'Clona.ru',
  '0x81f87d1049d47cc772e6a4e9110817f0646ab411': 'Whalesburg.com',
  '0xf35074bbd0a9aee46f4ea137971feec024ab704e': 'Solopool.org',
  '0x4bdf392a77a498c3bfde9f8cc4ca45982cb06c72': 'Anorak.tech',
  '0x438cfa62edc703f4f0806e72082a02bf39bc0a1d': 'Ubiqminers.com',
  '0x5553fac50a765fcc2c5be8a17e0be8dfe02ebb37': 'Pool.sexy',
  '0xaa5091ec0c91847fd72262241949d811303f945f': 'Zet-tech.eu',
  '0x437ea033e1ad8a3c7a2385a9d11e8161587113b5': 'Miningclub.info',
  '0xafda64d9e03deb48698b6914bf13225ee95900c6': 'Ubiq.cc',
  '0x9ad0e9f488da8b2b0b6b6899570e7680ca07f65f': 'Aikapool.com',
  '0xd4259e490a20dd1884ed61fd33a92ce6f9eb140f': 'Cryptodig.ru',
  '0x7b9a3f220e2820f0da3d0e365a729f2fb8b351c6': 'Miner-hash.cloud',
  '0x0ebf873b343ab004d5a95479c58645bd75f4c42b': 'ReiDoCoin.com.br',
  '0x59b5ff7ef75bdbbf78f341eeb1bcbc2a908edd67': 'Mole-pool.net',
  '0xab36ab822061b832f3415d4f03c279c33c372b81': 'WattPool.net',
  '0x445da4f490dc72b864cf4b6073c955de3d146469': 'WattPool.net - solo',
  '0x444431cc65abe2d63d32831f53da9911ad5e2771': 'Kryptex.org',
  '0xc41c97958872dc4e041985ec7812d3fb9e6bdfc9': 'Phoenixmax.org',
  '0xf7f646c39f4af456b77eee3c38b74bcc5d0cffda': 'Minefitz.com',
  '0xe6057c46aab37d69fa30bb2975081f76ca7319be': 'EU-ubqpool.ddns.net',
  '0x43d09b75912dbf0fc804faad6255e3faa40630a2': 'CrazyPool.org',
  '0x47fcd3d2565167f45671dd93a20d821c9782a006': 'DigiPools.org',
}

const misc = {
  // Exchanges
  '0xb3c4e9ca7c12a6277deb9eef2dece65953d1c864': 'Bittrex',
  '0xde89c4687984d7cb91cacdd084003ffdf36e493a': 'Cryptopia', // UBQ
  '0x6b7bcaebcbe0b92f879cfe5ed2cdb34247d49f0d': 'Cryptopia', // ERC20 OLD
  '0x81e8416fabcfb122964b61e24e8b005fb1c7081b': 'Cryptopia', // ERC20
  '0x57e0ebfade42211c8a4837ad1bb9c1c290ee265b': 'Einstein',
  '0x11e328fd0ee99a2c2f5e929a8f25afb94cecb660': 'ERC20 Exchange',
  // Other
  '0x2300b30dfd91306a5acfa8ae00a3a47d519303ee': 'Infinitum Card',
  '0xae3f04584446aa081cd98011f80f19977f8c10e0': 'Infinitum Flame',
  '0x8b26b5712399447ea6dc9def5ddace05f08122c8': 'Augmentum',
  // Tokens
  '0xd245207cfbf6eb6f34970db2a807ab1d178fde6c': 'APX',
  '0xff3bf057adf3b0e015b6465331a6236e55688274': 'BeerToken',
  '0x79755ea6ccb143b0bd8e1b670efffd59ae874991': 'BettingWin',
  '0x0319b92eb57929684c27531da133b0d2bbf691af': 'Cauli',
  '0x08533d6a06ce365298b12ef92eb407cba8aa8273': 'CryptopiaFeeShare',
  '0x94ad7e41c1d44022c4f47cb1ba019fd1a022c536': 'Dotcoin',
  '0xcf3222b7fda7a7563b9e1e6c966bead04ac23c36': 'Escher',
  '0x105bbb0fd91329bec3f12546cbe7edfe624ec3ad': 'Giveaway',
  '0x500684ce0d4f04abedff3e54fcf8acc5e6cfc4bd': 'GeoCoin',
  '0x0826180a4c981d5095cb5c48bb2a098a44cf6f73': '10grans',
  '0x4b4899a10f3e507db207b0ee2426029efa168a67': 'Qwark',
  '0x5e1715bb79805bd672729760b3f7f34d6f485098': 'PickleRicks',
  '0x497e20586f86c35592ff8f65cde94f296514c387': 'Snarg01',
  '0xbc3e373d2b24faf1dfe5b3f3acff9d66a7b48869': 'WorldBit Token',
  '0x1fa6a37c64804c0d797ba6bc1955e50068fbf362': 'Wrapped UBQ',
  '0x7845fcbe28ac19ab7ec1c1d9674e34fdcb4917db': 'Ink',
  // Contracts
  '0x256009e4687ab2183bbca3e4ea54ba6f0a7ad21e': 'ESCH Airdrop #1',
  '0x36ae3bdbbd19bc55f2fe3cccf41bf12c4c3afb42': 'ESCH Airdrop #2',
  '0x1cac28619f78cdf8da22f9cf523f995d3fe7e98c': 'ESCH Airdrop #3',
  '0x0AB4aB630841F93bA2CC588DB4a7e646A38B58Ed': 'ESCH Airdrop #4',
  '0x9c4d9c73FDbEa2eF0a96E8651122576E5449f113': 'ESCH Airdrop #5',
  '0xfcd0b547b89f001c17d50df98cf10ce406da5518': 'UIP #1',
  '0x96cf38c234d5e513c4fc783a3ba73d7320f2900b': 'UIP #2',
  '0x073c6b68ba00c59163fa3ae79d7C3D263f78981E': 'UIP #4',
  // Shinobi
  '0xba831e62ac14d8500cef0367b14f383d7b1b1b0a': 'Shinobi (Factory)',
  '0xf3ce4655a44146c8eefbf45651f6479f9d67a77a': 'Shinobi (Router)',
  // Poster shop
  '0x0ec8ce8fcba64592286a2b3f31c0d4a5e54fd309': 'Ubiq Redeemable Poster',
  '0x07786a37c664b1a8ed536204c6f93bf7195ed8f6': 'Ubiq Poster Reserve',
  '0xdef0a14dd84962791ac4877e07b8e8cf6ac4854a': 'Ubiq Poster Shop #0',
  '0x21dc859f6b054dcc82f019db139664026674cdd9': 'Ubiq Poster Shop #1',
}

export default {
  getAddressTag(hash) {
    if (misc[hash]) {
      return misc[hash]
    } else if (pools[hash]) {
      return pools[hash]
    } else {
      return null
    }
  },
  pools,
}
