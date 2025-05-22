import {
  Button,
  Card,
  createStyles,
  Flex,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { v4 as uuidv4 } from "uuid";
import React, { useEffect, useMemo, useState } from "react";
import { SideDrawerHeader } from "../../Blocks/SideDrawer";
import { useForm } from "@mantine/form";
import { MdAdd, MdClose } from "react-icons/md";
import { storeActions } from "../../service/storeActions";
import { useChromeStoreState } from "../../store/useMockStore";
import { notifications } from "@mantine/notifications";
import { useGlobalStore } from "../../store/useGlobalStore";
import { IMockGroup } from "../../types/mockGroup";
import { ListMocks } from "../ListMocks/ListMocks";
import { useMockActions } from "../../Mocks/Mocks.action";
import { IMockResponse } from "@mokku/types";
import { AddMocksToGroup } from "./AddGroup.AddMocksToGroup";

const useStyles = createStyles((theme) => ({
  root: {
    position: "relative",
    height: "100%",
    isolation: "isolate",
  },
  flexGrow: {
    flexGrow: 2,
  },
  card: {
    display: "flex",
    flexDirection: "column",
    padding: "0 !important",
    height: "100%",
    borderRadius: 0,
  },
  wrapper: {
    padding: 12,
    height: "100%",
    overflow: "auto",
    paddingTop: 0,
    minHeight: 0,
  },
  tableWrapper: {
    flex: 1,
    minHeight: 0,
  },
  footer: {
    padding: 12,
    borderTop: `1px solid ${theme.colors.gray[2]}`,
  },
}));

export const AddGroupForm = ({
  store,
  selectedGroup,
  setSelectedGroup,
  setSelectedMock,
  setStoreProperties,
}: Pick<
  useChromeStoreState,
  | "store"
  | "selectedGroup"
  | "setSelectedGroup"
  | "setSelectedMock"
  | "setStoreProperties"
>) => {
  const {
    classes: { root, flexGrow, wrapper, tableWrapper, footer, card },
  } = useStyles();
  const tab = useGlobalStore((state) => state.meta.tab);
  const { toggleMock } = useMockActions();
  const form = useForm<Partial<IMockGroup>>({
    initialValues: {
      ...selectedGroup,
    },
  });
  const [selectedMocksIds, setSelectedMocksIds] = useState<string[]>(
    selectedGroup.mocksIds || [],
  );
  const [isOpenListMocks, setIsOpenListMocks] = useState(false);

  const isNewGroup = !selectedGroup.id;
  const hasSelectedMocks = !!selectedMocksIds.length;

  const onAddMock = (mockId: string) => {
    setSelectedMocksIds((ids) => [...ids, mockId]);
  };

  const onRemoveMock = (mockId: string) => {
    setSelectedMocksIds((ids) => ids.filter((id) => id !== mockId));
  };

  const onMockRowClick = (mock: IMockResponse) => {
    setSelectedMock(mock);
  };

  const onOpenSelectMocks = () => {
    setIsOpenListMocks(true);
  };

  const onCloseSelectMocks = () => {
    setIsOpenListMocks(false);
  };

  const onSubmit = (values: IMockGroup) => {
    if (!values.id) {
      values.id = uuidv4();
    }

    const validMocksIds = [];

    for (const mock of store.mocks) {
      if (validMocksIds.length === selectedMocksIds.length) {
        break;
      }

      if (!selectedMocksIds.includes(mock.id)) {
        continue;
      }

      mock.groupIds = [...new Set([...(mock.groupIds || []), values.id])];
      validMocksIds.push(mock.id);
    }

    values.mocksIds = validMocksIds;

    const updatedStore = isNewGroup
      ? storeActions.addGroups(store, values)
      : storeActions.updateGroups(store, values);

    storeActions
      .updateStoreInDB(updatedStore)
      .then(setStoreProperties)
      .then(() => {
        storeActions.refreshContentStore(tab.id);
        setSelectedGroup();
        notifications.show({
          title: `${values.name} group ${isNewGroup ? "added" : "updated"}`,
          message: `Group "${values.name}" has been ${
            isNewGroup ? "added" : "updated"
          }.`,
        });
      })
      .catch(() => {
        notifications.show({
          title: `Cannot ${isNewGroup ? "add" : "update"} group.`,
          message: `Something went wrong, unable to ${
            isNewGroup ? "add" : "update"
          } new group.`,
          color: "red",
        });
      });
  };

  const [selectedMocks, unSelectedMocks] = useMemo(() => {
    const selected = [];
    const unSelected = [];

    for (const mock of store.mocks) {
      if (selectedMocksIds.includes(mock.id)) {
        selected.push(mock);
      } else {
        unSelected.push(mock);
      }
    }

    return [selected, unSelected];
  }, [selectedMocksIds, store.mocks]);

  useEffect(() => {
    setSelectedMocksIds(selectedGroup.mocksIds || []);
  }, [selectedGroup]);

  return (
    <div className={root}>
      <form style={{ height: "100%" }} onSubmit={form.onSubmit(onSubmit)}>
        <Card className={card}>
          <SideDrawerHeader>
            <Title order={6}>{isNewGroup ? "Add Group" : "Update Group"}</Title>
            <MdClose
              style={{ cursor: "pointer" }}
              onClick={() => setSelectedGroup()}
            />
          </SideDrawerHeader>
          <Flex direction="column" gap={16} className={wrapper}>
            <Flex gap={12} align="center">
              <TextInput
                required
                label="Name"
                placeholder="Goals Success"
                className={flexGrow}
                {...form.getInputProps("name")}
              />
            </Flex>
            <Flex gap={12} align="center">
              <Textarea
                className={flexGrow}
                label="Description"
                placeholder="Success case for goals API"
                {...form.getInputProps("description")}
              />
            </Flex>
            <Flex direction="column" gap={12} className={tableWrapper}>
              <Flex justify="space-between" align="center">
                <Text fw={500} fz="sm">
                  Mocks
                </Text>

                <Button
                  compact
                  uppercase
                  variant="subtle"
                  size="xs"
                  leftIcon={<MdAdd />}
                  styles={{
                    leftIcon: { marginRight: 4 },
                  }}
                  onClick={onOpenSelectMocks}
                >
                  Add mocks
                </Button>
              </Flex>

              <ListMocks
                shouldShowToggle
                shouldShowRemoveButton
                mocks={selectedMocks}
                emptyDataTitle="No Mocks Selected In This Group."
                emptyDataDescription="Add at least one mock to group!"
                onRemoveMock={onRemoveMock}
                toggleMock={toggleMock}
                onRowClick={onMockRowClick}
              />
            </Flex>
          </Flex>
          <Flex className={footer} justify="flex-end" gap={4}>
            <Button
              color="red"
              compact
              onClick={() => setSelectedGroup(undefined)}
            >
              Close
            </Button>

            <Button compact type="submit" disabled={!hasSelectedMocks}>
              {isNewGroup ? "Add Group" : "Update Group"}
            </Button>
          </Flex>
        </Card>
      </form>

      {isOpenListMocks ? (
        <AddMocksToGroup
          mocks={unSelectedMocks}
          onAddMock={onAddMock}
          toggleMock={toggleMock}
          onRowClick={onMockRowClick}
          onClose={onCloseSelectMocks}
        />
      ) : null}
    </div>
  );
};
