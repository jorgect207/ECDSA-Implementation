const { keccak256 } = require("ethereum-cryptography/keccak");
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");

async function start() {
  const privatekey = secp256k1.utils.randomPrivateKey();
  const privateKeyHex = toHex(privatekey);
  const publickey = secp256k1.getPublicKey(privatekey);
  const publickeyHex = toHex(publickey);
  const addressLong = keccak256(publickey);

  const addressByytes = addressLong.slice(-20, addressLong.length);
  const address = toHex(addressByytes);
  const addressOX = `0x${address}`;

  const user = {
    privatekey: privateKeyHex,
    publickey: publickeyHex,
    address: addressOX,
  };

  console.log(user);
}

start();
