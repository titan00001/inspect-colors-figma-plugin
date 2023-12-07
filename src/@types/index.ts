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

export interface Paints {
  fillPaints: ColorContent[];
  strokePaints: ColorContent[];
  linearGradients: ColorContent[]
}

export type SolidColor = string;
export type GradientColor = string;

export type Color = {
  type: "SOLID" | "GRADIENT";
  color: SolidColor | GradientColor;
};

export type TColorExtractor = (style: BaseStyle | null) => Color | null;
