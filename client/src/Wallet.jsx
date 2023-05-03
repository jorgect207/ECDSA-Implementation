import server from "./server";
import useAddress from "./useAddress.js";

function Wallet({
  address,
  setAddress,
  balance,
  setBalance,
  privateKey,
  setPrivateKey,
  signing,
}) {
  async function onChangePrivate(evt) {
    setPrivateKey(evt.target.value);
    signing(privateKey, balance);
  }

  async function onChange(evt) {
    const address = evt.target.value;
    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
      signing(privateKey, balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>
      <label>
        PrivateKey
        <input
          placeholder="Type an privateKey"
          onChange={onChangePrivate}
        ></input>
      </label>

      <label>
        Wallet Address
        <input
          placeholder="Type an address, for example: 0x1"
          onChange={onChange}
        ></input>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
