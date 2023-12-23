import { StylePayload } from "./@types";
import { getFillPaintNodes, getSolidPaintColor, getStrokePaintNodes, getLinearPaintColor, getOrphanSolidFillPaintNodes, getOrphanGradientFillPaintNodes, getOrphanSolidStrokePaintNodes, getOrphanGradientStrokePaintNodes } from "./utils/color-helpers";
import { getFontInfoForTextNodes, getOrphanFontInfoForTextNodes } from "./utils/typography-helpers";
import { measurePerformanceInMs, } from "./utils/utils";

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

        const pageStyle = getPageStyles(descendantNodes);

        // Save the processed data for future reference
        pageData[pageId] = pageStyle;
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

      const pageStyles = getPageStyles(currentPageNodes);

      // Save the processed data for the current page
      pageData[currentPage.id] = pageStyles;
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

export const getPageStyles = (descendantNodes: SceneNode[]): StylePayload => {
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
  const orphanSolidFillPaints = getOrphanSolidFillPaintNodes(descendantNodes);
  const orphanGradientFillPaints = getOrphanGradientFillPaintNodes(descendantNodes);
  const orphanSolidStrokePaints = getOrphanSolidStrokePaintNodes(descendantNodes);
  const orphanGradientStrokePaints = getOrphanGradientStrokePaintNodes(descendantNodes);
  const fonts = getFontInfoForTextNodes(descendantNodes);
  const orphanFonts = getOrphanFontInfoForTextNodes(descendantNodes);

  return {
    fillPaints,
    strokePaints,
    linearGradients,
    fonts,
    orphan: {
      fillPaints: orphanSolidFillPaints,
      strokePaints: orphanSolidStrokePaints,
      linearGradients: [...orphanGradientFillPaints, ...orphanGradientStrokePaints],
      fonts: orphanFonts,
    }
  }
}
 
