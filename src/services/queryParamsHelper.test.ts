import {
  parseQueryParams,
  matchQueryParams,
  createUrlMapKey,
} from "./queryParamsHelper";

describe("queryParamsHelper", () => {
  describe("parseQueryParams", () => {
    it("should parse query parameters from an absolute URL", () => {
      const url = "https://example.com/api?key1=value1&key2=value2";
      expect(parseQueryParams(url)).toEqual({
        key1: "value1",
        key2: "value2",
      });
    });

    it("should parse query parameters from a relative URL", () => {
      const url = "/api?key1=value1&key2=value2";
      expect(parseQueryParams(url)).toEqual({
        key1: "value1",
        key2: "value2",
      });
    });

    it("should return an empty object if no query parameters are present", () => {
      const url = "https://example.com/api";
      expect(parseQueryParams(url)).toEqual({});
    });

    it("should return an empty object for invalid URLs", () => {
      const url = "invalid-url";
      expect(parseQueryParams(url)).toEqual({});
    });

    it("should handle URLs with empty query parameters", () => {
      const url = "https://example.com/api?";
      expect(parseQueryParams(url)).toEqual({});
    });
  });

  describe("matchQueryParams", () => {
    it("should return true if mockParams is undefined or empty", () => {
      expect(matchQueryParams(undefined, { key1: "value1" })).toBe(true);
      expect(matchQueryParams({}, { key1: "value1" })).toBe(true);
    });

    it("should return false if requestParams is undefined", () => {
      expect(matchQueryParams({ key1: "value1" }, undefined)).toBe(false);
    });

    it("should return true if all mockParams match requestParams", () => {
      const mockParams = { key1: "value1", key2: "value2" };
      const requestParams = { key1: "value1", key2: "value2", key3: "value3" };
      expect(matchQueryParams(mockParams, requestParams)).toBe(true);
    });

    it("should return false if any mockParams do not match requestParams", () => {
      const mockParams = { key1: "value1", key2: "value2" };
      const requestParams = { key1: "value1", key2: "differentValue" };
      expect(matchQueryParams(mockParams, requestParams)).toBe(false);
    });
  });

  describe("createUrlMapKey", () => {
    it("should return the URL if queryParams is undefined or empty", () => {
      const url = "https://example.com/api";
      expect(createUrlMapKey(url)).toBe(url);
      expect(createUrlMapKey(url, {})).toBe(url);
    });

    it("should append sorted query parameters to the URL", () => {
      const url = "https://example.com/api";
      const queryParams = { key2: "value2", key1: "value1" };
      expect(createUrlMapKey(url, queryParams)).toBe(
        "https://example.com/api?key1=value1&key2=value2",
      );
    });
  });
});
