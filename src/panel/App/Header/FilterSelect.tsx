import { Select } from "@mantine/core";
import { FilterEnum, useGlobalStore, useGlobalStoreState } from "../store";
import React from "react";
import { shallow } from "zustand/shallow";

const filterSelector = (state: useGlobalStoreState) => ({
  filter: state.filter,
  setFilter: state.setFilter,
});

export const FilterSelect = () => {
  const { filter, setFilter } = useGlobalStore(filterSelector, shallow);

  return (
    <Select
      size="xs"
      defaultValue={filter}
      onChange={(value) => {
        if (value) {
          setFilter(value);
        }
      }}
      data={[
        { value: FilterEnum.ALL, label: "All" },
        { value: FilterEnum.ACTIVE, label: "Active" },
        { value: FilterEnum.INACTIVE, label: "Inactive" },
      ]}
      wrapperProps={{ style: { width: "90px" } }}
    />
  );
};
