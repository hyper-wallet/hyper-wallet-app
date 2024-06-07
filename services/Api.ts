import { ApisauceInstance, create } from "apisauce";
import {
  Base64Tx,
  ConstructCloseHyperWalletTxParams,
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
  ConstructAddToWhitelistParams,
  ConstructRemoveFromWhitelistParams,
  CreateWalletTransactionParams,
} from "./Api.types";
import { WalletNft, WalletToken, WalletTransaction } from "@/types";

class Api {
  _apisauce: ApisauceInstance;

  constructor(baseUrl: string) {
    this._apisauce = create({
      baseURL: baseUrl,
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
    if (!res.data) throw new Error("error while constructing transaction");
    return res.data.tokens;
  }

  async getNfts(address: string): Promise<WalletNft[]> {
    const res = await this._apisauce.get<GetNftsResponse>(
      `/wallet/nfts?address=${address}`
    );
    if (!res.data) throw new Error("error while constructing transaction");
    return res.data.nfts;
  }

  async getTransactions(
    address: string,
    lastLoadedSignature?: string
  ): Promise<WalletTransaction[]> {
    const res = await this._apisauce.get<GetTransactionsResponse>(
      "/wallet/transactions",
      {
        address,
        lastLoadedSignature,
      }
    );
    if (!res.data) throw new Error("Error while constructing transaction");
    return res.data.transactions;
  }

  async createTransaction(params: CreateWalletTransactionParams) {
    const { signature, type, fromAddress, toAddress, token, amount, value } =
      params;
    const res = await this._apisauce.post<GetTransactionsResponse>(
      "/wallet/transactions",
      {
        signature,
        type,
        fromAddress,
        toAddress,
        token,
        amount,
        value,
      }
    );
    if (!res.data) throw new Error("Error while constructing transaction");
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
    if (!res.data) throw new Error("Error while constructing transaction");
    return res.data.base64tx;
  }

  async constructTransferSplTx(
    params: ConstructTransferSplTxParams
  ): Promise<Base64Tx> {
    const { fromAddress, toAddress, tokenMintAddress, rawAmount, feeToken } =
      params;
    const res = await this._apisauce.post<ConstructTxReponse>(
      "/solana-wallet/tx/transfer-spl",
      {
        fromAddress,
        toAddress,
        tokenMintAddress,
        rawAmount,
        feeToken,
      }
    );
    if (!res.data) throw new Error("Error while constructing transaction");
    return res.data.base64tx;
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
    if (!res.data) throw new Error("Error while constructing transaction");
    return res.data.base64tx;
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
    if (!res.data) throw new Error("Error while constructing transaction");
    return res.data.hyperWalletAccount;
  }

  async constructCreateHyperWalletTx(
    params: ConstructCreateHyperWalletTxParams
  ): Promise<Base64Tx> {
    const { hyperWalletPda, ownerAddress } = params;
    const res = await this._apisauce.post<{ base64tx: Base64Tx }>(
      "hyper-wallet/tx/create-hyper-wallet",
      {
        hyperWalletPda,
        ownerAddress,
      }
    );
    if (!res.data) throw new Error("Error while constructing transaction");
    return res.data.base64tx;
  }

  async constructCloseHyperWalletTx(params: ConstructCloseHyperWalletTxParams) {
    const { hyperWalletPda, ownerAddress } = params;
    const res = await this._apisauce.post<ConstructTxReponse>(
      "/hyper-wallet/tx/close-hyper-wallet",
      {
        hyperWalletPda,
        ownerAddress,
      }
    );
    if (!res.data) throw new Error("Error while constructing transaction");
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
    if (!res.data) throw new Error("Error while constructing transaction");
    return res.data.base64tx;
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
      feeToken,
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
        feeToken,
      }
    );
    if (!res.data) throw new Error("Error while constructing transaction");
    return res.data.base64tx;
  }

  async constructHyperTransferNftTx(
    params: ConstructHyperTransferNftTxParams
  ): Promise<Base64Tx> {
    const {
      fromHyperWalletPda,
      hyperWalletOwnerAddress,
      toAddress,
      nftMintAddress,
      otpHash,
      proofHash,
      feeToken,
    } = params;
    const res = await this._apisauce.post<ConstructTxReponse>(
      "/hyper-wallet/tx/transfer-nft",
      {
        fromHyperWalletPda,
        hyperWalletOwnerAddress,
        toAddress,
        nftMintAddress,
        otpHash,
        proofHash,
        feeToken,
      }
    );
    if (!res.data) throw new Error("Error while constructing transaction");
    return res.data.base64tx;
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
    if (!res.data) throw new Error("Error while constructing transaction");
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
    if (!res.data) throw new Error("Error while constructing transaction");
    return res.data.base64tx;
  }

  async constructDisableOtpTx(
    params: ConstructDisableOtpParams
  ): Promise<Base64Tx> {
    const { hyperWalletPda, hyperWalletOwnerAddress } = params;
    const res = await this._apisauce.post<ConstructTxReponse>(
      "/hyper-wallet/tx/otp/disable",
      {
        hyperWalletPda,
        hyperWalletOwnerAddress,
      }
    );
    if (!res.data) throw new Error("Error while constructing transaction");
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
    if (!res.data) throw new Error("Error while constructing transaction");
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
    if (!res.data) throw new Error("Error while constructing transaction");
    return res.data.base64tx;
  }
  async constructAddToWhitelistTx(params: ConstructAddToWhitelistParams) {
    const { hyperWalletPda, hyperWalletOwnerAddress, addressToBeAdded } =
      params;
    const res = await this._apisauce.post<ConstructTxReponse>(
      "/hyper-wallet/tx/whitelist/add",
      {
        hyperWalletPda,
        hyperWalletOwnerAddress,
        addressToBeAdded,
      }
    );
    if (!res.data) throw new Error("Error while constructing transaction");
    return res.data.base64tx;
  }
  async constructRemoveFromWhitelistTx(
    params: ConstructRemoveFromWhitelistParams
  ) {
    const { hyperWalletPda, hyperWalletOwnerAddress, addressToBeRemoved } =
      params;
    const res = await this._apisauce.post<ConstructTxReponse>(
      "/hyper-wallet/tx/whitelist/remove",
      {
        hyperWalletPda,
        hyperWalletOwnerAddress,
        addressToBeRemoved,
      }
    );
    if (!res.data) throw new Error("Error while constructing transaction");
    return res.data.base64tx;
  }

  async constructEnableSpendingLimitTx() {}
  async constructDisableSpendingLimitTx() {}
  async constructAddSpendingLimitTx() {}
  async constructRemoveSpendingLimitTx() {}
}

export default Api;
