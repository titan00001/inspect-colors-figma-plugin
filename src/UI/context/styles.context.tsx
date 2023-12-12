"use client";
import {
  FC,
  PropsWithChildren,
  createContext,
  useMemo,
  useState,
} from "react";
import { PageClickActions, PageFetchActions, PageInfo, PageStyle, StylePayload, TSelection } from "../../@types";
import { combineAndAddUsedBy } from "../../utils/utils";

export interface StylesContextProps {
  pagesInfoData: PageInfo[];
  setPagesInfoData: (info: PageInfo[]) => void;
  setPageInfoData: (id: PageInfo["id"], updateInfo: Partial<PageInfo>) => void;
  pageStyles: PageStyle;
  setPageStyles: (pageStyle: StylePayload, id: string) => void;
  currentPageStyles: StylePayload;
  setCurrentPageStyles: (pageStyle: StylePayload, id: string) => void;
  postMessageToPlugin: (type: string, payload: Record<string, unknown>) => void;
  fetchPageAction: (pageId: PageInfo["id"], action: PageFetchActions) => void;
  selectedPagesStyles: StylePayload;
  selectedPageIds: PageInfo["id"][];
  setSelectedPages: (pageInfo: PageInfo, action: PageClickActions) => void;
  selectedMenu: TSelection;
  setSelection: (select: TSelection) => void;
 }

export const StylesContext = createContext<StylesContextProps>({
  pagesInfoData: [] as PageInfo[],
  setPagesInfoData: (page: PageInfo[]) => { },
  setPageInfoData: (id: PageInfo["id"], updateInfo: Partial<PageInfo>) => { },
  pageStyles: {} as PageStyle,
  setPageStyles: (pageStyle: StylePayload, id: string) => { },
  currentPageStyles: {} as StylePayload,
  setCurrentPageStyles: (pageStyle: StylePayload, id: string) => { },
  postMessageToPlugin: (type: string, payload: Record<string, unknown>) => { },
  fetchPageAction: (pageId: string, action: PageFetchActions) => { },
  selectedPagesStyles: {} as StylePayload,
  selectedPageIds: [] as PageInfo["id"][],
  setSelectedPages: (pageInfo: PageInfo, action: PageClickActions) => {},
  selectedMenu: "CURRENT_PAGE" as TSelection,
  setSelection: (select: TSelection) => {},
});

export const StylesContextProvider: FC<PropsWithChildren> = ({ children }) => {

  const [pagesInfoData, setPagesInfoData] = useState<PageInfo[]>([]);
  const [pageStyles, _setPageStyles] = useState<PageStyle>();
  const [currentPageStyles, _setCurrentPageStyles] = useState<StylePayload>();
  const [selectedPageIds, _setSelectedPageIds] = useState<PageInfo["id"][]>([]);
  const [selectedMenu, setSelectedMenu] = useState<TSelection>("CURRENT_PAGE");

  const setPageStyles = (pageStyle: StylePayload, id: string) => {
    setPageInfoData(id, { loading: false, isFetched: true, fetchedTimeInSeconds: pageStyle.fetchedTimeInSeconds });
    _setPageStyles({ ...pageStyles, [id]: pageStyle })
  }

  const setCurrentPageStyles = (pageStyle: StylePayload, id: string) => {
    setPageInfoData(id, { loading: false, isFetched: true, fetchedTimeInSeconds: pageStyle.fetchedTimeInSeconds });
    _setCurrentPageStyles(pageStyle);
    setPageStyles(pageStyle, id)
  }

  const postMessageToPlugin = (type: string, payload: Record<string, unknown>) => {
    parent.postMessage(
      { pluginMessage: { type, payload } },
      "*"
    );
  }

  const fetchPageAction = (pageId: PageInfo["id"], action: PageFetchActions) => {
    setPageInfoData(pageId, { loading: true, isFetched: false });
    postMessageToPlugin("get-page-data", { pageId, refreshCache: action === "REFETCH" ? true : false })
  }


  const setPageInfoData = (id: PageInfo["id"], updateInfo: Partial<PageInfo>): PageInfo[] | undefined => {
    const pageInfoIndex = pagesInfoData.findIndex((item) => item.id === id);
    if (pageInfoIndex > -1) {
      pagesInfoData[pageInfoIndex] = { ...pagesInfoData[pageInfoIndex], ...updateInfo };
      setPagesInfoData([...pagesInfoData]);
      return pagesInfoData
    }
    return;
  };

  const setSelectedPages = (pageInfo: PageInfo, action: PageClickActions) => {
    if(action === "ADD" && !selectedPageIds.includes(pageInfo.id) && pageInfo.isFetched) {
      const updatedSelectedPageIds = [...selectedPageIds, pageInfo.id]
      _setSelectedPageIds(updatedSelectedPageIds);
      return updatedSelectedPageIds;
    }
    else if(action === "REMOVE" && selectedPageIds.includes(pageInfo.id) && pageInfo.isFetched) {
      const updatedSelectedPageIds = selectedPageIds.filter(ids => ids !== pageInfo.id);
      _setSelectedPageIds(updatedSelectedPageIds);
      return updatedSelectedPageIds;
    }
  }

  const selectedPagesStyles = useMemo(() => {
     const selectedPageStyles = selectedPageIds.map(pageId => pageStyles[pageId]);
    //  concat
     const combinedStyle: StylePayload = {
      fillPaints: selectedPageStyles.reduce((prevFillPaints, currStyle) => [...prevFillPaints, ...currStyle.fillPaints], [] as StylePayload["fillPaints"]),
      strokePaints: selectedPageStyles.reduce((prevStrokePaints, currStyle) => [...prevStrokePaints, ...currStyle.strokePaints], [] as StylePayload["strokePaints"]),
      linearGradients: selectedPageStyles.reduce((prevLinearGradients, currStyle) => [...prevLinearGradients, ...currStyle.linearGradients], [] as StylePayload["linearGradients"]),
      fonts: selectedPageStyles.reduce((prevFonts, currStyle) => [...prevFonts, ...currStyle.fonts], [] as StylePayload["fonts"]),
     }
    //  remove duplicate entry in atttribues by combining the entry and adding usedBy
    const uniqueStyle: StylePayload = {
      fillPaints: combineAndAddUsedBy(combinedStyle.fillPaints) as StylePayload["fillPaints"],
      strokePaints: combineAndAddUsedBy(combinedStyle.strokePaints) as StylePayload["strokePaints"],
      linearGradients: combineAndAddUsedBy(combinedStyle.linearGradients) as StylePayload["linearGradients"],
      fonts: combineAndAddUsedBy(combinedStyle.fonts) as StylePayload["fonts"],
    }

    return uniqueStyle;
  }, [selectedPageIds, pagesInfoData])


  return (
    <StylesContext.Provider
      value={{
        pagesInfoData,
        setPagesInfoData,
        pageStyles,
        setPageStyles,
        currentPageStyles,
        setCurrentPageStyles,
        postMessageToPlugin,
        fetchPageAction,
        setPageInfoData,
        selectedPagesStyles,
        selectedPageIds,
        setSelectedPages,
        selectedMenu,
        setSelection: setSelectedMenu,
      }}
    >
      {children}
    </StylesContext.Provider>
  );
};

export default StylesContext;
