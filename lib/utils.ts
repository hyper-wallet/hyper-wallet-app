import {PublicKey} from "@solana/web3.js";
import {HYPER_PROGRAM_ID} from "@/lib/constants";

export const getHyperWalletPda = (ownerAddress: string) => {
    const [pda] = PublicKey.findProgramAddressSync([(new PublicKey(ownerAddress)).toBuffer()], new PublicKey(HYPER_PROGRAM_ID));
    return pda;
}

export function signTransaction() {

}