import { Image as ExpoImage, ImageProps as ExpoImageProps } from "expo-image";
import { FC } from "react";

type ImageProps = ExpoImageProps & {};

export const Image: FC<ImageProps> = (props) => {
  return (
    <ExpoImage {...props} transition={{ duration: 250 }} priority="high" />
  );
};
