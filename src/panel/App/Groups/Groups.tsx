import React, { useMemo } from "react";
import { ActionIcon, Flex, Switch } from "@mantine/core";
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

interface GetSchemeProps {
  isGroupSelected: (group: IMockGroup) => boolean;
  toggleGroup: (group: IMockGroup, isActive: boolean) => void;
  deleteGroup: (group: IMockGroup) => void;
  editGroup: (group: IMockGroup) => void;
  duplicateGroup: (group: IMockGroup) => void;
}

const getSchema = ({
  isGroupSelected,
  toggleGroup,
  deleteGroup,
  duplicateGroup,
  editGroup,
}: GetSchemeProps): TableSchema<IMockGroup> => [
  // {
  // 	header: <Checkbox />,
  // 	content: (data) => (
  // 		<div
  // 			onClick={(event) => {
  // 				// this was not working with switch for some unknown reason
  // 				event.stopPropagation();
  // 			}}
  // 			style={{ cursor: "pointer" }}
  // 		>
  // 			<Checkbox
  // 				checked={data.active}
  // 				onChange={(x) => {
  // 					toggleMock({ ...data, active: x.target.checked });
  // 				}}
  // 			/>
  // 		</div>
  // 	),
  // 	width: 60,
  // },
  {
    header: "",
    content: (data) => (
      <div
        onClick={(event) => {
          // this was not working with switch for some unknown reason
          event.stopPropagation();
        }}
        style={{ cursor: "pointer" }}
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

  const schema = useMemo(() => {
    const activeMocksIds = store.mocks
      .filter((mock) => mock.active)
      .map((mock) => mock.id);

    const isGroupSelected = (group: IMockGroup) => {
      return group.mocksIds.every((mockId) => activeMocksIds.includes(mockId));
    };

    return getSchema({
      isGroupSelected,
      toggleGroup,
      deleteGroup,
      duplicateGroup,
      editGroup,
    });
  }, [store.mocks, deleteGroup, duplicateGroup, editGroup, toggleGroup]);

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
        description="Create a mock from scratch or mock a log from logs."
      />
    );
  }

  if (filteredGroups.length === 0) {
    return (
      <Placeholder
        title="No matched group."
        description="No group is matching the current search, you can search by name, url, method or status."
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
