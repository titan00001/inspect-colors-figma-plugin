import { Tab } from "@headlessui/react";
import TypographyTab from "./typography";
import ColorTab from "./colors";
import { useContext } from "react";
import StylesContextContext from "../../context/styles.context";
import Stats from "./stats";

export function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const TABS = [
  { name: "Pages" },
  { name: "Typography" },
  { name: "Colors" },
];

const Home: React.FC = () => {

  const {setCurrentPageStyles, setPageStyles, setPagesInfoData} = useContext(StylesContextContext)

  onmessage = async (event: MessageEvent) => {
    const pluginMessage = event.data.pluginMessage;
    console.log({ pluginMessage });
  
    switch (pluginMessage.type) {
      case "page-styles":
        setPageStyles(pluginMessage.data, pluginMessage.pageId);
        break;
      case "current-page-style":
        setCurrentPageStyles(pluginMessage.data, pluginMessage.pageId)
        break;
      case "all-pages-data":
        setPagesInfoData(pluginMessage.data);
        break;
      default:
        console.warn("Unrecognized message type:", pluginMessage.type);
    }
  };

  return (
    <div className="w-full p-2 sm:px-0">
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-gray-200 p-1">
          {TABS.map(({ name }) => (
            <Tab
              key={name}
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                  "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-white text-blue-700 shadow"
                    : "text-blue-400 hover:bg-white/[0.12] hover:text-blue-400/80"
                )
              }
            >
              {name}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          <Tab.Panel><Stats /></Tab.Panel>
          <Tab.Panel>
            <TypographyTab />
          </Tab.Panel>
          <Tab.Panel>
            <ColorTab />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default Home;
