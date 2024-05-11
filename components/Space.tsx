import { FC } from "react";
import { ViewProps, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type SpaceProps = ViewProps & {
  width?: number;
  height?: number;
  insetTop?: boolean;
  insetBottom?: boolean;
};

export const Space: FC<SpaceProps> = (props) => {
  const insets = useSafeAreaInsets();
  const { width, height, insetTop = false, insetBottom = false } = props;
  const flex = { flex: 1 };
  const sized = {
    width,
    height: insetTop ? insets.top : insetBottom ? insets.bottom : height,
  };
  const style = width || height || insetTop || insetBottom ? sized : flex;
  return <View style={style} />;
};
