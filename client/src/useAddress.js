import { keccak256 } from "ethereum-cryptography/keccak";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { toHex, hexToBytes } from "ethereum-cryptography/utils";

function useAddress(props) {
  if (props.length < 32) {
    return;
  } else {
    const publickeyString = hexToBytes(props);
    const publickey = secp256k1.getPublicKey(publickeyString);
    const publickeyHex = toHex(publickey);
    const addressLong = keccak256(publickey);

    const addressByytes = addressLong.slice(-20, addressLong.length);
    const address = toHex(addressByytes);
    const addressOX = `0x${address}`;

    const user = {
      publickey: publickeyHex,
      address: addressOX,
    };

    return user;
  }
}
export default useAddress;
