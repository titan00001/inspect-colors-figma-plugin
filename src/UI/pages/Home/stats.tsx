import React, { useContext } from "react";
import { StylesContext } from "../../context/styles.context";
import PageStatsTable from "../../components/pageStatsTable";
import { PageFetchActions, PageInfo } from "../../../@types";

const Stats: React.FC = () => {
    const {pagesInfoData, fetchPageAction, selectedPageIds, setSelectedPages} = useContext(StylesContext);

    const handlePageAction = (pageId: PageInfo["id"], action: PageFetchActions) => {
        fetchPageAction(pageId, action)
    }
   return (
    <div className="h-full w-full flex flex-col justify-start items-start">
      <div className="flex justify-between items-center w-full h-[88px] bg-gray-800 mb-6 p-6">
        <div className="font-be-vietnam-pro text-xl min-w-[248px] whitespace-nowrap text-white font-bold">
          Statistics
        </div>
      </div>
      <hr />

      {pagesInfoData?.length > 0 && (
        <div className="w-full p-6 flex flex-col gap-3">
          <PageStatsTable pagesInfo={pagesInfoData} pageAction={handlePageAction} onCheck={setSelectedPages} selectedPageIds={selectedPageIds} />
        </div>
      )}
    </div>
  );
};

export default Stats;
