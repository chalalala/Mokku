import React, { useEffect, useState } from "react";
import { useLogStore, useChromeStore, useMockStoreSelector } from "../store";
import { AddMock } from "../Mocks/AddMock/AddMock";
import { LogDetails } from "../Logs/LogDetails/LogDetails";
import { createStyles, Flex } from "@mantine/core";
import { AddGroup } from "../Groups/AddGroup/AddGroup";

enum ModalType {
  Mock = "MOCK",
  Group = "GROUP",
  Log = "LOG",
}

const useStyles = createStyles((theme) => ({
  wrapper: {
    display: "flex",
    position: "fixed",
    top: 0,
    right: 0,
    height: "100vh",
    boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
    zIndex: 1000,
    background: "white",
  },
  modal: {
    transform: "translateX(0)",
    transition: "transform 0.15s ease-in-out",

    [`@media (max-width: ${theme.breakpoints.md})`]: {
      position: "fixed",
      top: 0,
      right: 0,
      height: "100vh",
    },

    "@starting-style": {
      transform: "translateX(100%)",
    },
  },
}));

export const Modal = () => {
  const { selectedMock, selectedGroup } = useChromeStore(useMockStoreSelector);
  const selectedLog = useLogStore((state) => state.selectedLog);
  const setSelectedLog = useLogStore((state) => state.setSelectedLog);
  const [order, setOrder] = useState<ModalType[]>([]);
  const { classes } = useStyles();

  const handleModalInstance = (modalType: ModalType, condition: boolean) => {
    setOrder((order) => {
      if (condition) {
        if (order.includes(modalType)) {
          return [...order];
        } else {
          return [modalType, ...order];
        }
      } else {
        return order.filter((o) => o !== modalType);
      }
    });
  };

  useEffect(() => {
    handleModalInstance(ModalType.Mock, !!selectedMock);
  }, [selectedMock]);

  useEffect(() => {
    handleModalInstance(ModalType.Group, !!selectedGroup);
  }, [selectedGroup]);

  useEffect(() => {
    handleModalInstance(ModalType.Log, !!selectedLog);
  }, [selectedLog]);

  const Mock = selectedMock ? <AddMock /> : null;
  const Group = selectedGroup ? <AddGroup /> : null;
  const Log = selectedLog ? (
    <LogDetails log={selectedLog} onClose={() => setSelectedLog()} />
  ) : null;

  const componentOrderMap = {
    MOCK: Mock,
    GROUP: Group,
    LOG: Log,
  };

  return (
    <div className={classes.wrapper}>
      {order.map((o, idx) => (
        <Flex
          key={o}
          className={classes.modal}
          style={{ zIndex: order.length - idx }}
        >
          {componentOrderMap[o]}
        </Flex>
      ))}
    </div>
  );
};
