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
import React, { useEffect, useState } from "react";
import { SideDrawerHeader } from "../../Blocks/SideDrawer";
import { useForm } from "@mantine/form";
import { MdClose } from "react-icons/md";
import { storeActions } from "../../service/storeActions";
import { useChromeStoreState } from "../../store/useMockStore";
import { notifications } from "@mantine/notifications";
import { useGlobalStore } from "../../store/useGlobalStore";
import { IMockGroup } from "../../types/mockGroup";
import { AddGroupListMocks } from "./AddGroup.ListMocks";
import { useMockActions } from "../../Mocks/Mocks.action";

const useStyles = createStyles((theme) => ({
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
  },
  tabs: {
    flexGrow: 2,
    display: "flex",
    flexDirection: "column",
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
  setStoreProperties,
}: Pick<
  useChromeStoreState,
  "store" | "selectedGroup" | "setSelectedGroup" | "setStoreProperties"
>) => {
  const {
    classes: { flexGrow, wrapper, footer, card },
  } = useStyles();
  const tab = useGlobalStore((state) => state.meta.tab);
  const { toggleMock } = useMockActions();
  const form = useForm<Partial<IMockGroup>>({
    initialValues: {
      ...selectedGroup,
    },
  });
  const [selectedMocksIds, setSelectedMocksIds] = useState<string[]>(
    selectedGroup.mocksIds || []
  );

  const isNewMock = !selectedGroup.id;
  const hasSelectedMocks = !!selectedMocksIds.length;

  const onAddMock = (mockId: string) => {
    setSelectedMocksIds((ids) => [...ids, mockId]);
  };

  const onRemoveMock = (mockId: string) => {
    setSelectedMocksIds((ids) => ids.filter((id) => id !== mockId));
  };

  const onSubmit = (values: IMockGroup) => {
    if (!values.id) {
      values.id = uuidv4();
    }

    values.mocksIds = selectedMocksIds;

    const updatedStore = isNewMock
      ? storeActions.addGroups(store, values)
      : storeActions.updateGroups(store, values);

    storeActions
      .updateStoreInDB(updatedStore)
      .then(setStoreProperties)
      .then(() => {
        storeActions.refreshContentStore(tab.id);
        setSelectedGroup();
        notifications.show({
          title: `${values.name} group ${isNewMock ? "added" : "updated"}`,
          message: `Group "${values.name}" has been ${
            isNewMock ? "added" : "updated"
          }.`,
        });
      })
      .catch(() => {
        notifications.show({
          title: `Cannot ${isNewMock ? "add" : "update"} group.`,
          message: `Something went wrong, unable to ${
            isNewMock ? "add" : "update"
          } new group.`,
          color: "red",
        });
      });
  };

  useEffect(() => {
    setSelectedMocksIds(selectedGroup.mocksIds || []);
  }, [selectedGroup]);

  return (
    <form style={{ height: "100%" }} onSubmit={form.onSubmit(onSubmit)}>
      <>
        <Card className={card}>
          <SideDrawerHeader>
            <Title order={6}>{isNewMock ? "Add Group" : "Update Group"}</Title>
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
            <Flex direction="column" gap={12}>
              <AddGroupListMocks
                store={store}
                selectedMocks={selectedMocksIds}
                onAddMock={onAddMock}
                onRemoveMock={onRemoveMock}
                toggleMock={toggleMock}
              />
            </Flex>
          </Flex>
          <Flex className={footer} justify="space-between">
            <Text color="red">
              {hasSelectedMocks ? "" : "Add at least one mock to group!"}
            </Text>
            <Flex justify="flex-end" gap={4}>
              <Button
                color="red"
                compact
                onClick={() => setSelectedGroup(undefined)}
              >
                Close
              </Button>
              <Button compact type="submit" disabled={!hasSelectedMocks}>
                {isNewMock ? "Add Group" : "Update Group"}
              </Button>
            </Flex>
          </Flex>
        </Card>
      </>
    </form>
  );
};
