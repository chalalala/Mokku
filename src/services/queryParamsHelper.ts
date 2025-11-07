export const parseQueryParams = (url: string): Record<string, string> => {
  try {
    const urlObj = new URL(url);
    const params: Record<string, string> = {};

    urlObj.searchParams.forEach((value, key) => {
      params[key] = value;
    });

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
    const queryParamsObj = new URLSearchParams(queryParams);

    return `${url}?${queryParamsObj.toString()}`;
  } catch {
    return url;
  }
};
