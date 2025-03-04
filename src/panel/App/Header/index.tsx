import React, { useState } from "react";
import { shallow } from "zustand/shallow";
import { Tabs, Flex, Input, Button } from "@mantine/core";
import { MdAdd } from "react-icons/md";
import { TbSearch } from "react-icons/tb";
import {
  useChromeStore,
  useGlobalStore,
  ViewEnum,
  useGlobalStoreState,
  useMockStoreSelector,
} from "../store";
import { ThemeButton } from "./ThemeButton";
import { RefreshButton } from "./RefreshButton";
import { ClearButton } from "./ClearButton";
import { RecordButton } from "./RecordButton";
import { SwitchButton } from "./SwitchButton";
import { SupportUs } from "./SupportUs";
import { ExportButton } from "./ExportButton";
import { ImportButton } from "./ImportButton";
import { useSelectionStore } from "../store/useMocksSelectionStore";

const viewSelector = (state: useGlobalStoreState) => ({
  view: state.view,
  setView: state.setView,
  search: state.search,
  setSearch: state.setSearch,
});

export const Header = () => {
  const { view, setView, search, setSearch } = useGlobalStore(
    viewSelector,
    shallow
  );
  const { setSelectedMock, setSelectedGroup } = useChromeStore(
    useMockStoreSelector
  );
  const { resetSelection } = useSelectionStore();

  const [showSupportUs, setShowSupportUs] = useState(false);

  const onTabChange = (value: ViewEnum) => {
    setView(value);
    resetSelection();
  };

  return (
    <Tabs defaultValue={ViewEnum.MOCKS} value={view} onTabChange={onTabChange}>
      <Tabs.List style={{ width: "100%" }}>
        <Flex justify="space-between" align="center" style={{ width: "100%" }}>
          <Flex align="center">
            <Tabs.Tab value={ViewEnum.MOCKS}>Mocks</Tabs.Tab>
            <Tabs.Tab value={ViewEnum.GROUPS}>Groups</Tabs.Tab>
            <Tabs.Tab value={ViewEnum.LOGS}>Logs</Tabs.Tab>
            <Flex align="center" gap={8}>
              {view === ViewEnum.GROUPS ? (
                <Button
                  onClick={() => setSelectedGroup({})}
                  leftIcon={<MdAdd />}
                  size="xs"
                  variant="subtle"
                >
                  Add Group
                </Button>
              ) : (
                <Button
                  onClick={() => setSelectedMock({})}
                  leftIcon={<MdAdd />}
                  size="xs"
                  variant="subtle"
                >
                  Add Mock
                </Button>
              )}
              <Input
                icon={<TbSearch />}
                placeholder="Search..."
                size="xs"
                defaultValue={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <RecordButton />
              {view === "LOGS" ? <ClearButton /> : null}
            </Flex>
          </Flex>
          <Flex gap="4px" style={{ paddingRight: 4 }}>
            <Button
              onClick={() => setShowSupportUs(true)}
              size="xs"
              variant="subtle"
            >
              Support Mokku
            </Button>
            {view === ViewEnum.MOCKS || view === ViewEnum.GROUPS ? (
              <>
                <ExportButton />
                <ImportButton />
              </>
            ) : null}
            <ThemeButton />
            <RefreshButton />
            <SwitchButton />
          </Flex>
          {showSupportUs && (
            <SupportUs onClose={() => setShowSupportUs(false)} />
          )}
        </Flex>
      </Tabs.List>
    </Tabs>
  );
};
