import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes } from "ethereum-cryptography/utils";
import { secp256k1 } from "ethereum-cryptography/secp256k1";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState(
    "d3bc60848218998ee9a00d95a3420bc29cf8ede786f55d583e93afdfc71a5f75"
  );
  const [transaction, setTransaction] = useState({});

  async function signTransac(privateKey, balance) {
    const hash = keccak256(utf8ToBytes(privateKey), balance);
    const signature = secp256k1.sign(hash, privateKey);

    setTransaction({
      signatureRSV: signature,
      hash: hash,
      publicKey: secp256k1.getPublicKey(privateKey),
    });

    console.log(transaction);
    console.log(signature);
    return transaction;
  }

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
        privateKey={privateKey}
        setPrivateKey={setPrivateKey}
        signing={signTransac}
      />
      <Transfer
        setBalance={setBalance}
        address={address}
        signatureRSV={transaction.signatureRSV}
        hash={transaction.hash}
        publicKey={transaction.publicKey}
        transaction={transaction}
      />
    </div>
  );
}

export default App;
