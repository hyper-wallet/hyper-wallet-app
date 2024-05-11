import { StatusBarStyle } from "expo-status-bar";
import { Theme as ReactNavigationTheme } from "@react-navigation/native";
import { palette } from "./palette";

type SemanticColor = {
  _: string;
  active: string;
  background: string;
  backgroundActive?: string;
};

type HierarchicalColor = {
  primary: string;
  secondary: string;
  tertiary?: string;
  quaternary?: string;
  opacity?: {
    "0": string;
    "4": string;
    "8": string;
    "16": string;
    "24": string;
    "32": string;
    "48": string;
    "64": string;
    "80": string;
  };
};

type ThemeColors = {
  brand: SemanticColor;
  success: SemanticColor;
  error: SemanticColor;
  warning: SemanticColor;
  foreground: HierarchicalColor;
  background: HierarchicalColor;
  divider: HierarchicalColor;
  border: HierarchicalColor;
};

type SharedColors = {
  gray: SemanticColor;
  barney: SemanticColor;
  blue: SemanticColor;
  cranberry: SemanticColor;
  green: SemanticColor;
  orange: SemanticColor;
  purple: SemanticColor;
  red: SemanticColor;
  yellow: SemanticColor;
};

export type Theme = ReactNavigationTheme &
  SharedColors &
  ThemeColors & {
    statusBarStyle: StatusBarStyle;
  };

type CreateThemeProps = {
  dark: boolean;
  colors: ThemeColors;
};

const createTheme = (props: CreateThemeProps): Theme => {
  const { dark, colors } = props;
  return {
    dark: dark,
    statusBarStyle: dark ? "light" : "dark",
    colors: {
      // these colors are used to set colors for navigation elements
      primary: colors.brand._,
      background: colors.background.primary,
      card: colors.background.secondary,
      text: colors.foreground.primary,
      border: colors.border.secondary,
      notification: colors.background.secondary,
    },
    ...sharedColors,
    ...colors,
  };
};

export const lightTheme = createTheme({
  dark: false,
  colors: {
    brand: {
      _: palette.blue[50],
      active: palette.blue[60],
      background: palette.blue.pale,
    },
    success: {
      _: palette.green[50],
      active: palette.green[60],
      background: palette.green.pale,
    },
    error: {
      _: palette.red[50],
      active: palette.red[60],
      background: palette.red.pale,
    },
    warning: {
      _: palette.yellow[60],
      active: palette.yellow[70],
      background: palette.yellow.pale,
    },
    foreground: {
      primary: palette.black.full,
      secondary: palette.gray[70],
      tertiary: palette.gray[50],
      quaternary: palette.gray[40],
      opacity: palette.black.opacity,
    },
    background: {
      primary: palette.white.full,
      secondary: palette.gray[10],
      tertiary: palette.gray[20],
      quaternary: palette.gray[30],
      opacity: palette.white.opacity,
    },
    divider: {
      primary: palette.gray[90],
      secondary: palette.gray[50],
    },
    border: {
      primary: palette.gray[40],
      secondary: palette.gray[20],
    },
  },
});

export const darkTheme = createTheme({
  dark: true,
  colors: {
    brand: {
      _: palette.cranberry[50],
      active: palette.cranberry[60],
      background: palette.cranberry.pale,
    },
    success: {
      _: palette.green[50],
      active: palette.green[60],
      background: palette.green.pale,
    },
    error: {
      _: palette.red[50],
      active: palette.red[60],
      background: palette.red.pale,
    },
    warning: {
      _: palette.yellow[60],
      active: palette.yellow[70],
      background: palette.yellow.pale,
    },
    foreground: {
      primary: palette.white.full,
      secondary: palette.gray[40],
      tertiary: palette.gray[60],
      quaternary: palette.gray[80],
      opacity: palette.white.opacity,
    },
    background: {
      primary: palette.black.full,
      secondary: palette.gray[100],
      tertiary: palette.gray[90],
      quaternary: palette.gray[80],
      opacity: palette.black.opacity,
    },
    divider: {
      primary: palette.gray[10],
      secondary: palette.gray[60],
    },
    border: {
      primary: palette.gray[60],
      secondary: palette.gray[90],
    },
  },
});

const sharedColors: SharedColors = {
  gray: {
    _: palette.gray[60],
    active: palette.gray[70],
    background: palette.gray[60],
    backgroundActive: palette.gray[70],
  },
  barney: {
    _: palette.barney[50],
    active: palette.barney[60],
    background: palette.barney[50],
    backgroundActive: palette.barney[60],
  },
  blue: {
    _: palette.blue[50],
    active: palette.blue[60],
    background: palette.blue[50],
    backgroundActive: palette.blue[60],
  },
  cranberry: {
    _: palette.cranberry[50],
    active: palette.cranberry[60],
    background: palette.cranberry[50],
    backgroundActive: palette.cranberry[60],
  },
  green: {
    _: palette.green[50],
    active: palette.green[60],
    background: palette.green[50],
    backgroundActive: palette.green[60],
  },
  orange: {
    _: palette.orange[50],
    active: palette.orange[60],
    background: palette.orange[50],
    backgroundActive: palette.orange[60],
  },
  purple: {
    _: palette.purple[50],
    active: palette.purple[60],
    background: palette.purple[50],
    backgroundActive: palette.purple[60],
  },
  red: {
    _: palette.red[50],
    active: palette.red[60],
    background: palette.red[50],
    backgroundActive: palette.red[60],
  },
  yellow: {
    _: palette.yellow[50],
    active: palette.yellow[60],
    background: palette.yellow[50],
    backgroundActive: palette.yellow[60],
  },
};
