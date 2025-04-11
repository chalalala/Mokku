import { Button, createStyles, Flex, Title } from "@mantine/core";
import React from "react";
import { SideDrawerHeader } from "../../Blocks/SideDrawer";
import { MdClose } from "react-icons/md";
import { ListMocks } from "../ListMocks/ListMocks";
import { IMockResponse } from "@mokku/types";

const useStyles = createStyles((theme) => ({
  root: {
    display: "flex",
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    zIndex: 1,
    background: "white",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    borderRadius: 0,
    minWidth: 0,
  },
  wrapper: {
    padding: 12,
    height: "100%",
    overflow: "auto",
    paddingTop: 0,
    minHeight: 0,
  },
  footer: {
    padding: 12,
    borderTop: `1px solid ${theme.colors.gray[2]}`,
  },
}));

interface Props {
  mocks: IMockResponse[];
  onAddMock: (mockId: string) => void;
  toggleMock: (mock: IMockResponse) => void;
  onRowClick: (mock: IMockResponse) => void;
  onClose: () => void;
}

export const AddMocksToGroup = ({
  mocks,
  onAddMock,
  toggleMock,
  onClose,
}: Props) => {
  const { classes } = useStyles();

  return (
    <div className={classes.root}>
      <Flex direction="column" gap={12} className={classes.card}>
        <SideDrawerHeader>
          <Title order={6}>Add Mocks To Group</Title>
          <MdClose style={{ cursor: "pointer" }} onClick={onClose} />
        </SideDrawerHeader>

        <div className={classes.wrapper}>
          <ListMocks
            shouldShowAddButton
            mocks={mocks}
            emptyDataTitle="No Mocks Available."
            emptyDataDescription="No mocks are available to add to the group."
            onAddMock={onAddMock}
            toggleMock={toggleMock}
          />
        </div>

        <Flex justify="flex-end" gap={4} className={classes.footer}>
          <Button compact onClick={onClose}>
            Done
          </Button>
        </Flex>
      </Flex>
    </div>
  );
};
