const base64 = require("crypto-js/enc-base64");
const sha384 = require("crypto-js/sha384");

const firstNums = "942930"

for(var i = 0; i <= 9999999; i++) {
  const gln = firstNums + (i + "").padStart(7, '0')
  const hash = base64.stringify(sha384(gln))
  if (hash === "Dkm1dBQTa+ZTYeYHbXqxpXeCCpmpmHnif/XmFMLxNXbK1Qdmn8QnDoNtSmgJ/2zK") {
    console.log(gln)
    return
  }
}