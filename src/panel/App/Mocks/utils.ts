import { FilterEnum } from "@mokku/store";
import { IMockResponse } from "@mokku/types";

export const filterMocks = ({
  mocks,
  search,
  filter,
}: {
  mocks: IMockResponse[];
  search: string;
  filter: string;
}) => {
  if (!search && filter === FilterEnum.ALL) {
    return mocks;
  }

  return mocks.filter((mock) => {
    if (filter === FilterEnum.ACTIVE && !mock?.active) {
      return false;
    }

    if (filter === FilterEnum.INACTIVE && mock?.active) {
      return false;
    }

    return (
      (mock?.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (mock?.url || "").toLowerCase().includes(search.toLowerCase()) ||
      (mock?.method || "").toLowerCase().includes(search.toLowerCase()) ||
      (mock?.status || "").toString().includes(search.toLowerCase())
    );
  });
};
