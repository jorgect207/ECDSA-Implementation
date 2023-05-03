const express = require("express");
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { utf8ToBytes, toHex } = require("ethereum-cryptography/utils");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0x703db49d9666fe254f710c9674496666bbdcbdf2": 100,
  "0xc9bcbe7490873d2056acf60bb98223ba13c4c2af": 50,
  "0x5d5f59d6ddd2f3034a86371be2cf11a3f72996f9": 75,
};

//private keys
//a3b4162039b716f91cca774438005f4800f92ec3cd6d573a82575f9d56f80771
//1ccb1a6fcc9d3f1a1b493eb5911d9c4a710e8639a52a3bd90c60949fa8607836
//d3bc60848218998ee9a00d95a3420bc29cf8ede786f55d583e93afdfc71a5f75

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signatureRSV, hash, publicKey } = req.body;
  console.log(JSON.parse(signatureRSV));
  console.log(signatureRSV);

  const signatureRSVBig = JSON.parse(signatureRSV);

  //converting data to Uin8array

  const hashArray = Object.values(hash);
  const publicKeyArray = Object.values(publicKey);

  const hashBytes = new Uint8Array(Buffer.from(hashArray));
  const publicKeyBytes = new Uint8Array(Buffer.from(publicKeyArray));

  //converting signature to bigint

  const r = BigInt(signatureRSVBig.r);
  const s = BigInt(signatureRSVBig.s);
  const recovery = BigInt(signatureRSVBig.recovery);
  console.log(r);

  const signature = {
    r,
    s,
    recovery,
  };
  console.log(signature);

  const isSigned = secp256k1.verify(signature, hashBytes, publicKeyBytes);
  console.log(isSigned);

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (isSigned) {
    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  } else {
    console.log(false);
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
