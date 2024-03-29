<template>
  <span>
    <div
      v-if="inline"
      :class="['addressIdenticon', size, 'inline']"
      :style="{
        backgroundImage: 'url(' + blockieImg + ')',
        verticalAlign: 'top',
      }"
    ></div>
    <div
      v-else
      :class="['addressIdenticon', size]"
      :style="{ backgroundImage: 'url(' + blockieImg + ')' }"
    ></div>
  </span>
</template>

<script>
export default {
  props: {
    address: {
      type: String,
      default() {
        return null
      },
    },
    size: {
      type: String,
      default() {
        return 'med'
      },
    },
    inline: {
      type: Boolean,
      default() {
        return false
      },
    },
  },
  data() {
    return {
      randseed: new Array(4),
      blockieImg: '',
    }
  },
  watch: {
    address(val) {
      this.blockieImg = this.createIcon({
        seed: val.toLowerCase(),
        size: 8,
        scale: 16,
      }).toDataURL()
    },
  },
  created() {
    let seed = this.address || ''
    if (this.address) {
      seed = seed.toLowerCase()
    }

    if (seed.length < 1) {
      seed = Math.floor(Math.random() * Math.pow(10, 16)).toString(16)
      this.seedrand(seed)
    }

    if (seed) {
      this.blockieImg = this.createIcon({
        seed,
        size: 8,
        scale: 16,
      }).toDataURL()
    }
  },
  methods: {
    seedrand(seed) {
      for (let i = 0; i < this.randseed.length; i++) {
        this.randseed[i] = 0
      }
      for (let n = 0; n < seed.length; n++) {
        this.randseed[n % 4] =
          (this.randseed[n % 4] << 5) -
          this.randseed[n % 4] +
          seed.charCodeAt(n)
      }
    },
    rand() {
      // based on Java's String.hashCode(), expanded to 4 32bit values
      const t = this.randseed[0] ^ (this.randseed[0] << 11)
      this.randseed[0] = this.randseed[1]
      this.randseed[1] = this.randseed[2]
      this.randseed[2] = this.randseed[3]
      this.randseed[3] =
        this.randseed[3] ^ (this.randseed[3] >> 19) ^ t ^ (t >> 8)
      return (this.randseed[3] >>> 0) / ((1 << 31) >>> 0)
    },
    createColor() {
      // saturation is the whole color spectrum
      const h = Math.floor(this.rand() * 360)
      // saturation goes from 40 to 100, it avoids greyish colors
      const s = this.rand() * 60 + 40 + '%'
      // lightness can be anything from 0 to 100, but probabilities are a bell curve around 50%
      const l =
        (this.rand() + this.rand() + this.rand() + this.rand()) * 25 + '%'
      const color = 'hsl(' + h + ',' + s + ',' + l + ')'
      return color
    },
    createImageData(size) {
      const width = size // Only support square icons for now
      const height = size
      const dataWidth = Math.ceil(width / 2)
      const mirrorWidth = width - dataWidth
      const data = []
      for (let y = 0; y < height; y++) {
        let row = []
        for (let x = 0; x < dataWidth; x++) {
          // this makes foreground and background color to have a 43% (1/2.3) probability
          // spot color has 13% chance
          row[x] = Math.floor(this.rand() * 2.3)
        }
        const r = row.slice(0, mirrorWidth)
        r.reverse()
        row = row.concat(r)
        for (let i = 0; i < row.length; i++) {
          data.push(row[i])
        }
      }
      return data
    },
    buildOpts(opts) {
      const newOpts = {}
      newOpts.size = opts.size || 8
      newOpts.scale = opts.scale || 4
      newOpts.seed =
        opts.seed || Math.floor(Math.random() * Math.pow(10, 16)).toString(16)
      this.seedrand(newOpts.seed)
      newOpts.color = this.createColor()
      newOpts.bgcolor = this.createColor()
      newOpts.spotcolor = this.createColor()
      return newOpts
    },
    renderIcon(opts, canvas) {
      opts = this.buildOpts(opts || {})
      const imageData = this.createImageData(opts.size)
      const width = Math.sqrt(imageData.length)
      canvas.width = canvas.height = opts.size * opts.scale
      const cc = canvas.getContext('2d')
      cc.fillStyle = opts.bgcolor
      cc.fillRect(0, 0, canvas.width, canvas.height)
      cc.fillStyle = opts.color
      for (let i = 0; i < imageData.length; i++) {
        // if data is 0, leave the background
        if (imageData[i]) {
          const row = Math.floor(i / width)
          const col = i % width
          // if data is 2, choose spot color, if 1 choose foreground
          cc.fillStyle = imageData[i] === 1 ? opts.color : opts.spotcolor
          cc.fillRect(
            col * opts.scale,
            row * opts.scale,
            opts.scale,
            opts.scale
          )
        }
      }
      return canvas
    },
    createIcon(opts) {
      const canvas = document.createElement('canvas')
      this.renderIcon(opts, canvas)
      return canvas
    },
  },
}
</script>

<style lang="scss">
.address-identicon-container {
  padding: 0;
  text-align: left;
  max-width: 4.5rem;
}

.address-identicon-container-right {
  text-align: right;
  .addressIdenticon {
    float: right;
  }
}

.address-identicon-container-offline {
  padding: 0;
  margin-left: -15px;
}

.addressIdenticon {
  width: 100%;
  height: auto;
  // padding-bottom: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  // border-radius: 50%;
}

.addressIdenticon.xl {
  width: 5rem;
  height: 5rem;
  padding: 0;
}

.addressIdenticon.lg {
  width: 4rem;
  height: 4rem;
  padding: 0;
}

.addressIdenticon.md {
  width: 3rem;
  height: 3rem;
  padding: 0;
}
.addressIdenticon.sm {
  width: 2rem;
  height: 2rem;
  padding: 0;
}

.addressIdenticon.xs {
  width: 1rem;
  height: 1rem;
  padding: 0;
}

.addressIdenticon.fourty {
  width: 40px;
  height: 40px;
  padding: 0;
}

.addressIdenticon.inline {
  display: inline-block;
}

.identicon-column {
  width: 55px;
}
.v-input__append-inner {
  margin-top: 0 !important;
}
</style>
