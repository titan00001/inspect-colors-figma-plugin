export interface RGBAColor {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export type ColorContent = {
  name: string;
  color: Color;
  usedBy: number;
};

export type FontContent = {
    id: string;
    name: string;
    font: {
        fontFamily: FontName;
        fontSize: number;
        fontWeight: string;
        lineHeight: LineHeight;
        fontStyle: string;
    };
    usedBy: number;
}

export interface Paints {
  fillPaints: ColorContent[];
  strokePaints: ColorContent[];
  linearGradients: ColorContent[];
}

export interface FontPayload {
    fonts: FontContent[];
}

export type SolidColor = string;
export type GradientColor = string;

export type Color = {
  type: "SOLID" | "GRADIENT";
  color: SolidColor | GradientColor;
};

export type TColorExtractor = (style: BaseStyle | null) => Color | null;

export type StylePayload = {
  fillPaints: ColorContent[];
  strokePaints: ColorContent[];
  linearGradients: ColorContent[];
  fonts: FontContent[];
  fetchedTimeInSeconds?: number;
}

// UI specific:

export type PageInfo = {
    id: string;
    name: string;
    loading?: boolean;
    isFetched?: boolean;
    fetchedTimeInSeconds?: number;
}

export type PageStyle = Record<string, StylePayload>
export type PageFetchActions = "FETCH" | "REFETCH";
export type PageClickActions = "ADD" | "REMOVE";

export type TSelection = "CURRENT_PAGE" | "COMBINED_PAGE"

