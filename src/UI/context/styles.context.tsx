"use client";
import {
  FC,
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from "react";
import { PageFetchActions, PageInfo, PageStyle, StylePayload } from "../../@types";

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
  fetchPageAction: (pageId: string, action: PageFetchActions) => { }
});

export const StylesContextProvider: FC<PropsWithChildren> = ({ children }) => {

  const [pagesInfoData, setPagesInfoData] = useState<PageInfo[]>([]);
  const [pageStyles, _setPageStyles] = useState<PageStyle>();
  const [currentPageStyles, _setCurrentPageStyles] = useState<StylePayload>();

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
    console.log("Sting page info", id, updateInfo, pageInfoIndex, pagesInfoData)
    if (pageInfoIndex > -1) {
      pagesInfoData[pageInfoIndex] = { ...pagesInfoData[pageInfoIndex], ...updateInfo };
      setPagesInfoData([...pagesInfoData]);
      console.log("Set page info", pagesInfoData[pageInfoIndex])
      return pagesInfoData
    }
    return;
  };



  useEffect(() => {
    console.log({ pagesInfoData })
  }, [pagesInfoData])

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
      }}
    >
      {children}
    </StylesContext.Provider>
  );
};

export default StylesContext;
