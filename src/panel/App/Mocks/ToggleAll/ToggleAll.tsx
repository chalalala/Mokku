import { Switch } from "@mantine/core";
import {
	useChromeStore,
	useGlobalStore,
	useMockStoreSelector,
} from "../../store";
import React from "react";
import { shallow } from "zustand/shallow";
import { storeActions } from "../../service/storeActions";
import { notifications } from "@mantine/notifications";

export const ToggleAll = () => {
	const { store, setStoreProperties } = useChromeStore(
		useMockStoreSelector,
		shallow
	);
	const tab = useGlobalStore((state) => state.meta.tab);

	const mocks = store.mocks;
	const isActive = mocks.every((mock) => mock.active);

	const toggleAll = async () => {
		try {
			const updatedMocks = mocks.map((mock) => ({
				...mock,
				active: !isActive,
			}));

			const updatedStore = storeActions.updateMocks(store, updatedMocks);
			const mockStatus = !isActive ? "enabled" : "disabled";

			const properties = await storeActions.updateStoreInDB(updatedStore);
			setStoreProperties(properties);
			storeActions.refreshContentStore(tab.id);

			notifications.show({
				title: `All mocks are ${mockStatus}`,
				message: `Toggle all mocks`,
			});
		} catch (error) {
			notifications.show({
				title: "Cannot toggle all mocks.",
				message: "Something went wrong, unable to update mocks.",
				color: "red",
			});
		}
	};

	return (
		<div>
			<Switch checked={isActive} onChange={toggleAll} />
		</div>
	);
};
