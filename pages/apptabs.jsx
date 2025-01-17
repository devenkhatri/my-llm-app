import MultiLLMChat from "./MultiLLMChat";
import DBChat from "./DBChat";
import { Tabs, Tab } from "@nextui-org/react";

export default function AppTabs() {
    return (
        <div className="flex w-full flex-col">
            <Tabs aria-label="Options">
                <Tab key="MultiLLMChat" title="MultiLLMChat">
                    <MultiLLMChat />
                </Tab>
                <Tab key="DBChat" title="DBChat">
                    <DBChat />
                </Tab>                
            </Tabs>
        </div>
    );
}