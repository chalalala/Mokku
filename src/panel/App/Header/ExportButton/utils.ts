import { IMockGroup, IMockResponse } from "@mokku/types";
import { isEmpty } from "lodash";

interface IExportData {
  selectedMocks: IMockResponse[];
  selectedGroups?: IMockGroup[];
  mocks?: IMockResponse[];
}

export const getExportData = ({
  mocks,
  selectedGroups,
  selectedMocks,
}: IExportData) => {
  let exportedData = {};

  // Export selected groups
  if (selectedGroups?.length) {
    let exportingMocks = new Set<IMockResponse>();

    const mockObj = mocks.reduce((acc, mock) => {
      acc[mock.id] = mock;
      return acc;
    }, {});

    for (const group of selectedGroups) {
      for (const mockId of group.mocksIds) {
        exportingMocks.add(mockObj[mockId]);
      }
    }

    exportedData = {
      mocks: [...exportingMocks],
      groups: selectedGroups,
    };
  }
  // Export selected mocks
  else if (selectedMocks.length) {
    exportedData = { mocks: selectedMocks };
  }

  return exportedData;
};

export const exportData = (exportData: IExportData) => {
  const data = getExportData(exportData);

  if (isEmpty(data)) {
    return;
  }

  const blob = new Blob([JSON.stringify(data)], {
    type: "application/json",
  });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.href = url;
  link.download = "mokku.json";
  link.click();

  URL.revokeObjectURL(url);
};
