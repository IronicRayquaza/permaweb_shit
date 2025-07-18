import { connect, createDataItemSigner } from "@permaweb/aoconnect";
import Arweave from "arweave";
import Permaweb from "@permaweb/libs";

const arweave = Arweave.init();
const signer = createDataItemSigner(window.arweaveWallet);
const ao = connect();

const permaweb = Permaweb.init({
  arweave,
  signer,
  ao,
});

export default permaweb;
