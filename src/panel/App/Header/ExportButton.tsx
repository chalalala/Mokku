import React from "react";
import { TbFileExport } from "react-icons/tb";
import { ActionIcon } from "@mantine/core";
import { useChromeStore, useMockStoreSelector } from "../store";
import { shallow } from "zustand/shallow";

export const ExportButton = () => {
	const { store } = useChromeStore(useMockStoreSelector, shallow);
	const mocks = store.mocks;

	const exportMocks = () => {
		if (!mocks) {
			return;
		}

		const blob = new Blob([JSON.stringify(mocks)], {
			type: "application/json",
		});
		const link = document.createElement("a");
		const url = URL.createObjectURL(blob);

		link.href = url;
		link.download = "mokku.json";
		link.click();

		URL.revokeObjectURL(url);
	};

	return (
		<ActionIcon
			variant="outline"
			color={"blue"}
			onClick={exportMocks}
			title="Export Mocks"
		>
			<TbFileExport />
		</ActionIcon>
	);
};
