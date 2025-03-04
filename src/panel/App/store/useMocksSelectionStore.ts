import { IMockGroup, IMockResponse } from "@mokku/types";
import { create } from "zustand";

interface State {
  selectedMocks: IMockResponse[];
  setSelectedMocks: (selectedMocks: IMockResponse[]) => void;

  selectedGroups: IMockGroup[];
  setSelectedGroups: (selectedGroups: IMockGroup[]) => void;

  resetSelection: () => void;
}

export const useSelectionStore = create<State>((set) => ({
  selectedMocks: [],
  setSelectedMocks: (selectedMocks) => {
    set({ selectedMocks });
  },

  selectedGroups: [],
  setSelectedGroups: (selectedGroups) => {
    set({ selectedGroups });
  },

  resetSelection: () => {
    set({ selectedMocks: [], selectedGroups: [] });
  },
}));
