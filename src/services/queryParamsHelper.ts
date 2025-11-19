export const parseQueryParams = (url: string): Record<string, string> => {
  try {
    const [_, searchParams] = url.split("?");

    if (!searchParams) {
      return {};
    }

    const searchParamsObj = new URLSearchParams(searchParams);
    const params: Record<string, string> = {};

    for (const [key, value] of searchParamsObj.entries()) {
      params[key] = value;
    }

    return params;
  } catch {
    return {};
  }
};

export const matchQueryParams = (
  mockParams?: Record<string, string>,
  requestParams?: Record<string, string>,
): boolean => {
  if (!mockParams || Object.keys(mockParams).length === 0) {
    return true; // No query params defined in mock, match any
  }

  if (!requestParams) {
    return false;
  }

  return Object.keys(mockParams).every(
    (key) => mockParams[key] === requestParams[key],
  );
};

export const createUrlMapKey = (
  url: string,
  queryParams?: Record<string, string>,
) => {
  if (!queryParams || Object.keys(queryParams).length === 0) {
    return url;
  }

  try {
    const sortedParams = Object.keys(queryParams)
      .sort((a, b) => a.localeCompare(b))
      .map((key) => `${key}=${queryParams[key]}`)
      .join("&");

    return `${url}?${sortedParams}`;
  } catch {
    return url;
  }
};
