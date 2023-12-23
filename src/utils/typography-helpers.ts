import { OrphanFontPayload } from "../@types";
import { countBy, sortBy, uniqBy } from "./utils";

export const getFontInfoForTextNodes = (nodes: (SceneNode | PageNode)[]) => {
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
  
    return sortBy(parsedTextStyles, (item) => item.name);
  };

  export const getOrphanFontInfoForTextNodes = (nodes: (SceneNode | PageNode)[]) => {
    const textNodes = nodes.filter((node) => node.type === "TEXT" && node.textStyleId.toString()?.length <= 2) as TextNode[];

    const fontFamiliesMap = new Map<string, number>();

    // font family
    textNodes.forEach(node => {
      const fontFamily = (node.fontName as FontName).family;
      fontFamiliesMap.set(fontFamily, (fontFamiliesMap.get(fontFamily) ?? 0) + 1);
    })

    let fontFamilies: OrphanFontPayload[] = [];
    fontFamiliesMap.forEach((val, key) => fontFamilies.push({name: key, value: key, usedBy: val}))

    // console.log("text node", {textNodes, fontFamiliesMap, fontFamilies})
  
    return {
      fontFamily: fontFamilies.filter(font => !!font.name),
    };
  };