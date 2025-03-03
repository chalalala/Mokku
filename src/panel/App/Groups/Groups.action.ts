import { notifications } from "@mantine/notifications";
import { useCallback } from "react";
import { shallow } from "zustand/shallow";
import { storeActions } from "../service/storeActions";
import { useGlobalStore } from "../store/useGlobalStore";
import { useChromeStore, useChromeStoreState } from "../store/useMockStore";
import { IMockGroup } from "@mokku/types";

const useMockStoreSelector = (state: useChromeStoreState) => ({
  store: state.store,
  setStoreProperties: state.setStoreProperties,
  setSelectedGroup: state.setSelectedGroup,
});

export const useGroupActions = () => {
  const { store, setSelectedGroup, setStoreProperties } = useChromeStore(
    useMockStoreSelector,
    shallow,
  );
  const tab = useGlobalStore((state) => state.meta.tab);

  const toggleGroup = useCallback(
    (groupToBeUpdated: IMockGroup, isActive: boolean) => {
      const updatedStore = storeActions.updateGroups(store, groupToBeUpdated);

      updatedStore.mocks.forEach((mock) => {
        if (groupToBeUpdated.mocksIds.includes(mock.id)) {
          mock.active = isActive;
        }
      });

      const groupStatus = isActive ? "is enabled" : "is disabled";

      storeActions
        .updateStoreInDB(updatedStore)
        .then(setStoreProperties)
        .then(() => {
          storeActions.refreshContentStore(tab.id);
          notifications.show({
            title: `"${groupToBeUpdated.name}" is ${groupStatus}`,
            message: `Group ${groupStatus}`,
          });
        })
        .catch(() => {
          notifications.show({
            title: "Cannot updated group.",
            message: "Something went wrong, unable to update group.",
            color: "red",
          });
        });
    },
    [store, setStoreProperties],
  );
  const deleteGroup = useCallback(
    (groupToBeDeleted: IMockGroup) => {
      const updatedStore = storeActions.deleteGroups(
        store,
        groupToBeDeleted.id,
      );

      storeActions
        .updateStoreInDB(updatedStore)
        .then(setStoreProperties)
        .then(() => {
          storeActions.refreshContentStore(tab.id);
          notifications.show({
            title: `"${groupToBeDeleted.name}" group deleted`,
            message: `Group "${groupToBeDeleted.name}" is deleted successfully.`,
          });
        })
        .catch((error) => {
          console.log(error);
          notifications.show({
            title: "Cannot delete group.",
            message:
              "Something went wrong, unable to delete group. Check console for error.",
            color: "red",
          });
        });
    },
    [store, setStoreProperties],
  );
  const duplicateGroup = useCallback(
    (group: IMockGroup) => {
      setSelectedGroup({ ...group, id: undefined });
    },
    [setSelectedGroup],
  );

  const editGroup = useCallback(
    (group: IMockGroup) => {
      setSelectedGroup(group);
    },
    [setSelectedGroup],
  );

  return {
    toggleGroup,
    deleteGroup,
    duplicateGroup,
    editGroup,
  };
};
