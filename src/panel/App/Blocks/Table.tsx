import React, { ReactNode } from "react";
import { createStyles, Table } from "@mantine/core";

export type TableSchema<T> = Array<{
	header: ReactNode;
	content: (data: T) => React.ReactNode;
	minWidth?: number;
	maxWidth?: number;
	width?: number;
}>;

export interface TableWrapperProps<T> {
	schema: TableSchema<T>;
	data: T[];
	onRowClick?: (data: T) => void;
	selectedRowId?: number | string;
}

const useStyles = createStyles((theme) => ({
	selectedRow: {
		background: `${theme.colors[theme.primaryColor][3]} !important`,
		...(theme.colorScheme === "dark"
			? {
					color: theme.black,
			  }
			: {}),
		"&:hover": {
			background: `${theme.colors[theme.primaryColor][3]} !important`,
			...(theme.colorScheme === "dark"
				? {
						color: theme.black,
				  }
				: {}),
		},
	},
	rows: {
		"&:hover": {
			cursor: "pointer",
		},
	},
	th: {
		background:
			theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
		position: "sticky",
		top: 0,
		borderBottom: "1px solid black",
	},
}));

export const TableWrapper = <T extends unknown & { id: string | number }>({
	schema,
	data,
	onRowClick,
	selectedRowId,
}: TableWrapperProps<T>) => {
	const { classes } = useStyles();

	const ths = (
		<tr>
			{schema.map(({ header, minWidth, maxWidth, width }, index) => (
				<th
					style={{ minWidth, maxWidth, width }}
					key={index}
					className={classes.th}
				>
					{header}
				</th>
			))}
		</tr>
	);

	const rows = data.map((row, index) => (
		<tr
			key={`row-${index}`}
			onClick={() => {
				onRowClick(row);
			}}
			className={`${selectedRowId === row.id ? classes.selectedRow : ""} ${
				classes.rows
			}`}
		>
			{schema.map(({ content }, index) => (
				<td key={index}>{content(row)}</td>
			))}
		</tr>
	));

	return (
		<Table
			captionSide="bottom"
			striped
			highlightOnHover
			withColumnBorders
			style={{ position: "relative" }}
		>
			<thead style={{ position: "relative", zIndex: 1 }}>{ths}</thead>
			<tbody>{rows}</tbody>
		</Table>
	);
};
