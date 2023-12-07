import { Color, ColorContent, TColorExtractor, RGBAColor } from "./@types";
import { countBy, sortBy, uniqBy } from "./utils/utils";

figma.showUI(__html__);


figma.on("selectionchange", () => {
  figma.ui.postMessage({
    type: "selection-change",
    isComponentSelected: figma.currentPage.selection.length > 0,
    selectedComponents: figma.currentPage.selection.map((x) => x.name),
  });
  console.log({ selection: figma.currentPage.selection });

  const currentPageNodes = figma.currentPage.findAll();


  const solidColorExtractor = getSolidPaintColor;
  const fillPaints = getFillPaintNodes(currentPageNodes, solidColorExtractor);
  const strokePaints = getStrokePaintNodes(currentPageNodes, solidColorExtractor);

  const linearGradients = getFillPaintNodes(currentPageNodes, getLinearPaintColor)

  figma.ui.postMessage({
    type: "solid-paints",
    fillPaints,
    strokePaints,
    linearGradients,
  });
});

const getFillPaintNodes = (
  nodes: SceneNode[],
  colorExtractor: TColorExtractor
) => {
  const filteredNode: (SceneNode & {
    fillStyleId: MinimalFillsMixin["fillStyleId"];
  })[] = nodes.filter((node) => "fillStyleId" in node) as (SceneNode & {
    fillStyleId: MinimalFillsMixin["fillStyleId"];
  })[];
  const uniqueNodes = uniqBy(filteredNode, (item) => item?.fillStyleId);
  const countNodesByFillStyleId = countBy(filteredNode, (item) =>
    item.fillStyleId.toString()
  );
  const slicedNodes = uniqueNodes
    .map((node) => {
      const styleID = node.fillStyleId.toString();
      const style: BaseStyle | null = figma.getStyleById(styleID);
      const color = colorExtractor(style);
      return {
        id: node.id,
        styleId: styleID,
        style,
        color,
        name: style?.name,
        usedBy: countNodesByFillStyleId[styleID],
      };
    })
    .filter((node) => node?.color);

  const solidPaints = slicedNodes.map((n) => ({
    name: n?.name,
    color: n?.color,
    usedBy: n.usedBy,
  })) as ColorContent[];
  console.log({ filteredNode, uniqueNodes, slicedNodes, solidPaints });

  return sortBy(solidPaints, (item) => item.name);
};

const getStrokePaintNodes = (
  nodes: SceneNode[],
  colorExtractor: TColorExtractor
) => {
  const filteredNode: (SceneNode & {
    strokeStyleId: MinimalStrokesMixin["strokeStyleId"];
  })[] = nodes.filter((node) => "strokeStyleId" in node) as (SceneNode & {
    strokeStyleId: MinimalStrokesMixin["strokeStyleId"];
  })[];
  const uniqueNodes = uniqBy(filteredNode, (item) => item?.strokeStyleId);
  const countNodesById = countBy(filteredNode, (item) =>
    item.strokeStyleId.toString()
  );
  const slicedNodes = uniqueNodes
    .map((node) => {
      const styleID = node.strokeStyleId.toString();
      const style: BaseStyle | null = figma.getStyleById(styleID);
      const color = colorExtractor(style);
      return {
        id: node.id,
        styleId: styleID,
        style,
        color,
        name: style?.name,
        usedBy: countNodesById[styleID],
      };
    })
    .filter((node) => node?.color);

  const solidPaints = slicedNodes.map((n) => ({
    name: n?.name,
    color: n?.color,
    usedBy: n.usedBy,
  })) as ColorContent[];
  console.log("stroke: ", {
    filteredNode,
    uniqueNodes,
    slicedNodes,
    solidPaints,
  });

  return sortBy(solidPaints, (item) => item.name);
};

function rgbaToHex(color: RGBAColor): string {
  const { r, g, b, a = 1 } = color;

  const toHex = (value: number): string => {
    const hex = Math.round(value * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}${Math.round(a * 255).toString(
    16
  )}`;

  return hex;
}

const getSolidPaintColor = (style: BaseStyle | null): Color | undefined => {
  if (style?.type === "PAINT" && "paints" in style) {
    let paintStyle = style as PaintStyle;
    const solidPaint = paintStyle.paints.find(
      (p) => p.type === "SOLID" && p.color
    ) as SolidPaint | undefined;

    if (solidPaint) {
      const result: Color = {
        type: "SOLID",
        color: rgbaToHex(solidPaint.color),
      };
      return result;
    }
  }

  return undefined;
};

const getLinearPaintColor = (style: BaseStyle | null): Color | undefined => {
  if (style?.type === "PAINT" && "paints" in style) {
    let paintStyle = style as PaintStyle;
    const solidPaint = paintStyle.paints.find((p) =>
      p.type.startsWith("GRADIENT")
    ) as GradientPaint | undefined;

    if (solidPaint?.type) {
      const cssGradient = figmaGradientToCssGradient(solidPaint);
      const result: Color = {
        type: "GRADIENT",
        color: cssGradient,
      };
      return result
    }
  }

  return undefined;
};

function figmaGradientToCssGradient(gradient: GradientPaint): string {
  // Extract information from the gradient object
  const type = gradient.type;
  const stops = gradient.gradientStops;
  const transform = gradient.gradientTransform;

  // Convert the gradient type
  let cssType = "";
  switch (type) {
    case "GRADIENT_LINEAR":
      cssType = "linear-gradient(";
      break;
    case "GRADIENT_RADIAL":
      cssType = "radial-gradient(";
      break;
    default:
      throw new Error(`Unsupported gradient type: ${type}`);
  }

  // Extract gradient direction
  const direction = getGradientDirection(transform);
  cssType += direction;

  // Convert gradient stops
  const cssStops = stops.map((stop) => {
    const color = rgbaToHex(stop.color);
    const position = stop.position * 100;
    return `${color} ${position}%`;
  });

  // Combine all parts and return the CSS gradient string
  return `${cssType}, ${cssStops.join(", ")})`;
}

function getGradientDirection(transform: number[][]): string {
  // Extract relevant values from the transform matrix
  const x1 = transform[0][0];
  const y1 = transform[0][1];
  const x2 = transform[1][0];
  const y2 = transform[1][1];

  // Calculate the angle based on the x and y components
  const angle = Math.atan2(y2 - y1, x2 - x1);

  // Convert angle to degrees and format for CSS
  return `${Math.round((angle * 180) / Math.PI)}deg`;
}
