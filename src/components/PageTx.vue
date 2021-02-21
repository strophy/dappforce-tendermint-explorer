<template lang="pug">
tm-page(:title="`Transaction ${hash}`")
  div(slot="menu"): tm-tool-bar
    router-link(:to="`/blocks/${height}`")
      i.material-icons chevron_left
      | Block {{ height }}
    a(:href="jsonUrl", target="_blank") JSON

  div(v-if="decodedTx")
    part-tx-data(
      :data="decodedTx",
      name="Transaction Details",
      pathPrefix="tx.",
      :includeFields="[]",
      :excludeFields="[]"
    )
  tm-part(v-else, title="Transaction was not found")
</template>

<script>
import { mapGetters } from "vuex"
import axios from "axios"
import { removeTxPadding, Base64Binary } from "../scripts/tx"
import PartTxData from "./PartTxData"
import { TmListItem, TmPage, TmPart, TmToolBar } from "@tendermint/ui"
import { decode } from "cbor"
import * as bs58 from "bs58"

export default {
  name: "page-block",
  components: {
    TmToolBar,
    TmListItem,
    TmPart,
    TmPage,
    PartTxData,
  },
  computed: {
    ...mapGetters(["blockchain"]),

    hash() {
      return this.$route.params.hash
    },
    prevHeight() {
      return this.block.header.height - 1
    },
    nextHeight() {
      return this.block.header.height + 1
    },
    decodedTx() {
      let { tx, height } = this
      if (!tx) return

      // cw changes
      //let txObj = decodeTx(tx)
      tx = removeTxPadding(removeTxPadding(tx))
      let ab = Base64Binary.decodeArrayBuffer(tx)
      console.log("ab:", ab)
      console.log(`this.txHash: ${this.txHash}`)
      let txObj = decode(ab)

      //encoding binary to text
      const iterate = (obj) => {
        Object.keys(obj).forEach((key) => {
          //console.log(`key: ${key}, value: ${obj[key]}, type: ${Object.prototype.toString.call(obj[key])}` )
          let typeAsString = Object.prototype.toString.call(obj[key])
          if (typeAsString === "[object Uint8Array]") {
            console.log("convert binary value")
            let buf = new Buffer(obj[key])
            //let uint32array = new Uint32Array(buf);
            //let strVal =  buf.toString() // ?? encoding
            //console.log("string value:", strVal);
            //replace value
            //obj[key] = `BINARY VALUE (uint32 array): [${uint32array.toString()}]` //strVal;
            obj[key] = bs58.encode(buf)

            //console.log("BS58 enc ", bs58.encode(buf) )
          } else if (typeof obj[key] === "object") {
            //object but not Uint8Array -> transverse
            iterate(obj[key])
          }
        })
      }
      iterate(txObj);

      let txHash = this.hash
      let block = {
        isRouterLink: true,
        title: "View block details",
        text: height,
        to: { name: "block", params: { block: height } },
      }
      return Object.assign({ block, txHash }, txObj)
    },
  },
  data: () => ({
    jsonUrl: "",
    // hash: this.$route.params.hash,
    tx: void 0,
    height: "",
  }),
  methods: {
    async fetchTx() {
      this.jsonUrl = `${this.blockchain.rpc}/tx?hash=0x${this.hash}`
      console.log(`json url to search TX PAGE : ${this.jsonUrl}`)
      console.log(`this tx hash: ${this.hash}`)
      console.log(`this.blockchain.rpc: ${this.blockchain.rpc}`)
      //this.jsonUrl = `${this.blockchain.rpc}/tx_search?query=\"tx.hash='${this.hash}'\"`

      //cloudwheels - TODO: CHANGE FIXED VALUE
      //this.jsonUrl = `https://rpc.cloudwheels.net:26657/tx_search?query=\"tx.hash='${this.hash}'\"`
      //console.log(`json url to search : ${this.jsonUrl}`)
      let json = await axios.get(this.jsonUrl)
      console.dir(json)
      //cloudwheels - change to index [0] of a tx search reasult by hash, tx page not working???
      this.height = json.data.result.height
      this.tx = json.data.result.tx

      //console.log(`json.data.result.txs[0] : ${JSON.stringify(json.data.result.txs[0])}`);
      //this.height = json.data.result.txs[0].height

      //this.tx = json.data.result.txs[0].tx
      //console.log(`tx to be decoded : ${this.tx}`);
    },
  },
  async mounted() {
    await this.fetchTx()
  },
  watch: {
    // eslint-disable-next-line
    $route(to, from) {
      this.fetchTx()
    },
  },
}
</script>
