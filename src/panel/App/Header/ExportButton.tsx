import React from "react";
import { TbFileExport } from "react-icons/tb";
import { ActionIcon } from "@mantine/core";
import { useMocksSelectionStore } from "../store/useMocksSelectionStore";

export const ExportButton = () => {
	const { selectedMocksForAction } = useMocksSelectionStore();

	const exportMocks = () => {
		if (!selectedMocksForAction) {
			return;
		}

		const blob = new Blob([JSON.stringify(selectedMocksForAction)], {
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
			title={`Export ${selectedMocksForAction.length} Selected Mocks`}
		>
			<TbFileExport />
		</ActionIcon>
	);
};
