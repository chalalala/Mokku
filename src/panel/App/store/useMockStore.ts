import { IStore, IURLMap, IDynamicURLMap, IMockResponse } from "@mokku/types";
import { getStore, getDefaultStore } from "../service/storeActions";
import { create } from "zustand";
import { IMockGroup } from "../types/mockGroup";

export type StoreProperties = {
	store: IStore;
	urlMap: IURLMap;
	dynamicUrlMap: IDynamicURLMap;
};

export interface useChromeStoreState extends StoreProperties {
	init: () => void;
	setStoreProperties: (properties: StoreProperties) => void;
	selectedMock?: IMockResponse;
	setSelectedMock: (mock?: Partial<IMockResponse>) => void;
	selectedGroup?: IMockGroup;
	setSelectedGroup: (group?: Partial<IMockResponse>) => void;
}

export const useMockStoreSelector = (state: useChromeStoreState) => ({
	store: state.store,
	setSelectedMock: state.setSelectedMock,
	selectedMock: state.selectedMock,
	setStoreProperties: state.setStoreProperties,
	selectedGroup: state.selectedGroup,
	setSelectedGroup: state.setSelectedGroup,
});

// this is our useStore hook that we can use in our components to get parts of the store and call actions
export const useChromeStore = create<useChromeStoreState>((set, get) => ({
	store: getDefaultStore(),
	dynamicUrlMap: {},
	urlMap: {},
	init: async () => {
		const { dynamicUrlMap, store, urlMap } = await getStore();
		set({ dynamicUrlMap, store, urlMap });
	},
	setStoreProperties: ({ dynamicUrlMap, store, urlMap }) => {
		set({ dynamicUrlMap, store, urlMap });
	},
	selectedMock: undefined,
	setSelectedMock: (mock?: IMockResponse) => {
		set({ selectedMock: mock });
	},
	selectedGroup: undefined,
	setSelectedGroup: (mock?: IMockGroup) => {
		set({ selectedGroup: mock });
	},
}));
