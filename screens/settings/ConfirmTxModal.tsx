import { forwardRef } from "react";
import { Modalize } from "react-native-modalize";
import { ModalSheet, Title, Subtitle, Button, Space } from "@/components";
import styled from "styled-components/native";
import { middleEllipsis } from "@/utils";
import { useAppStore } from "@/stores/appStore";
import { HyperWallet } from "@/lib/HyperWallet";

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
  | "enableWhitelist"
  | "disableWhitelist";

const subtitleByMethod: Record<Method, string> = {
  enableOtp: "Enable OTP",
  disableOtp: "Disable OTP",
  enableWhitelist: "Enable Whitelist",
  disableWhitelist: "Disable Whitelist",
};

type ConfirmTxModalProps = {
  method: Method;
  onRejected: () => void;
  onConfirmed: () => void;
};

export const ConfirmTxModal = forwardRef<Modalize, ConfirmTxModalProps>(
  (props, ref) => {
    const { method, onRejected, onConfirmed } = props;
    const currentWallet = useAppStore().currentWallet as HyperWallet;

    const subtitle = subtitleByMethod[method];

    function close() {
      //@ts-ignore
      ref.current?.close();
      onRejected();
    }

    async function confirmTx() {
      let promise: Promise<any>;
      switch (method) {
        case "enableOtp":
          promise = currentWallet.enableOtp();
          break;
        case "disableOtp":
          promise = currentWallet.disableOtp();
          break;
        case "enableWhitelist":
          promise = currentWallet.enableWhitelist();
          break;
        case "disableWhitelist":
          promise = currentWallet.disableWhitelist();
          break;
      }
      promise
        .then((signature) => {
          console.log("🚀 ~ .then ~ signature:", signature);
          onConfirmed();
        })
        .catch()
        .finally(close);
    }

    return (
      <ModalSheet ref={ref}>
        <Title>Confirm transaction</Title>
        <Space height={16} />
        <Card>
          <Title>Method</Title>
          <Subtitle>{subtitle}</Subtitle>
          <Space height={16} />
          <Title>Wallet</Title>
          <Subtitle>
            Hyper Wallet: {middleEllipsis(currentWallet.address)}
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
          <Button style={{ flex: 1 }} label="Confirm" onPress={confirmTx} />
        </Row>
      </ModalSheet>
    );
  }
);
