import { IMockGroup, IMockResponse } from "@mokku/types";

interface IExportParams {
  selectedMocks?: IMockResponse[];
  selectedGroups?: IMockGroup[];
  mocks?: IMockResponse[];
}

interface IExportData {
  groups?: IMockGroup[];
  mocks?: IMockResponse[];
}

export const getExportData = ({
  mocks,
  selectedGroups = [],
  selectedMocks = [],
}: IExportParams) => {
  let exportedData: IExportData = {};
  const exportingMocks = new Set<IMockResponse>();

  // Export selected groups
  if (selectedGroups?.length) {
    const mockObj = mocks.reduce((acc, mock) => {
      acc[mock.id] = mock;
      return acc;
    }, {});

    for (const group of selectedGroups) {
      for (const mockId of group.mocksIds) {
        exportingMocks.add(mockObj[mockId]);
      }
    }
  }

  // Export selected mocks
  if (selectedMocks?.length) {
    for (const selectedMock of selectedMocks) {
      exportingMocks.add(selectedMock);
    }
  }

  if (exportingMocks.size) {
    exportedData.mocks = [...exportingMocks];
  }

  if (selectedGroups.length) {
    exportedData.groups = selectedGroups;
  }

  return exportedData;
};

export const exportData = (exportData: IExportData) => {
  const blob = new Blob([JSON.stringify(exportData)], {
    type: "application/json",
  });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.href = url;
  link.download = "mokku.json";
  link.click();

  URL.revokeObjectURL(url);
};
