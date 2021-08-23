const base64 = require("crypto-js/enc-base64");
const sha384 = require("crypto-js/sha384");
const fetch = require('node-fetch')
const fs = require('fs');


function save(str) {
  console.log(str)
  fs.appendFileSync('glnHashesMap.json', str + "\n");
}

async function main() {
  const res = await fetch("https://exposure-events.tracing.covid19.govt.nz/current-exposure-events.json")
  const dataStr = await res.text()
  console.log('dataStr', dataStr)
  const data = JSON.parse(dataStr)
  const items = data.items
  const glnHashes = items.map(item => item.glnHash)
  const hashes = [...new Set(glnHashes)]
  fs.writeFileSync('glnHashesMap.json', ""); // clear file
  reverseHashes(hashes)
}

function reverseHashes(hashes) {
  const firstNums = "942930"
  let matches = 0
  save('{')
  save(`  "lastUpdatedAt": "${new Date().toISOString()}",`)
  save('  "glnPairs": [')
  for(var i = 0; i <= 9999999; i++) {
    const gln = firstNums + (i + '').padStart(7, '0')
    const glnHash = base64.stringify(sha384(gln))
    if (hashes.includes(glnHash)) {
      matches++;
      if (matches >= hashes.length) {
        save(`    ${JSON.stringify({gln, glnHash})}`)
        break
      }
      save(`    ${JSON.stringify({gln, glnHash})},`)
    }
  }
  save(']')
  save('}')
}

main()
