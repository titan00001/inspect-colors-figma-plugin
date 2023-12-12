import React from "react";
import { PageClickActions, PageFetchActions, PageInfo } from "../../@types";
import Spinner from "./Spinner";
import Checkbox from "./checkbox";

export interface IPageStatsTableProps {
    pagesInfo: PageInfo[];
    pageAction: (pageId: PageInfo["id"], action: PageFetchActions) => void;
    onCheck?: (pageInfo: PageInfo, action: PageClickActions) => void;
    selectedPageIds: PageInfo["id"][];
}

const PageStatsTable: React.FC<IPageStatsTableProps> = ({ pagesInfo, pageAction, onCheck, selectedPageIds }) => {
    return (
        <div className="flex flex-col gap-y-1 gap-x-2 border border-gray-200 rounded-lg">
            <div className="flex gap-x-2 items-center bg-gray-100 px-2 py-4 rounded-t-lg">

                <div className="w-[5%] text-base font-semibold text-gray-600"></div>
                <div className="w-[40%] text-base font-semibold text-gray-600">Name</div>
                <div className="w-[20%] text-base font-semibold text-gray-600">Status</div>
                <div className="w-[20%] text-base font-semibold text-gray-600">
                    Fetched in
                </div>
                <div className="w-[20%] text-base font-semibold text-gray-600">
                    Action
                </div>
            </div>
            {pagesInfo.map((pageItem) => (
                <div key={pageItem.id} className="flex gap-x-2 items-center px-2 py-1 ">
                     <div className="w-[5%] text-base font-semibold text-gray-600"><Checkbox disabled={!pageItem.isFetched} isChecked={selectedPageIds.includes(pageItem.id)} onClick={() => onCheck?.(pageItem, selectedPageIds.includes(pageItem.id) ? "REMOVE" : "ADD")} /></div>
                    <div className="w-[40%] text-sm font-medium text-gray-500">
                        {pageItem.name}
                    </div>
                    <div className="w-[20%] text-sm font-medium text-gray-500">
                        {pageItem.loading ? "Loading" : (pageItem.isFetched ? "Fetched" : "Not fetched")}
                    </div>
                    <div className="w-[20%] text-sm font-medium text-gray-500">
                        {pageItem.isFetched ? `${pageItem.fetchedTimeInSeconds?.toFixed(2) ?? "Unknown"} s` : ""}
                    </div>
                    <div className="w-[20%] text-sm font-medium text-gray-500">
                        <div
                            role="button"
                            onClick={() => pageAction(pageItem.id, pageItem.isFetched ? "REFETCH" : "FETCH")}
                            className="py-2 px-4 bg-blue-200 text-blue-600 font-bold text-sm rounded-lg hover:bg-blue-200/80 hover:text-blue-600/80 text-center"
                        >
                            {pageItem.loading ? <Spinner /> : pageItem.isFetched ? `Refetch` : "Fetch"}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PageStatsTable;
