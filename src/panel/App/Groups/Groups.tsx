import React, { useCallback, useMemo } from "react";
import { ActionIcon, Checkbox, Flex, Switch } from "@mantine/core";
import { TableSchema, TableWrapper } from "../Blocks/Table";
import { IMockGroup } from "@mokku/types";
import { useGlobalStore, useChromeStore, useMockStoreSelector } from "../store";
import { shallow } from "zustand/shallow";
import {
  MdDeleteOutline,
  MdOutlineContentCopy,
  MdOutlineModeEditOutline,
} from "react-icons/md";
import { useGroupActions } from "./Groups.action";
import { Placeholder } from "../Blocks/Placeholder";
import { useSelectionStore } from "../store/useMocksSelectionStore";

interface GetSchemeProps {
  isSelectedAll: boolean;
  selectedGroups: IMockGroup[];
  isGroupSelected: (group: IMockGroup) => boolean;
  toggleGroup: (group: IMockGroup, isActive: boolean) => void;
  deleteGroup: (group: IMockGroup) => void;
  editGroup: (group: IMockGroup) => void;
  duplicateGroup: (group: IMockGroup) => void;
  toggleGroupSelection: (group: IMockGroup, isChecked: boolean) => void;
  toggleAllGroupSelection: (isChecked: boolean) => void;
}

const getSchema = ({
  isSelectedAll,
  selectedGroups,
  isGroupSelected,
  toggleGroup,
  deleteGroup,
  duplicateGroup,
  editGroup,
  toggleGroupSelection,
  toggleAllGroupSelection,
}: GetSchemeProps): TableSchema<IMockGroup> => [
  {
    header: (
      <Checkbox
        checked={isSelectedAll}
        onChange={(event) => {
          toggleAllGroupSelection(event.target.checked);
        }}
      />
    ),
    content: (data) => (
      <Checkbox
        checked={selectedGroups.some((item) => item.id === data.id)}
        onChange={(event) => {
          toggleGroupSelection(data, event.target.checked);
        }}
      />
    ),
    width: 60,
  },
  {
    header: "",
    content: (data) => (
      <div
        role="none"
        onClick={(event) => {
          // this was not working with switch for some unknown reason
          event.stopPropagation();
        }}
      >
        <Switch
          checked={isGroupSelected(data)}
          onChange={(x) => {
            toggleGroup(data, x.target.checked);
          }}
        />
      </div>
    ),
    width: 60,
  },
  {
    header: "Name",
    content: (data) => data.name,
    width: 350,
  },
  {
    header: "Description",
    content: (data) => data.description,
  },
  {
    header: "",
    content: (data) => (
      <Flex
        align="center"
        gap="4px"
        onClick={(event) => {
          // this was not working with switch for some unknown reason
          event.stopPropagation();
        }}
      >
        <ActionIcon
          variant="outline"
          color="blue"
          onClick={() => editGroup(data)}
          title={`Edit ${data.name}`}
        >
          <MdOutlineModeEditOutline />
        </ActionIcon>

        <ActionIcon
          variant="outline"
          color="blue"
          onClick={() => duplicateGroup(data)}
          title={`Duplicate ${data.name}`}
        >
          <MdOutlineContentCopy />
        </ActionIcon>
        <ActionIcon
          variant="outline"
          color="red"
          onClick={() => deleteGroup(data)}
          title={`Delete ${data.name}`}
        >
          <MdDeleteOutline />
        </ActionIcon>
      </Flex>
    ),
    width: 80,
  },
];

export const Groups = () => {
  const { store, selectedGroup, setSelectedGroup } = useChromeStore(
    useMockStoreSelector,
    shallow
  );
  const search = useGlobalStore((state) => state.search).toLowerCase();
  const {
    deleteGroup,
    duplicateGroup,
    toggleGroup,
    editGroup,
  } = useGroupActions();
  const { selectedGroups, setSelectedGroups } = useSelectionStore();

  const isSelectedAll = useMemo(
    () => selectedGroups.length === store.groups.length,
    [selectedGroups, store.groups]
  );

  const toggleGroupSelection = useCallback(
    (group: IMockGroup, isChecked: boolean) => {
      if (isChecked) {
        setSelectedGroups([...selectedGroups, group]);
      } else {
        setSelectedGroups(
          selectedGroups.filter((item) => item.id !== group.id)
        );
      }
    },
    [selectedGroups]
  );

  const toggleAllGroupSelection = useCallback(
    (isChecked: boolean) => {
      setSelectedGroups(isChecked ? store.groups : []);
    },
    [store.groups]
  );

  const isGroupSelected = useCallback(
    (group: IMockGroup) => {
      const activeMocksIds = store.mocks
        .filter((mock) => mock.active)
        .map((mock) => mock.id);

      return group.mocksIds.every((mockId) => activeMocksIds.includes(mockId));
    },
    [store.mocks]
  );

  const schema = useMemo(() => {
    return getSchema({
      isGroupSelected,
      toggleGroup,
      deleteGroup,
      duplicateGroup,
      editGroup,
      toggleGroupSelection,
      toggleAllGroupSelection,
      isSelectedAll,
      selectedGroups,
    });
  }, [
    selectedGroups,
    isSelectedAll,
    isGroupSelected,
    deleteGroup,
    duplicateGroup,
    editGroup,
    toggleGroup,
  ]);

  const filteredGroups = useMemo(
    () =>
      store.groups

        .filter(
          (group) =>
            (group?.name || "").toLowerCase().includes(search) ||
            (group?.description || "").toLowerCase().includes(search)
        )
        .sort((a, b) => a.name.localeCompare(b.name)),
    [store.groups, search]
  );

  if (store.groups.length === 0) {
    return (
      <Placeholder
        title="No Groups created yet."
        description='Select "+ Add Group" to create a new group.'
      />
    );
  }

  if (filteredGroups.length === 0) {
    return (
      <Placeholder
        title="No matched group."
        description="No group is matching the current search, you can search by name or description."
      />
    );
  }

  return (
    <TableWrapper
      onRowClick={(data) => setSelectedGroup(data)}
      selectedRowId={selectedGroup?.id}
      data={filteredGroups}
      schema={schema}
    />
  );
};
