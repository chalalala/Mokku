import { Button } from "@mantine/core";
import React from "react";
import { MdRemove } from "react-icons/md";

interface Props {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const RemoveButton = ({ onClick }: Props) => {
  return (
    <Button
      onClick={onClick}
      styles={{
        leftIcon: { marginRight: 4 },
      }}
      leftIcon={<MdRemove />}
      variant="subtle"
      color="red"
      compact
    >
      Remove from group
    </Button>
  );
};
