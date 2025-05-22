import { IMockGroup, IMockResponse, IStore } from "@mokku/types";
import { addMocks, deleteMocks, updateMocks } from "./storeActions";
import { addGroups, updateGroups, deleteGroups } from "./storeActions";

describe("storeActions - Mocks", () => {
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

  describe("deleteMocks", () => {
    it("should not modify store if no matching mock id is found", () => {
      const store: IStore = {
        active: true,
        activityInfo: { promoted: false },
        collections: {},
        groups: [],
        mocks: [mock],
        theme: "dark",
        totalMocksCreated: 100,
      };

      // Passing an id that doesn't exist in mocks.
      expect(deleteMocks(store, "non-existing-id")).toEqual(store);
    });

    it("should not modify store if no mocks in available store", () => {
      const store: IStore = {
        active: true,
        activityInfo: { promoted: false },
        collections: {},
        groups: [],
        mocks: [],
        theme: "dark",
        totalMocksCreated: 0,
      };

      expect(deleteMocks(store, mock.id)).toEqual(store);
    });

    it("should handle removal of mock with non-existing group reference", () => {
      // The mock has a groupIds property that does not exist in the store.groups.
      const store: IStore = {
        active: false,
        activityInfo: { promoted: false },
        collections: {},
        groups: [], // No groups exist
        mocks: [{ ...mock, groupIds: ["non-existing-group"] }],
        theme: "light",
        totalMocksCreated: 43,
      };

      // The mock should be removed, but since the group reference doesn't exist, no group is updated.
      expect(deleteMocks(store, mock.id)).toEqual({ ...store, mocks: [] });
    });

    it("should return store with single mock removed", () => {
      const store: IStore = {
        active: false,
        activityInfo: {
          promoted: false,
        },
        collections: {},
        groups: [
          {
            id: "16f07551-c667-4c44-a743-047c54cf9755",
            mocksIds: ["14193cac-de68-4bc0-b3c0-71634a187c32"],
            name: "Test",
          },
        ],
        mocks: [mock],
        theme: "light",
        totalMocksCreated: 43,
      };

      expect(deleteMocks(store, mock.id)).toEqual({ ...store, mocks: [] });
    });

    it("should return store with multiple mocks removed", () => {
      const store: IStore = {
        active: false,
        activityInfo: {
          promoted: false,
        },
        collections: {},
        groups: [],
        mocks: [
          mock,
          { ...mock, id: "to-be-deleted" },
          { ...mock, id: "to-be-retained" },
        ],
        theme: "light",
        totalMocksCreated: 43,
      };

      const mockIdsToBeDeleted = [mock.id, "to-be-deleted"];

      expect(deleteMocks(store, mockIdsToBeDeleted)).toEqual({
        ...store,
        mocks: [{ ...mock, id: "to-be-retained" }],
      });
    });

    it("should remove mock from group if it is in the group", () => {
      const group: IMockGroup = {
        id: "16f07551-c667-4c44-a743-047c54cf9755",
        mocksIds: [mock.id],
        name: "Test",
      };

      const store: IStore = {
        active: false,
        activityInfo: {
          promoted: false,
        },
        collections: {},
        groups: [group],
        mocks: [{ ...mock, groupIds: [group.id] }],
        theme: "light",
        totalMocksCreated: 43,
      };

      expect(deleteMocks(store, mock.id)).toEqual({
        ...store,
        groups: [
          {
            ...group,
            mocksIds: [],
          },
        ],
        mocks: [],
      });
    });
  });

  describe("addMocks", () => {
    it("should add a single mock to the store", () => {
      const store: IStore = {
        active: true,
        activityInfo: { promoted: false },
        collections: {},
        groups: [],
        mocks: [],
        theme: "dark",
        totalMocksCreated: 0,
      };

      const newMock: IMockResponse = {
        active: false,
        createdOn: 1738829672766,
        delay: 500,
        description: "",
        dynamic: false,
        headers: [
          { name: "Accept", value: "application/json, text/plain, */*" },
          { name: "Content-Type", value: "application/json" },
        ],
        id: "new-mock-id",
        method: "POST",
        name: "New Mock",
        response: "{}",
        status: 200,
        url: "/api/new",
      };

      expect(addMocks(store, newMock)).toEqual({
        ...store,
        mocks: [{ ...newMock, dynamic: false }],
        totalMocksCreated: 1,
      });
    });

    it("should add multiple mocks to the store", () => {
      const store: IStore = {
        active: true,
        activityInfo: { promoted: false },
        collections: {},
        groups: [],
        mocks: [],
        theme: "dark",
        totalMocksCreated: 0,
      };

      const newMocks: IMockResponse[] = [
        {
          active: false,
          createdOn: 1738829672766,
          delay: 500,
          description: "",
          dynamic: false,
          headers: [
            { name: "Accept", value: "application/json, text/plain, */*" },
            { name: "Content-Type", value: "application/json" },
          ],
          id: "mock-1",
          method: "GET",
          name: "Mock 1",
          response: "{}",
          status: 200,
          url: "/api/mock1",
        },
        {
          active: true,
          createdOn: 1738829672767,
          delay: 300,
          description: "",
          dynamic: false,
          headers: [
            { name: "Accept", value: "application/json, text/plain, */*" },
            { name: "Content-Type", value: "application/json" },
          ],
          id: "mock-2",
          method: "POST",
          name: "Mock 2",
          response: "{}",
          status: 201,
          url: "/api/mock2",
        },
      ];

      expect(addMocks(store, newMocks)).toEqual({
        ...store,
        mocks: [
          { ...newMocks[0], dynamic: false },
          { ...newMocks[1], dynamic: false },
        ],
        totalMocksCreated: 2,
      });
    });

    it("should not add duplicate mocks if shouldCheckDuplicated is true", () => {
      const store: IStore = {
        active: true,
        activityInfo: { promoted: false },
        collections: {},
        groups: [],
        mocks: [
          {
            active: false,
            createdOn: 1738829672766,
            delay: 500,
            description: "",
            dynamic: false,
            headers: [
              { name: "Accept", value: "application/json, text/plain, */*" },
              { name: "Content-Type", value: "application/json" },
            ],
            id: "existing-mock-id",
            method: "GET",
            name: "Existing Mock",
            response: "{}",
            status: 200,
            url: "/api/existing",
          },
        ],
        theme: "dark",
        totalMocksCreated: 1,
      };

      const newMock: IMockResponse = {
        active: false,
        createdOn: 1738829672766,
        delay: 500,
        description: "",
        dynamic: false,
        headers: [
          { name: "Accept", value: "application/json, text/plain, */*" },
          { name: "Content-Type", value: "application/json" },
        ],
        id: "existing-mock-id",
        method: "GET",
        name: "Duplicate Mock",
        response: "{}",
        status: 200,
        url: "/api/existing",
      };

      expect(addMocks(store, newMock, true)).toEqual(store);
    });

    it("should mark a mock as dynamic if its URL contains dynamic segments", () => {
      const store: IStore = {
        active: true,
        activityInfo: { promoted: false },
        collections: {},
        groups: [],
        mocks: [],
        theme: "dark",
        totalMocksCreated: 0,
      };

      const newMock: IMockResponse = {
        active: false,
        createdOn: 1738829672766,
        delay: 500,
        description: "",
        dynamic: false,
        headers: [
          { name: "Accept", value: "application/json, text/plain, */*" },
          { name: "Content-Type", value: "application/json" },
        ],
        id: "dynamic-mock-id",
        method: "GET",
        name: "Dynamic Mock",
        response: "{}",
        status: 200,
        url: "/api/:dynamicSegment",
      };

      expect(addMocks(store, newMock)).toEqual({
        ...store,
        mocks: [{ ...newMock, dynamic: true }],
        totalMocksCreated: 1,
      });
    });
  });

  describe("updateMocks", () => {
    it("should update a single mock in the store", () => {
      const store: IStore = {
        active: true,
        activityInfo: { promoted: false },
        collections: {},
        groups: [],
        mocks: [
          {
            active: false,
            createdOn: 1738829672766,
            delay: 500,
            description: "",
            dynamic: false,
            headers: [
              { name: "Accept", value: "application/json, text/plain, */*" },
              { name: "Content-Type", value: "application/json" },
            ],
            id: "mock-id",
            method: "GET",
            name: "Mock 1",
            response: "{}",
            status: 200,
            url: "/api/mock1",
          },
        ],
        theme: "dark",
        totalMocksCreated: 1,
      };

      const updatedMock = {
        id: "mock-id",
        name: "Updated Mock",
        url: "/api/updated-mock",
      };

      expect(updateMocks(store, updatedMock)).toEqual({
        ...store,
        mocks: [
          {
            ...store.mocks[0],
            ...updatedMock,
            dynamic: false,
          },
        ],
      });
    });

    it("should update multiple mocks in the store", () => {
      const store: IStore = {
        active: true,
        activityInfo: { promoted: false },
        collections: {},
        groups: [],
        mocks: [
          {
            active: false,
            createdOn: 1738829672766,
            delay: 500,
            description: "",
            dynamic: false,
            headers: [
              { name: "Accept", value: "application/json, text/plain, */*" },
              { name: "Content-Type", value: "application/json" },
            ],
            id: "mock-1",
            method: "GET",
            name: "Mock 1",
            response: "{}",
            status: 200,
            url: "/api/mock1",
          },
          {
            active: true,
            createdOn: 1738829672767,
            delay: 300,
            description: "",
            dynamic: false,
            headers: [
              { name: "Accept", value: "application/json, text/plain, */*" },
              { name: "Content-Type", value: "application/json" },
            ],
            id: "mock-2",
            method: "POST",
            name: "Mock 2",
            response: "{}",
            status: 201,
            url: "/api/mock2",
          },
        ],
        theme: "dark",
        totalMocksCreated: 2,
      };

      const updatedMocks = [
        {
          id: "mock-1",
          name: "Updated Mock 1",
          url: "/api/updated-mock1",
        },
        {
          id: "mock-2",
          name: "Updated Mock 2",
          url: "/api/updated-mock2",
        },
      ];

      expect(updateMocks(store, updatedMocks)).toEqual({
        ...store,
        mocks: [
          {
            ...store.mocks[0],
            ...updatedMocks[0],
            dynamic: false,
          },
          {
            ...store.mocks[1],
            ...updatedMocks[1],
            dynamic: false,
          },
        ],
      });
    });

    it("should mark a mock as dynamic if its URL contains dynamic segments", () => {
      const store: IStore = {
        active: true,
        activityInfo: { promoted: false },
        collections: {},
        groups: [],
        mocks: [
          {
            active: false,
            createdOn: 1738829672766,
            delay: 500,
            description: "",
            dynamic: false,
            headers: [
              { name: "Accept", value: "application/json, text/plain, */*" },
              { name: "Content-Type", value: "application/json" },
            ],
            id: "mock-id",
            method: "GET",
            name: "Mock 1",
            response: "{}",
            status: 200,
            url: "/api/mock1",
          },
        ],
        theme: "dark",
        totalMocksCreated: 1,
      };

      const updatedMock = {
        id: "mock-id",
        url: "/api/:dynamicSegment",
      };

      expect(updateMocks(store, updatedMock)).toEqual({
        ...store,
        mocks: [
          {
            ...store.mocks[0],
            ...updatedMock,
            dynamic: true,
          },
        ],
      });
    });

    it("should not modify the store if no matching mock id is found", () => {
      const store: IStore = {
        active: true,
        activityInfo: { promoted: false },
        collections: {},
        groups: [],
        mocks: [
          {
            active: false,
            createdOn: 1738829672766,
            delay: 500,
            description: "",
            dynamic: false,
            headers: [
              { name: "Accept", value: "application/json, text/plain, */*" },
              { name: "Content-Type", value: "application/json" },
            ],
            id: "mock-id",
            method: "GET",
            name: "Mock 1",
            response: "{}",
            status: 200,
            url: "/api/mock1",
          },
        ],
        theme: "dark",
        totalMocksCreated: 1,
      };

      const updatedMock = {
        id: "non-existing-id",
        name: "Non-Existing Mock",
      };

      expect(updateMocks(store, updatedMock)).toEqual(store);
    });
  });
});

describe("storeActions - Groups", () => {
  describe("addGroups", () => {
    it("should add a single group to the store", () => {
      const store: IStore = {
        active: true,
        activityInfo: { promoted: false },
        collections: {},
        groups: [],
        mocks: [],
        theme: "dark",
        totalMocksCreated: 0,
      };

      const newGroup: IMockGroup = {
        id: "group-1",
        name: "Test Group",
        mocksIds: [],
      };

      expect(addGroups(store, newGroup)).toEqual({
        ...store,
        groups: [newGroup],
      });
    });

    it("should add multiple groups to the store", () => {
      const store: IStore = {
        active: true,
        activityInfo: { promoted: false },
        collections: {},
        groups: [],
        mocks: [],
        theme: "dark",
        totalMocksCreated: 0,
      };

      const newGroups: IMockGroup[] = [
        { id: "group-1", name: "Group 1", mocksIds: [] },
        { id: "group-2", name: "Group 2", mocksIds: [] },
      ];

      expect(addGroups(store, newGroups)).toEqual({
        ...store,
        groups: newGroups,
      });
    });

    it("should not add duplicate groups if shouldCheckDuplicated is true", () => {
      const store: IStore = {
        active: true,
        activityInfo: { promoted: false },
        collections: {},
        groups: [{ id: "group-1", name: "Existing Group", mocksIds: [] }],
        mocks: [],
        theme: "dark",
        totalMocksCreated: 0,
      };

      const newGroup: IMockGroup = {
        id: "group-1",
        name: "Duplicate Group",
        mocksIds: [],
      };

      expect(addGroups(store, newGroup, true)).toEqual(store);
    });
  });

  describe("updateGroups", () => {
    it("should update a single group in the store", () => {
      const store: IStore = {
        active: true,
        activityInfo: { promoted: false },
        collections: {},
        groups: [{ id: "group-1", name: "Group 1", mocksIds: [] }],
        mocks: [],
        theme: "dark",
        totalMocksCreated: 0,
      };

      const updatedGroup: IMockGroup = {
        id: "group-1",
        name: "Updated Group 1",
        mocksIds: ["mock-1"],
      };

      expect(updateGroups(store, updatedGroup)).toEqual({
        ...store,
        groups: [updatedGroup],
      });
    });

    it("should update multiple groups in the store", () => {
      const store: IStore = {
        active: true,
        activityInfo: { promoted: false },
        collections: {},
        groups: [
          { id: "group-1", name: "Group 1", mocksIds: [] },
          { id: "group-2", name: "Group 2", mocksIds: [] },
        ],
        mocks: [],
        theme: "dark",
        totalMocksCreated: 0,
      };

      const updatedGroups: IMockGroup[] = [
        { id: "group-1", name: "Updated Group 1", mocksIds: ["mock-1"] },
        { id: "group-2", name: "Updated Group 2", mocksIds: ["mock-2"] },
      ];

      expect(updateGroups(store, updatedGroups)).toEqual({
        ...store,
        groups: updatedGroups,
      });
    });

    it("should not modify the store if no matching group id is found", () => {
      const store: IStore = {
        active: true,
        activityInfo: { promoted: false },
        collections: {},
        groups: [{ id: "group-1", name: "Group 1", mocksIds: [] }],
        mocks: [],
        theme: "dark",
        totalMocksCreated: 0,
      };

      const updatedGroup: IMockGroup = {
        id: "non-existing-group",
        name: "Non-Existing Group",
        mocksIds: [],
      };

      expect(updateGroups(store, updatedGroup)).toEqual(store);
    });
  });

  describe("deleteGroups", () => {
    it("should delete a single group from the store", () => {
      const store: IStore = {
        active: true,
        activityInfo: { promoted: false },
        collections: {},
        groups: [
          { id: "group-1", name: "Group 1", mocksIds: [] },
          { id: "group-2", name: "Group 2", mocksIds: [] },
        ],
        mocks: [],
        theme: "dark",
        totalMocksCreated: 0,
      };

      expect(deleteGroups(store, "group-1")).toEqual({
        ...store,
        groups: [{ id: "group-2", name: "Group 2", mocksIds: [] }],
      });
    });

    it("should delete multiple groups from the store", () => {
      const store: IStore = {
        active: true,
        activityInfo: { promoted: false },
        collections: {},
        groups: [
          { id: "group-1", name: "Group 1", mocksIds: [] },
          { id: "group-2", name: "Group 2", mocksIds: [] },
          { id: "group-3", name: "Group 3", mocksIds: [] },
        ],
        mocks: [],
        theme: "dark",
        totalMocksCreated: 0,
      };

      expect(deleteGroups(store, ["group-1", "group-3"])).toEqual({
        ...store,
        groups: [{ id: "group-2", name: "Group 2", mocksIds: [] }],
      });
    });

    it("should not modify the store if no matching group id is found", () => {
      const store: IStore = {
        active: true,
        activityInfo: { promoted: false },
        collections: {},
        groups: [{ id: "group-1", name: "Group 1", mocksIds: [] }],
        mocks: [],
        theme: "dark",
        totalMocksCreated: 0,
      };

      expect(deleteGroups(store, "non-existing-group")).toEqual(store);
    });
  });
});
