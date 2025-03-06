import React, { ChangeEvent } from "react";
import { TbDatabaseImport } from "react-icons/tb";
import { ActionIcon } from "@mantine/core";
import { useChromeStore, useGlobalStore, useMockStoreSelector } from "../store";
import { shallow } from "zustand/shallow";
import { storeActions } from "../service/storeActions";
import { IMockGroup, IMockResponse } from "@mokku/types";
import { notifications } from "@mantine/notifications";

interface IImportData {
  mocks: IMockResponse[];
  groups?: IMockGroup[];
}

export const ImportButton = () => {
  const { store, setStoreProperties, setSelectedMock } = useChromeStore(
    useMockStoreSelector,
    shallow
  );
  const tab = useGlobalStore((state) => state.meta.tab);

  const importData = (eventInput: ChangeEvent<HTMLInputElement>) => {
    const file = eventInput.target.files?.[0];
    const reader = new FileReader();

    reader.onload = async (event) => {
      const content = reader.result;
      let isImportingGroups = false;

      if (typeof content !== "string") {
        return;
      }

      try {
        const parsedContent: IImportData = JSON.parse(content);
        const mocks = parsedContent.mocks;
        const groups = parsedContent.groups;

        let updatedStore = store;

        updatedStore = storeActions.addMocks(updatedStore, mocks, true);

        if (groups) {
          updatedStore = storeActions.addGroups(updatedStore, groups, true);
          isImportingGroups = true;
        }

        const properties = await storeActions.updateStoreInDB(updatedStore);
        setStoreProperties(properties);
        storeActions.refreshContentStore(tab.id);
        setSelectedMock();

        notifications.show({
          title: "Imported successfully.",
          message: `${
            isImportingGroups ? "Groups" : "Mocks"
          } has been imported.`,
        });

        eventInput.target.value = "";
      } catch (error) {
        notifications.show({
          title: `Cannot import ${isImportingGroups ? "groups" : "mocks"}.`,
          message: `Something went wrong, unable to import ${
            isImportingGroups ? "groups" : "mocks"
          }.`,
          color: "red",
        });
      }
    };

    if (file) {
      reader.readAsText(file);
    }
  };

  return (
    <ActionIcon
      component="label"
      variant="outline"
      color={"blue"}
      title="Import Mocks / Groups"
    >
      <TbDatabaseImport />
      <input type="file" accept=".json" hidden onChange={importData} />
    </ActionIcon>
  );
};
