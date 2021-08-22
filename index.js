const base64 = require("crypto-js/enc-base64");
const sha384 = require("crypto-js/sha384");
const fetch = require('node-fetch')

const firstNums = "942930"


async function main() {
  const res = await fetch("https://exposure-events.tracing.covid19.govt.nz/current-exposure-events.json")
  const data = await res.json()
  const items = data.items
  const glnHashes = items.map(item => item.glnHash)
  const hashes = [...new Set(glnHashes)]

  let matches = 0
  console.log("[")
  for(var i = 0; i <= 9999999; i++) {
    const gln = firstNums + (i + "").padStart(7, '0')
    const glnHash = base64.stringify(sha384(gln))
    if (hashes.includes(glnHash)) {
      matches++;
      if (matches >= hashes.length) {
        console.log(`${JSON.stringify({gln, glnHash})}`)
        return
      }
      else {
        console.log(`${JSON.stringify({gln, glnHash})},`)
      }
    }
  }
  console.log("]")
}

main()