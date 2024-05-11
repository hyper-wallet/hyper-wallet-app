import { useTheme } from "@/hooks";
import { FC } from "react";
import RemixIcon from "react-native-remix-icon";

type IconProps = {
  name: any;
  size?: number;
  color?: string;
};

export const Icon: FC<IconProps> = (props) => {
  const theme = useTheme();
  const { name, size = 16, color = theme.foreground.primary } = props;

  return <RemixIcon name={name} size={size} color={color} />;
};
