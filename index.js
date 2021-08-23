const base64 = require("crypto-js/enc-base64");
const sha384 = require("crypto-js/sha384");
const fetch = require('node-fetch')
const fs = require('fs');


function save(file, str) {
  console.log(str)
  fs.appendFileSync(file, str + "\n");
}

async function main() {
  const res = await fetch("https://exposure-events.tracing.covid19.govt.nz/current-exposure-events.json")
  const dataStr = await res.text()
  console.log('dataStr', dataStr)
  const data = JSON.parse(dataStr)
  const items = data.items
  const glnHashes = items.map(item => item.glnHash)
  const hashes = [...new Set(glnHashes)]
  fs.writeFileSync('glnPairs.json', ''); // clear file
  fs.writeFileSync('lastUpdatedAt.json', `"${new Date().toISOString()}"`); // rewrite file
  reverseHashes(hashes)
}

function reverseHashes(hashes) {
  const firstNums = "942930"
  let matches = 0
  save('glnPairs.json', '[')
  for(var i = 0; i <= 9999999; i++) {
    const gln = firstNums + (i + '').padStart(7, '0')
    const glnHash = base64.stringify(sha384(gln))
    if (hashes.includes(glnHash)) {
      matches++;
      if (matches >= hashes.length) {
        save('glnPairs.json', `  ${JSON.stringify({gln, glnHash})}`)
        break
      }
      save('glnPairs.json', `  ${JSON.stringify({gln, glnHash})},`)
    }
  }
  save('glnPairs.json', ']')
}

main()
