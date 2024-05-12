import { ApisauceInstance, create } from "apisauce";
import {
  Base64Tx,
  ConstructCreateHyperWalletTxParams,
  HyperWalletAccount,
} from "@/lib/types";
import {
  GetHyperWalletAccountResponse,
  ConstructTxReponse,
  ConstructTransferLamportsTxParams,
  ConstructTransferSplTxParams,
  ConstructHyperTransferLamportsTxParams,
  ConstructHyperTransferSplTxParams,
  GetNftsResponse,
  ConstructTransferNftTxParams,
  ConstructHyperTransferNftTxParams,
  GetTokensResponse,
  GetTransactionsResponse,
  ConstructOtpSetupParams,
  ConstructDisableOtpParams,
  ConstructEnableOtpParams,
  ConstructEnableWhitelistParams,
  ConstructDisableWhitelistParams,
} from "./types";
import { WalletNft, WalletToken, WalletTransaction } from "@/types";

export class Api {
  _apisauce: ApisauceInstance;

  constructor() {
    this._apisauce = create({
      baseURL: "http://192.168.31.60:3000",
      timeout: 30000,
    });
  }

  // -------------------
  // General wallet apis
  // -------------------

  async getTokens(address: string): Promise<WalletToken[]> {
    const res = await this._apisauce.get<GetTokensResponse>(
      `/wallet/tokens?address=${address}`
    );
    return res.data.tokens;
  }

  async getNfts(address: string): Promise<WalletNft[]> {
    const res = await this._apisauce.get<GetNftsResponse>(
      `/wallet/nfts?address=${address}`
    );
    return res.data.nfts;
  }

  async getTransactions(address: string): Promise<WalletTransaction[]> {
    const res = await this._apisauce.get<GetTransactionsResponse>(
      "/wallet/transactions",
      {
        address,
      }
    );
    return res.data.transactions;
  }

  // -----------------
  // Solana wallet api
  // -----------------

  async constructTransferLamportsTx(
    params: ConstructTransferLamportsTxParams
  ): Promise<Base64Tx> {
    const { fromAddress, toAddress, lamports } = params;
    const res = await this._apisauce.post<ConstructTxReponse>(
      "/solana-wallet/tx/transfer-lamports",
      {
        fromAddress,
        toAddress,
        lamports,
      }
    );
    const { base64tx } = res.data;
    return base64tx;
  }

  async constructTransferSplTx(
    params: ConstructTransferSplTxParams
  ): Promise<Base64Tx> {
    const { fromAddress, toAddress, tokenMintAddress, rawAmount } = params;
    const res = await this._apisauce.post<ConstructTxReponse>(
      "/solana-wallet/tx/transfer-spl",
      {
        fromAddress,
        toAddress,
        tokenMintAddress,
        rawAmount,
      }
    );
    const { base64tx } = res.data;
    return base64tx;
  }

  async constructTransferNftTx(
    params: ConstructTransferNftTxParams
  ): Promise<Base64Tx> {
    const { fromAddress, toAddress, nftMintAddress } = params;
    const res = await this._apisauce.post<ConstructTxReponse>(
      "/solana-wallet/tx/transfer-nft",
      {
        fromAddress,
        toAddress,
        nftMintAddress,
      }
    );
    const { base64tx } = res.data;
    return base64tx;
  }

  // ----------------
  // Hyper wallet api
  // ----------------

  async getHyperWalletAccount(
    hyperWalletPda: string
  ): Promise<HyperWalletAccount> {
    const res = await this._apisauce.get<GetHyperWalletAccountResponse>(
      `/hyper-wallet?address=${hyperWalletPda}`
    );
    return res.data.hyperWalletAccount;
  }

  async constructCreateHyperWalletTx(
    params: ConstructCreateHyperWalletTxParams
  ): Promise<Base64Tx> {
    const { hyperWalletPda, ownerAddress } = params;
    const { data } = await this._apisauce.post<{ base64tx: Base64Tx }>(
      "hyper-wallet/tx/create-hyper-wallet",
      {
        hyperWalletPda,
        ownerAddress,
      }
    );
    return data.base64tx;
  }

  async constructCloseHyperWalletTx(params) {
    const { hyperWalletPda, ownerAddress } = params;
    const res = await this._apisauce.post<ConstructTxReponse>(
      "/hyper-wallet/tx/close-hyper-wallet",
      {
        hyperWalletPda,
        ownerAddress,
      }
    );
    return res.data.base64tx;
  }

  async constructHyperTransferLamportsTx(
    params: ConstructHyperTransferLamportsTxParams
  ): Promise<Base64Tx> {
    const {
      fromHyperWalletPda,
      hyperWalletOwnerAddress,
      toAddress,
      lamports,
      otpHash,
      proofHash,
    } = params;
    const res = await this._apisauce.post<ConstructTxReponse>(
      "/hyper-wallet/tx/transfer-lamports",
      {
        fromHyperWalletPda,
        hyperWalletOwnerAddress,
        toAddress,
        lamports,
        otpHash,
        proofHash,
      }
    );
    const { base64tx } = res.data;
    return base64tx;
  }

  async constructHyperTransferSplTx(
    params: ConstructHyperTransferSplTxParams
  ): Promise<Base64Tx> {
    const {
      fromHyperWalletPda,
      hyperWalletOwnerAddress,
      toAddress,
      tokenMintAddress,
      rawAmount,
      otpHash,
      proofHash,
    } = params;
    const res = await this._apisauce.post<ConstructTxReponse>(
      "/hyper-wallet/tx/transfer-spl",
      {
        fromHyperWalletPda,
        hyperWalletOwnerAddress,
        toAddress,
        tokenMintAddress,
        rawAmount,
        otpHash,
        proofHash,
      }
    );
    const { base64tx } = res.data;
    return base64tx;
  }

  async constructHyperTransferNftTx(
    params: ConstructHyperTransferNftTxParams
  ): Promise<Base64Tx> {
    const {
      fromHyperWalletPda,
      hyperWalletOwnerAddress,
      toAddress,
      nftMintAddress,
    } = params;
    const res = await this._apisauce.post<ConstructTxReponse>(
      "/hyper-wallet/tx/transfer-nft",
      {
        fromHyperWalletPda,
        hyperWalletOwnerAddress,
        toAddress,
        nftMintAddress,
      }
    );
    const { base64tx } = res.data;
    return base64tx;
  }

  async constructSetupOtpTx(params: ConstructOtpSetupParams) {
    const { hyperWalletPda, hyperWalletOwnerAddress, initTime, root } = params;
    const res = await this._apisauce.post<ConstructTxReponse>(
      "/hyper-wallet/tx/otp/set-up",
      {
        hyperWalletPda,
        hyperWalletOwnerAddress,
        initTime,
        root,
      }
    );
    return res.data.base64tx;
  }

  async constructEnableOtpTx(
    params: ConstructEnableOtpParams
  ): Promise<Base64Tx> {
    const { hyperWalletPda, hyperWalletOwnerAddress } = params;
    const res = await this._apisauce.post<ConstructTxReponse>(
      "/hyper-wallet/tx/otp/enable",
      {
        hyperWalletPda,
        hyperWalletOwnerAddress,
      }
    );
    return res.data.base64tx;
  }

  async constructDisableOtpTx(
    params: ConstructDisableOtpParams
  ): Promise<Base64Tx> {
    const { hyperWalletPda, hyperWalletOwnerAddress } = params;
    console.log("🚀 ~ Api ~ { hyperWalletPda, hyperWalletOwnerAddress }:", {
      hyperWalletPda,
      hyperWalletOwnerAddress,
    });
    const res = await this._apisauce.post<ConstructTxReponse>(
      "/hyper-wallet/tx/otp/disable",
      {
        hyperWalletPda,
        hyperWalletOwnerAddress,
      }
    );
    return res.data.base64tx;
  }

  async constructEnableWhitelistTx(
    params: ConstructEnableWhitelistParams
  ): Promise<Base64Tx> {
    const { hyperWalletPda, hyperWalletOwnerAddress } = params;
    const res = await this._apisauce.post<ConstructTxReponse>(
      "/hyper-wallet/tx/whitelist/enable",
      {
        hyperWalletPda,
        hyperWalletOwnerAddress,
      }
    );
    return res.data.base64tx;
  }
  async constructDisableWhitelistTx(
    params: ConstructDisableWhitelistParams
  ): Promise<Base64Tx> {
    const { hyperWalletPda, hyperWalletOwnerAddress } = params;
    const res = await this._apisauce.post<ConstructTxReponse>(
      "/hyper-wallet/tx/whitelist/disable",
      {
        hyperWalletPda,
        hyperWalletOwnerAddress,
      }
    );
    return res.data.base64tx;
  }
  async constructAddToWhitelistTx(params: unknown) {}
  async constructRemoveFromWhitelistTx(params: unknown) {}

  async constructEnableSpendingLimitTx() {}
  async constructDisableSpendingLimitTx() {}
  async constructAddSpendingLimitTx() {}
  async constructRemoveSpendingLimitTx() {}
}

export const api = new Api();
