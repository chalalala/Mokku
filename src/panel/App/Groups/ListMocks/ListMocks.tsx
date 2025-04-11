import { createStyles, Flex, Input, Switch } from "@mantine/core";
import React, { useMemo, useState } from "react";
import { TbSearch } from "react-icons/tb";
import { TableSchema, TableWrapper } from "../../Blocks/Table";
import { IMockResponse } from "@mokku/types";
import { AddButton } from "./ListMocks.AddButton";
import { RemoveButton } from "./ListMocks.RemoveButton";
import { Placeholder } from "../../Blocks/Placeholder";

interface Props {
  mocks: IMockResponse[];
  shouldShowToggle?: boolean;
  shouldShowAddButton?: boolean;
  shouldShowRemoveButton?: boolean;
  emptyDataTitle?: string;
  emptyDataDescription?: string;
  onAddMock?: (mockId: string) => void;
  onRemoveMock?: (mockId: string) => void;
  toggleMock: (mock: IMockResponse) => void;
  onRowClick?: (mock: IMockResponse) => void;
}

interface GetSchemeProps {
  shouldShowToggle?: boolean;
  shouldShowAddButton?: boolean;
  shouldShowRemoveButton?: boolean;
  onAddMock?: (mockId: string) => void;
  onRemoveMock?: (mockId: string) => void;
  toggleMock: (mock: IMockResponse) => void;
}

const getSchema = ({
  shouldShowToggle,
  shouldShowAddButton,
  shouldShowRemoveButton,
  onAddMock,
  onRemoveMock,
  toggleMock,
}: GetSchemeProps): TableSchema<IMockResponse> => [
  {
    header: "",
    content: (data) => {
      if (shouldShowAddButton) {
        return (
          <AddButton
            onClick={(event) => {
              event.stopPropagation();
              onAddMock?.(data.id);
            }}
          />
        );
      }

      if (shouldShowRemoveButton) {
        return (
          <RemoveButton
            onClick={(event) => {
              event.stopPropagation();
              onRemoveMock?.(data.id);
            }}
          />
        );
      }

      return null;
    },
    width: 120,
  },
  ...(shouldShowToggle
    ? [
        {
          header: "Is Active",
          content: (data) => (
            <div
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              <Switch
                checked={data.active}
                onChange={(event) => {
                  toggleMock({ ...data, active: event.target.checked });
                }}
              />
            </div>
          ),
          width: 60,
        },
      ]
    : []),
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
];

const useStyles = createStyles((theme) => ({
  tableWrapper: {
    overflow: "auto",
    minHeight: "min-content",
  },
}));

export const ListMocks = ({
  mocks,
  shouldShowToggle,
  shouldShowAddButton,
  shouldShowRemoveButton,
  emptyDataTitle = "",
  emptyDataDescription = "",
  onAddMock,
  onRemoveMock,
  toggleMock,
  onRowClick,
}: Props) => {
  const { classes } = useStyles();
  const [search, setSearch] = useState("");
  const schema = getSchema({
    shouldShowToggle,
    shouldShowAddButton,
    shouldShowRemoveButton,
    onAddMock,
    onRemoveMock,
    toggleMock,
  });

  const filteredMocks = useMemo(() => {
    return mocks.filter(
      (mock) =>
        (mock?.name || "").toLowerCase().includes(search.toLocaleLowerCase()) ||
        (mock?.url || "").toLowerCase().includes(search.toLocaleLowerCase()) ||
        (mock?.method || "")
          .toLowerCase()
          .includes(search.toLocaleLowerCase()) ||
        (mock?.status || "").toString().includes(search.toLocaleLowerCase()),
    );
  }, [mocks, search]);

  if (mocks.length === 0) {
    return (
      <Placeholder title={emptyDataTitle} description={emptyDataDescription} />
    );
  }

  return (
    <Flex direction="column" gap={12}>
      <Input
        icon={<TbSearch />}
        placeholder="Search..."
        size="xs"
        defaultValue={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <div className={classes.tableWrapper}>
        {filteredMocks.length === 0 ? (
          <Placeholder
            title="No matched mock."
            description="No mock is matching the current search, you can search by name, url, method or status."
          />
        ) : (
          <TableWrapper
            data={filteredMocks}
            schema={schema}
            // selectedRowClass={classes.selectedRow}
            onRowClick={onRowClick}
          />
        )}
      </div>
    </Flex>
  );
};
