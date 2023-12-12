import { Color, ColorContent, TColorExtractor, RGBAColor } from "./@types";
import { countBy, measurePerformanceInMs, sortBy, uniqBy } from "./utils/utils";

figma.showUI(__html__);

figma.skipInvisibleInstanceChildren = true;
let pageData = {};

figma.ui.onmessage = (msg) => {
  console.log("message in plugin", msg);
  let fetchedTimeInMilliseconds = -1000;

  if (msg.type === "get-page-data") {
    const { pageId, refreshCache = false } = msg.payload;

    fetchedTimeInMilliseconds = measurePerformanceInMs(() => {
      // Check if page data is already available for the requested page
      if (!pageData[pageId] && !refreshCache) {
        const children = figma.root.children.find(
          (child) => child.id === pageId
        );

        const descendantNodes = children?.findAll();

        const fillPaints = getFillPaintNodes(
          descendantNodes,
          getSolidPaintColor
        );
        const strokePaints = getStrokePaintNodes(
          descendantNodes,
          getSolidPaintColor
        );
        const linearGradients = getFillPaintNodes(
          descendantNodes,
          getLinearPaintColor
        );
        const fonts = getFontInfoForTextNodes(descendantNodes);

        // Save the processed data for future reference
        pageData[pageId] = {
          fillPaints,
          strokePaints,
          linearGradients,
          fonts,
        };
      }
    });

    // Send the page data to the UI
    figma.ui.postMessage({
      type: "page-styles",
      pageId,
      data: {
        ...pageData[pageId],
        fetchedTimeInSeconds: fetchedTimeInMilliseconds / 1000,
      },
    });
  }
};

figma.on("currentpagechange", () => {
  getCurrentPageStyles();
});

// When plugin loads, share the current page information
figma.on("run", () => {
  const childPages = figma.root.children.map((node) => ({
    id: node.id,
    name: node.name,
  }));

  figma.ui.postMessage({
    type: "all-pages-data",
    data: childPages,
  });

  getCurrentPageStyles();
});

const getCurrentPageStyles = () => {
  const currentPage = figma.currentPage;
  const currentPageNodes = currentPage.findAll();

  let fetchedTimeInMilliseconds = -1000;

  if (!currentPage.id) return;
  
  fetchedTimeInMilliseconds = measurePerformanceInMs(() => {
    if (!pageData[currentPage.id]) {
      // Extract and process paints and fonts for the current page

      const fillPaints = getFillPaintNodes(
        currentPageNodes,
        getSolidPaintColor
      );
      const strokePaints = getStrokePaintNodes(
        currentPageNodes,
        getSolidPaintColor
      );
      const linearGradients = getFillPaintNodes(
        currentPageNodes,
        getLinearPaintColor
      );
      const fonts = getFontInfoForTextNodes(currentPageNodes);

      // Save the processed data for the current page
      pageData[currentPage.id] = {
        fillPaints,
        strokePaints,
        linearGradients,
        fonts,
      };
    }
  });

  // Send the page data to the UI
  figma.ui.postMessage({
    type: "current-page-style",
    pageId: currentPage.id,
    data: {
      ...pageData[currentPage.id],
      fetchedTimeInSeconds: fetchedTimeInMilliseconds / 1000,
    },
  });
};

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
  // console.log({ filteredNode, uniqueNodes, slicedNodes, solidPaints });

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
  // console.log("stroke: ", {
  //   filteredNode,
  //   uniqueNodes,
  //   slicedNodes,
  //   solidPaints,
  // });

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
      return result;
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

function getFontInfoForTextNodes(nodes: (SceneNode | PageNode)[]) {
  const textNodes = nodes.filter((node) => node.type === "TEXT") as TextNode[];
  const uniqueNodes = uniqBy(textNodes, (item) => item.textStyleId);
  const countNodesById = countBy(textNodes, (item) =>
    item.textStyleId.toString()
  );

  const textStyles = uniqueNodes
    .map((tnode) => ({
      style: figma.getStyleById(tnode.textStyleId.toString()),
      node: tnode,
    }))
    .filter((style) => style.style?.id) as {
    style: TextStyle;
    node: TextNode;
  }[];

  const parsedTextStyles = textStyles.map(({ style, node }) => {
    return {
      id: style.id.toString(),
      name: style.name,
      font: {
        fontFamily: style.fontName,
        fontSize: style.fontSize,
        fontWeight: node.fontWeight.toString(),
        lineHeight: style.lineHeight,
        fontStyle: style.fontName.style?.toLowerCase() ?? "normal",
      },
      usedBy: countNodesById[style.id.toString()],
    };
  });

  console.log({ textNodes, textStyles, parsedTextStyles });

  return sortBy(parsedTextStyles, (item) => item.name);
}
