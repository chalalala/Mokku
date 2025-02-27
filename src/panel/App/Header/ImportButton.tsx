import React, { ChangeEvent } from "react";
import { TbDatabaseImport } from "react-icons/tb";
import { ActionIcon } from "@mantine/core";
import { useChromeStore, useGlobalStore, useMockStoreSelector } from "../store";
import { shallow } from "zustand/shallow";
import { storeActions } from "../service/storeActions";
import { IMockResponse } from "@mokku/types";
import { notifications } from "@mantine/notifications";

export const ImportButton = () => {
	const { store, setStoreProperties, setSelectedMock } = useChromeStore(
		useMockStoreSelector,
		shallow
	);
	const tab = useGlobalStore((state) => state.meta.tab);

	const importMocks = (eventInput: ChangeEvent<HTMLInputElement>) => {
		const file = eventInput.target.files?.[0];
		const reader = new FileReader();

		reader.onload = async (event) => {
			const content = reader.result;

			if (typeof content !== "string") {
				return;
			}

			try {
				const parsedContent: IMockResponse[] = JSON.parse(content);
				const updatedStore = storeActions.addMocks(store, parsedContent);
				const properties = await storeActions.updateStoreInDB(updatedStore);
				setStoreProperties(properties);
				storeActions.refreshContentStore(tab.id);
				setSelectedMock();

				notifications.show({
					title: "Imported successfully.",
					message: `Mocks has been imported.`,
				});

				eventInput.target.value = "";
			} catch (error) {
				notifications.show({
					title: `Cannot import mocks.`,
					message: `Something went wrong, unable to import mocks.`,
					color: "red",
				});
			}
		};

		if (file) {
			reader.readAsText(file);
		}
	};

	return (
		<ActionIcon
			component="label"
			variant="outline"
			color={"blue"}
			title="Import Mocks"
		>
			<TbDatabaseImport />
			<input
				type="file"
				accept=".json"
				aria-hidden="true"
				hidden
				onChange={importMocks}
			/>
		</ActionIcon>
	);
};
