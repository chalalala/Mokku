import { IMockResponse } from "@mokku/types";
import { create } from "zustand";

export interface State {
	selectedMocksForAction: IMockResponse[];
	setSelectedMocksForAction: (mocks: IMockResponse[]) => void;
}

export const useMocksSelectionStore = create<State>((set) => ({
	selectedMocksForAction: [],
	setSelectedMocksForAction: (mocks) => {
		set({ selectedMocksForAction: mocks });
	},
}));
