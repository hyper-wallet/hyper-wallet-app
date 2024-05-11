import { FC } from "react";
import {
  Keyboard,
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
} from "react-native";
import { styled } from "styled-components/native";

const Container = styled.View`
  flex: 1;
`;

type ScreenProps = TouchableWithoutFeedbackProps & {};

export const Screen: FC<ScreenProps> = (props) => {
  const { children, ...rest } = props;
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} {...rest}>
      <Container>{children}</Container>
    </TouchableWithoutFeedback>
  );
};
