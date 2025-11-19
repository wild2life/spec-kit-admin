import type { MaterialRecord } from '~/utils/mock-material-data';

import { eventHandler, getQuery } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { MOCK_MATERIAL_DATA } from '~/utils/mock-material-data';
import {
  sleep,
  unAuthorizedResponse,
  usePageResponseSuccess,
} from '~/utils/response';

function filterMaterialData(
  data: MaterialRecord[],
  query: Record<string, any>,
): MaterialRecord[] {
  let filtered = [...data];

  // Text field filters (case-insensitive partial match)
  if (query.businessUnit) {
    filtered = filtered.filter(
      (item) =>
        item.businessUnit
          ?.toLowerCase()
          .includes(String(query.businessUnit).toLowerCase()) ||
        item.businessUnitCode
          ?.toLowerCase()
          .includes(String(query.businessUnit).toLowerCase()),
    );
  }

  if (query.supplier) {
    filtered = filtered.filter(
      (item) =>
        item.supplierName
          ?.toLowerCase()
          .includes(String(query.supplier).toLowerCase()) ||
        item.supplierCode
          ?.toLowerCase()
          .includes(String(query.supplier).toLowerCase()),
    );
  }

  if (query.supplierName) {
    filtered = filtered.filter((item) =>
      item.supplierName
        ?.toLowerCase()
        .includes(String(query.supplierName).toLowerCase()),
    );
  }

  if (query.cheryPartName) {
    filtered = filtered.filter((item) =>
      item.cheryPartName
        ?.toLowerCase()
        .includes(String(query.cheryPartName).toLowerCase()),
    );
  }

  if (query.supplierAssemblyPartName) {
    filtered = filtered.filter((item) =>
      item.supplierAssemblyPartName
        ?.toLowerCase()
        .includes(String(query.supplierAssemblyPartName).toLowerCase()),
    );
  }

  if (query.projectName) {
    filtered = filtered.filter((item) =>
      item.projectName
        ?.toLowerCase()
        .includes(String(query.projectName).toLowerCase()),
    );
  }

  if (query.factoryName) {
    filtered = filtered.filter(
      (item) =>
        item.factoryName
          ?.toLowerCase()
          .includes(String(query.factoryName).toLowerCase()) ||
        item.factoryCode
          ?.toLowerCase()
          .includes(String(query.factoryName).toLowerCase()),
    );
  }

  if (query.chipMPNIdentifierName) {
    filtered = filtered.filter((item) =>
      item.chipMPNIdentifierName
        ?.toLowerCase()
        .includes(String(query.chipMPNIdentifierName).toLowerCase()),
    );
  }

  // Sorting
  const sortBy = String(query.sortBy || 'createTime');
  const sortOrder = String(query.sortOrder || 'desc');

  filtered.sort((a, b) => {
    let aValue: any = a[sortBy as keyof MaterialRecord];
    let bValue: any = b[sortBy as keyof MaterialRecord];

    // Handle dates
    if (
      sortBy.includes('Time') ||
      sortBy === 'createTime' ||
      sortBy === 'updateTime' ||
      sortBy === 'dataSyncExecutionTime'
    ) {
      aValue = aValue ? new Date(aValue).getTime() : 0;
      bValue = bValue ? new Date(bValue).getTime() : 0;
    }

    // Handle numbers
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    }

    // Handle booleans
    if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
      if (aValue === bValue) {
        return 0;
      }
      return sortOrder === 'asc' ? (aValue ? 1 : -1) : aValue ? -1 : 1;
    }

    // Handle strings
    aValue = String(aValue || '').toLowerCase();
    bValue = String(bValue || '').toLowerCase();

    if (sortOrder === 'asc') {
      return aValue.localeCompare(bValue);
    }
    return bValue.localeCompare(aValue);
  });

  return filtered;
}

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  await sleep(300); // Simulate network delay

  const query = getQuery(event);

  // Normalize pagination parameters
  const pageRaw = Array.isArray(query.page) ? query.page[0] : query.page;
  const pageSizeRaw = Array.isArray(query.pageSize)
    ? query.pageSize[0]
    : query.pageSize;
  const pageNumber = Math.max(
    1,
    Number.parseInt(String(pageRaw ?? '1'), 10) || 1,
  );
  const pageSizeNumber = Math.min(
    100,
    Math.max(1, Number.parseInt(String(pageSizeRaw ?? '10'), 10) || 10),
  );

  // Filter data based on query parameters
  const filteredData = filterMaterialData(MOCK_MATERIAL_DATA, query);

  // Use usePageResponseSuccess to return unified response format
  return usePageResponseSuccess(
    String(pageNumber),
    String(pageSizeNumber),
    filteredData,
  );
});

