import { IMockGroup, IMockResponse } from "@mokku/types";
import { exportData, getExportData } from "./utils";
import { isEmpty } from "lodash";

jest.mock("lodash", () => ({
  ...jest.requireActual("lodash"),
  isEmpty: jest.fn(),
}));

describe("getExportData", () => {
  const mock: IMockResponse = {
    active: false,
    createdOn: 1738829672766,
    delay: 500,
    description: "",
    dynamic: false,
    headers: [
      { name: "Accept", value: "application/json, text/plain, */*" },
      { name: "Content-Type", value: "application/json" },
    ],
    id: "11222c89-662a-422e-8c84-2403c447dca3",
    method: "POST",
    name: "Test",
    response: "{}",
    status: 200,
    url: "/api/test",
  };

  const mocks = [mock, { ...mock, id: "123" }];

  const selectedGroups: IMockGroup[] = [
    {
      id: "1",
      mocksIds: [mock.id],
      name: "Group 1",
      createdOn: 1738829673766,
    },
  ];

  it("should return empty object if no mocks or groups are selected", () => {
    expect(getExportData({})).toEqual({});
  });

  it('should return object with "selectedMocks" key if mocks are selected', () => {
    expect(getExportData({ selectedMocks: [mock] })).toEqual({
      mocks: [mock],
    });
  });

  it('should return object with "mocks" and "groups" keys if groups are selected', () => {
    expect(
      getExportData({
        selectedGroups,
        selectedMocks: [mock],
        mocks,
      })
    ).toEqual({
      mocks: [mock],
      groups: selectedGroups,
    });
  });
});

describe("exportData", () => {
  const originalURL = window.URL;

  beforeAll(() => {
    window.URL = class CustomURL extends URL {
      public static readonly createObjectURL = jest.fn();
      public static readonly revokeObjectURL = jest.fn();
    };
  });

  afterAll(() => {
    window.URL = originalURL;
  });

  it("should not invoke the below code if exported data is empty", () => {
    (isEmpty as jest.Mock).mockReturnValue(true);

    exportData({ selectedMocks: [], mocks: [] });

    expect(window.URL.createObjectURL).not.toHaveBeenCalled();
  });

  it("should invoke export data if exported data is not empty", () => {
    (isEmpty as jest.Mock).mockReturnValue(false);

    exportData({ selectedMocks: [], mocks: [] });

    expect(window.URL.createObjectURL).toHaveBeenCalled();
  });
});
