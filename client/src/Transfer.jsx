import { useState } from "react";
import server from "./server";

import { secp256k1 } from "ethereum-cryptography/secp256k1";

function Transfer({
  address,
  setBalance,
  signatureRSV,
  hash,
  publicKey,
  transaction,
}) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    const r = signatureRSV.r.toString();
    const s = signatureRSV.s.toString();
    const recovery = signatureRSV.recovery.toString();
    const siganute = { r, s, recovery };

    const dataTo = {
      signatureRSV: JSON.stringify(siganute),
      hash: hash,
      publicKey: publicKey,
      // transaction: transaction,
      sender: address,
      amount: parseInt(sendAmount),
      recipient,
    };

    try {
      const response = await server.post(`send`, dataTo);
      console.log(response); // add this line to check the value of response
      const {
        data: { balance },
      } = response;
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Sing and Transfer" />
    </form>
  );
}

export default Transfer;
