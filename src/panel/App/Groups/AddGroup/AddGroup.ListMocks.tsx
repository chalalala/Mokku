import { Button, createStyles, Input, Switch } from "@mantine/core";
import React, { useMemo, useState } from "react";
import { TbSearch } from "react-icons/tb";
import { TableSchema, TableWrapper } from "../../Blocks/Table";
import { IMockResponse, IStore } from "@mokku/types";
import { MdAdd, MdRemove } from "react-icons/md";

interface Props {
  store: IStore;
  selectedMocks: string[];
  onAddMock: (mockId: string) => void;
  onRemoveMock: (mockId: string) => void;
  toggleMock: (mock: IMockResponse) => void;
}

interface GetSchemeProps {
  selectedMocks: string[];
  onAddMock: (mockId: string) => void;
  onRemoveMock: (mockId: string) => void;
  toggleMock: (mock: IMockResponse) => void;
}

const getSchema = ({
  selectedMocks,
  onAddMock,
  onRemoveMock,
  toggleMock,
}: GetSchemeProps): TableSchema<IMockResponse> => [
  {
    header: "",
    content: (data) => (
      <Switch
        checked={data.active}
        onChange={(x) => {
          toggleMock({ ...data, active: x.target.checked });
        }}
      />
    ),
    width: 60,
  },
  {
    header: "Name",
    content: (data) => data.name,
  },
  {
    header: "Method",
    content: (data) => data.method,
    width: 100,
  },
  {
    header: "URL",
    content: (data) => data.url,
    width: 240,
  },
  {
    header: "",
    content: (data) => {
      const isSelected = selectedMocks.includes(data.id);
      const onClick = isSelected
        ? () => onRemoveMock(data.id)
        : () => onAddMock(data.id);

      return (
        <Button
          onClick={onClick}
          styles={{
            leftIcon: { marginRight: 4 },
          }}
          leftIcon={isSelected ? <MdRemove /> : <MdAdd />}
          variant="subtle"
          color={isSelected ? "red" : "blue"}
          compact
        >
          {isSelected ? "Remove from group" : "Add to group"}
        </Button>
      );
    },
    width: 120,
  },
];

const useStyles = createStyles((theme) => ({
  selectedRow: {
    background: `${theme.colors[theme.primaryColor][1]} !important`,
    ...(theme.colorScheme === "dark"
      ? {
          color: theme.black,
        }
      : {}),
    "&:hover": {
      background: `${theme.colors[theme.primaryColor][1]} !important`,
      ...(theme.colorScheme === "dark"
        ? {
            color: theme.black,
          }
        : {}),
    },
  },
}));

export const AddGroupListMocks = ({
  store,
  selectedMocks,
  onAddMock,
  onRemoveMock,
  toggleMock,
}: Props) => {
  const { classes } = useStyles();
  const [search, setSearch] = useState("");
  const schema = getSchema({
    selectedMocks,
    onAddMock,
    onRemoveMock,
    toggleMock,
  });

  const filteredMocks = useMemo(() => {
    const filtered = store.mocks.filter(
      (mock) =>
        (mock?.name || "").toLowerCase().includes(search.toLocaleLowerCase()) ||
        (mock?.url || "").toLowerCase().includes(search.toLocaleLowerCase()) ||
        (mock?.method || "")
          .toLowerCase()
          .includes(search.toLocaleLowerCase()) ||
        (mock?.status || "").toString().includes(search.toLocaleLowerCase())
    );

    filtered.sort((a, b) => {
      if (selectedMocks.includes(a.id) && !selectedMocks.includes(b.id)) {
        return -1;
      }

      if (!selectedMocks.includes(a.id) && selectedMocks.includes(b.id)) {
        return 1;
      }

      return 0;
      // return a.name.localeCompare(b.name);
    });

    return filtered;
  }, [store.mocks, selectedMocks, search]);

  return (
    <>
      <Input
        icon={<TbSearch />}
        placeholder="Search..."
        size="xs"
        defaultValue={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      <TableWrapper
        data={filteredMocks}
        schema={schema}
        selectedRowId={selectedMocks}
        selectedRowClass={classes.selectedRow}
      />
    </>
  );
};
