import { FilterEnum } from "@mokku/store";
import { filterMocks } from "./utils";
import { IMockResponse, MethodEnum } from "../types";

describe("filterMocks", () => {
  const mocks: IMockResponse[] = [
    {
      active: true,
      createdOn: 1738829672766,
      delay: 500,
      description: "",
      dynamic: false,
      headers: [
        { name: "Accept", value: "application/json, text/plain, */*" },
        { name: "Content-Type", value: "application/json" },
      ],
      id: "11222c89-662a-422e-8c84-2403c447dca3",
      method: MethodEnum.GET,
      name: "Mock1",
      response: "{}",
      status: 200,
      url: "/api/test",
    },
    {
      name: "Mock2",
      url: "/api/mock2",
      method: MethodEnum.POST,
      status: 404,
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
      response: "{}",
    },
    {
      active: true,
      createdOn: 1738829672766,
      delay: 500,
      description: "",
      dynamic: false,
      headers: [
        { name: "Accept", value: "application/json, text/plain, */*" },
        { name: "Content-Type", value: "application/json" },
      ],
      id: "11222c89-662a-422e-8c84-2403c447dca3",
      method: MethodEnum.PATCH,
      name: "Mock3",
      response: "{}",
      status: 200,
      url: "/api/test",
    },
  ];

  it("should return all mocks when no search and filter is ALL", () => {
    const result = filterMocks({ mocks, search: "", filter: FilterEnum.ALL });

    expect(result).toEqual(mocks);
  });

  it("should return empty array when no mocks passed to function", () => {
    const result = filterMocks({
      mocks: [],
      search: "",
      filter: FilterEnum.ALL,
    });

    expect(result).toEqual([]);
  });

  it("should return empty array when no mocks match search term", () => {
    const result = filterMocks({
      mocks,
      search: "NonExistent",
      filter: FilterEnum.ALL,
    });

    expect(result).toEqual([]);
  });

  it("should return empty array when no mocks match filters", () => {
    const mocks: IMockResponse[] = [
      {
        name: "Mock2",
        url: "/api/mock2",
        method: MethodEnum.POST,
        status: 404,
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
        response: "{}",
      },
    ];

    const result = filterMocks({
      mocks,
      search: "NonExistent",
      filter: FilterEnum.ACTIVE,
    });

    expect(result).toEqual([]);
  });

  it("should filter mocks by name", () => {
    const result = filterMocks({
      mocks,
      search: "Mock1",
      filter: FilterEnum.ALL,
    });

    expect(result).toEqual([mocks[0]]);
  });

  it("should filter mocks by URL", () => {
    const result = filterMocks({
      mocks,
      search: "/api/mock2",
      filter: FilterEnum.ALL,
    });

    expect(result).toEqual([mocks[1]]);
  });

  it("should filter mocks by method", () => {
    const result = filterMocks({
      mocks,
      search: MethodEnum.GET,
      filter: FilterEnum.ALL,
    });

    expect(result).toEqual([mocks[0]]);
  });

  it("should filter mocks by status code", () => {
    const result = filterMocks({
      mocks,
      search: "404",
      filter: FilterEnum.ALL,
    });

    expect(result).toEqual([mocks[1]]);
  });

  it("should filter mocks by active status when filter is ACTIVE", () => {
    const result = filterMocks({
      mocks,
      search: "",
      filter: FilterEnum.ACTIVE,
    });

    expect(result).toEqual([mocks[0], mocks[2]]);
  });

  it("should filter mocks by inactive status when filter is INACTIVE", () => {
    const result = filterMocks({
      mocks,
      search: "",
      filter: FilterEnum.INACTIVE,
    });

    expect(result).toEqual([mocks[1]]);
  });

  it("should filter mocks by search term and active status", () => {
    const result = filterMocks({
      mocks,
      search: "mock1",
      filter: FilterEnum.ACTIVE,
    });

    expect(result).toEqual([mocks[0]]);
  });

  it("should handle case-insensitive search for name", () => {
    const result = filterMocks({
      mocks,
      search: "MOCK1",
      filter: FilterEnum.ALL,
    });

    expect(result).toEqual([mocks[0]]);
  });

  it("should handle case-insensitive search for URL", () => {
    const result = filterMocks({
      mocks,
      search: "/API/MOCK2",
      filter: FilterEnum.ALL,
    });

    expect(result).toEqual([mocks[1]]);
  });

  it("should handle case-insensitive search for method", () => {
    const result = filterMocks({
      mocks,
      search: "get",
      filter: FilterEnum.ALL,
    });

    expect(result).toEqual([mocks[0]]);
  });

  it("should not throw error if one of mocks is null", () => {
    const result = filterMocks({
      mocks: [null as unknown] as IMockResponse[],
      search: "Mock1",
      filter: FilterEnum.ALL,
    });

    expect(result).toEqual([]);
  });
});
