import React, { useState } from "react";
import { shallow } from "zustand/shallow";
import { Tabs, Flex, createStyles, Input, Button, Select } from "@mantine/core";
import { MdAdd } from "react-icons/md";
import { TbSearch } from "react-icons/tb";
import {
  useChromeStore,
  useGlobalStore,
  ViewEnum,
  useGlobalStoreState,
  FilterEnum,
} from "../store";
import { ThemeButton } from "./ThemeButton";
import { RefreshButton } from "./RefreshButton";
import { ClearButton } from "./ClearButton";
import { RecordButton } from "./RecordButton";
import { SwitchButton } from "./SwitchButton";
import { SupportUs } from "./SupportUs";
import { ExportButton } from "./ExportButton";
import { ImportButton } from "./ImportButton";

const viewSelector = (state: useGlobalStoreState) => ({
  view: state.view,
  setView: state.setView,
  search: state.search,
  setSearch: state.setSearch,
  filter: state.filter,
  setFilter: state.setFilter,
});

export const Header = () => {
  const {
    view,
    setView,
    search,
    setSearch,
    filter,
    setFilter,
  } = useGlobalStore(viewSelector, shallow);
  const setSelectedMock = useChromeStore((state) => state.setSelectedMock);
  const [showSupportUs, setShowSupportUs] = useState(false);

  return (
    <Tabs defaultValue={ViewEnum.MOCKS} value={view} onTabChange={setView}>
      <Tabs.List style={{ width: "100%" }}>
        <Flex justify="space-between" align="center" style={{ width: "100%" }}>
          <Flex align="center">
            <Tabs.Tab value={ViewEnum.MOCKS}>Mocks</Tabs.Tab>
            <Tabs.Tab value={ViewEnum.LOGS}>Logs</Tabs.Tab>
            <Flex align="center" gap={8}>
              <Button
                onClick={() => setSelectedMock({})}
                leftIcon={<MdAdd />}
                size="xs"
                variant="subtle"
              >
                Add Mock
              </Button>
              <Input
                icon={<TbSearch />}
                placeholder="Search..."
                size="xs"
                defaultValue={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <Select
                size="xs"
                defaultValue={filter}
                onChange={(value) => {
                  if (value) {
                    setFilter(value);
                  }
                }}
                data={[
                  { value: FilterEnum.ALL, label: "All" },
                  { value: FilterEnum.ACTIVE, label: "Active" },
                  { value: FilterEnum.INACTIVE, label: "Inactive" },
                ]}
                wrapperProps={{ style: { width: "90px" } }}
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
            <ExportButton />
            <ImportButton />
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
