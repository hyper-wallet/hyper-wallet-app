import { forwardRef, useState } from "react";
import { Modalize } from "react-native-modalize";
import {
  ModalSheet,
  Title,
  Subtitle,
  Button,
  Space,
  SectionTitle,
} from "@/components";
import styled from "styled-components/native";
import { Alert } from "react-native";
import { useStores } from "@/hooks";

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const Card = styled.View`
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 16px;
  padding: 16px;
`;

type Method =
  | "enableOtp"
  | "disableOtp"
  | "setupOtp"
  | "resetOtp"
  | "enableWhitelist"
  | "disableWhitelist";

const subtitleByMethod: Record<Method, string> = {
  enableOtp: "Enable OTP",
  disableOtp: "Disable OTP",
  setupOtp: "Setup OTP",
  resetOtp: "Reset OTP",
  enableWhitelist: "Enable Whitelist",
  disableWhitelist: "Disable Whitelist",
};

type ConfirmTxModalProps = {
  method: Method;
  onRejected?: () => void;
  onConfirmed?: (data: any) => void;
};

export const ConfirmTxModal = forwardRef<Modalize, ConfirmTxModalProps>(
  (props, ref) => {
    const [loading, setLoadinng] = useState(false);
    const { method, onRejected, onConfirmed } = props;
    const { hyperWalletStore } = useStores();

    const subtitle = subtitleByMethod[method];

    function close() {
      //@ts-ignore
      ref.current?.close();
      onRejected && onRejected();
    }

    async function confirmTx() {
      let promise: Promise<any>;
      if (!hyperWalletStore.wallet) {
        // TODO: handle error
        return;
      }
      switch (method) {
        case "enableOtp":
          promise = hyperWalletStore.wallet.enableOtp();
          break;
        case "disableOtp":
          promise = hyperWalletStore.wallet.disableOtp();
          break;
        case "setupOtp":
          promise = hyperWalletStore.wallet.setupOtp();
          break;
        case "resetOtp":
          promise = hyperWalletStore.wallet.setupOtp();
          break;
        case "enableWhitelist":
          promise = hyperWalletStore.wallet.enableWhitelist();
          break;
        case "disableWhitelist":
          promise = hyperWalletStore.wallet.disableWhitelist();
          break;
      }
      setLoadinng(true);
      promise
        .then((data) => {
          onConfirmed && onConfirmed(data);
          //@ts-ignore
          ref.current?.close();
        })
        .catch((e) => {
          Alert.alert(e);
        })
        .finally(() => {
          setLoadinng(false);
        });
    }

    return (
      <ModalSheet ref={ref}>
        <SectionTitle>Confirm transaction</SectionTitle>
        <Space height={16} />
        <Card>
          <Title>Method</Title>
          <Subtitle>{subtitle}</Subtitle>
          <Space height={16} />
          <Title>Hyper Wallet</Title>
          <Subtitle numberOfLines={1} ellipsizeMode="middle">
            {hyperWalletStore.wallet?.address}
          </Subtitle>
        </Card>
        <Space height={16} />
        <Card>
          <Title>Estimated gas fee</Title>
          <Subtitle>0.000005 SOL</Subtitle>
        </Card>
        <Space />
        <Row>
          <Button
            style={{ flex: 1 }}
            label="Cancel"
            variant="secondary"
            onPress={close}
          />
          <Space width={16} />
          <Button
            disabled={loading}
            style={{ flex: 1 }}
            label={loading ? "Loading" : "Confirm"}
            onPress={confirmTx}
          />
        </Row>
      </ModalSheet>
    );
  }
);
