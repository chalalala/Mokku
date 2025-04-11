import { Button } from "@mantine/core";
import React from "react";
import { MdAdd } from "react-icons/md";

interface Props {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const AddButton = ({ onClick }: Props) => {
  return (
    <Button
      onClick={onClick}
      styles={{
        leftIcon: { marginRight: 4 },
      }}
      leftIcon={<MdAdd />}
      variant="subtle"
      color="blue"
      compact
    >
      Add to group
    </Button>
  );
};
