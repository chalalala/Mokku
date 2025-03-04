import React from "react";
import { TbFileExport } from "react-icons/tb";
import { ActionIcon } from "@mantine/core";
import { useSelectionStore } from "../../store/useMocksSelectionStore";
import { useChromeStore, useMockStoreSelector } from "../../store";
import { shallow } from "zustand/shallow";
import { exportData } from "./utils";

export const ExportButton = () => {
  const { store } = useChromeStore(useMockStoreSelector, shallow);
  const { selectedMocks, selectedGroups } = useSelectionStore();

  const onExport = () => {
    exportData({
      mocks: store.mocks,
      selectedMocks,
      selectedGroups,
    });
  };

  return (
    <ActionIcon
      variant="outline"
      color={"blue"}
      onClick={onExport}
      title={`Export Selected Items`}
    >
      <TbFileExport />
    </ActionIcon>
  );
};
