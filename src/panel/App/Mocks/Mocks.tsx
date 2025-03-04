import React, { useCallback, useMemo } from "react";
import { ActionIcon, Checkbox, Flex, Switch } from "@mantine/core";
import { TableSchema, TableWrapper } from "../Blocks/Table";
import { IMockResponse } from "@mokku/types";
import { useGlobalStore, useChromeStore, useMockStoreSelector } from "../store";
import { shallow } from "zustand/shallow";
import {
  MdDeleteOutline,
  MdOutlineContentCopy,
  MdOutlineModeEditOutline,
} from "react-icons/md";
import { useMockActions } from "./Mocks.action";
import { Placeholder } from "../Blocks/Placeholder";
import { ToggleAll } from "./ToggleAll/ToggleAll";
import { useSelectionStore } from "../store/useMocksSelectionStore";

interface GetSchemeProps {
  isSelectedAll: boolean;
  selectedMocks: IMockResponse[];
  toggleMock: (mock: IMockResponse) => void;
  deleteMock: (mock: IMockResponse) => void;
  editMock: (mock: IMockResponse) => void;
  duplicateMock: (mock: IMockResponse) => void;
  toggleMockSelection: (mock: IMockResponse, isChecked: boolean) => void;
  toggleAllMockSelection: (isChecked: boolean) => void;
}

const getSchema = ({
  isSelectedAll,
  selectedMocks,
  toggleMock,
  deleteMock,
  duplicateMock,
  editMock,
  toggleMockSelection,
  toggleAllMockSelection,
}: GetSchemeProps): TableSchema<IMockResponse> => [
  {
    header: (
      <Checkbox
        checked={isSelectedAll}
        onChange={(event) => {
          toggleAllMockSelection(event.target.checked);
        }}
      />
    ),
    content: (data) => (
      <Checkbox
        checked={selectedMocks.some((item) => item.id === data.id)}
        onClick={(event) => {
          event.stopPropagation();
        }}
        onChange={(event) => {
          toggleMockSelection(data, event.target.checked);
        }}
      />
    ),
    width: 60,
  },
  {
    header: <ToggleAll />,
    content: (data) => (
      <div
        onClick={(event) => {
          // this was not working with switch for some unknown reason
          event.stopPropagation();
        }}
        style={{ cursor: "pointer" }}
      >
        <Switch
          checked={data.active}
          onChange={(x) => {
            toggleMock({ ...data, active: x.target.checked });
          }}
        />
      </div>
    ),
    width: 60,
  },
  {
    header: "Name",
    content: (data) => data.name,
    width: 240,
  },
  {
    header: "Method",
    content: (data) => data.method,
    width: 100,
  },
  {
    header: "URL",
    content: (data) => data.url,
  },
  {
    header: "Status",
    content: (data) => data.status,
    width: 80,
  },
  {
    header: "Delay",
    content: (data) => data.delay,
    width: 120,
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
          onClick={() => editMock(data)}
          title={`Edit Mock ${data.name}`}
        >
          <MdOutlineModeEditOutline />
        </ActionIcon>

        <ActionIcon
          variant="outline"
          color="blue"
          onClick={() => duplicateMock(data)}
          title={`Duplicate ${data.name}`}
        >
          <MdOutlineContentCopy />
        </ActionIcon>
        <ActionIcon
          variant="outline"
          color="red"
          onClick={() => deleteMock(data)}
          title={`Delete ${data.name}`}
        >
          <MdDeleteOutline />
        </ActionIcon>
      </Flex>
    ),
    width: 80,
  },
];

export const Mocks = () => {
  const { store, selectedMock, setSelectedMock } = useChromeStore(
    useMockStoreSelector,
    shallow
  );
  const {
    selectedMocks: selectedMocksForAction,
    setSelectedMocks: setSelectedMocksForAction,
  } = useSelectionStore();

  const search = useGlobalStore((state) => state.search).toLowerCase();

  const { deleteMock, duplicateMock, toggleMock, editMock } = useMockActions();

  const isSelectedAll = useMemo(
    () => selectedMocksForAction.length === store.mocks.length,
    [selectedMocksForAction, store.mocks]
  );

  const toggleMockSelection = useCallback(
    (mock: IMockResponse, isChecked: boolean) => {
      if (isChecked) {
        setSelectedMocksForAction([...selectedMocksForAction, mock]);
      } else {
        setSelectedMocksForAction(
          selectedMocksForAction.filter((item) => item.id !== mock.id)
        );
      }
    },
    [selectedMocksForAction]
  );

  const toggleAllMockSelection = useCallback(
    (isChecked: boolean) => {
      setSelectedMocksForAction(isChecked ? store.mocks : []);
    },
    [store.mocks]
  );

  const schema = getSchema({
    isSelectedAll,
    selectedMocks: selectedMocksForAction,
    toggleMockSelection,
    toggleAllMockSelection,
    toggleMock,
    deleteMock,
    duplicateMock,
    editMock,
  });

  const filteredMocks = store.mocks.filter(
    (mock) =>
      (mock?.name || "").toLowerCase().includes(search) ||
      (mock?.url || "").toLowerCase().includes(search) ||
      (mock?.method || "").toLowerCase().includes(search) ||
      (mock?.status || "").toString().includes(search)
  );

  if (store.mocks.length === 0) {
    return (
      <Placeholder
        title="No Mocks created yet."
        description="Create a mock from scratch or mock a log from logs."
      />
    );
  }

  if (filteredMocks.length === 0) {
    return (
      <Placeholder
        title="No matched mock."
        description="No mock is matching the current search, you can search by name, url, method or status."
      />
    );
  }

  return (
    <TableWrapper
      onRowClick={(data) => setSelectedMock(data)}
      selectedRowId={selectedMock?.id}
      data={filteredMocks}
      schema={schema}
    />
  );
};
