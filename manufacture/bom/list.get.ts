import type { BOMRecord } from '~/utils/mock-bom-data';

import { eventHandler, getQuery } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { MOCK_BOM_DATA } from '~/utils/mock-bom-data';
import {
  sleep,
  unAuthorizedResponse,
  usePageResponseSuccess,
} from '~/utils/response';

function filterBomData(
  data: BOMRecord[],
  query: Record<string, any>,
): BOMRecord[] {
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

  if (query.cheryPartNumber) {
    filtered = filtered.filter((item) =>
      item.cheryPartNumber
        ?.toLowerCase()
        .includes(String(query.cheryPartNumber).toLowerCase()),
    );
  }

  if (query.cheryPartName) {
    filtered = filtered.filter((item) =>
      item.cheryPartName
        ?.toLowerCase()
        .includes(String(query.cheryPartName).toLowerCase()),
    );
  }

  if (query.bomCode) {
    filtered = filtered.filter((item) =>
      item.bomCode?.toLowerCase().includes(String(query.bomCode).toLowerCase()),
    );
  }

  if (query.bomName) {
    filtered = filtered.filter((item) =>
      item.bomName?.toLowerCase().includes(String(query.bomName).toLowerCase()),
    );
  }

  if (query.supplierParentPartCode) {
    filtered = filtered.filter((item) =>
      item.supplierParentPartCode
        ?.toLowerCase()
        .includes(String(query.supplierParentPartCode).toLowerCase()),
    );
  }

  if (query.supplierParentPartName) {
    filtered = filtered.filter((item) =>
      item.supplierParentPartName
        ?.toLowerCase()
        .includes(String(query.supplierParentPartName).toLowerCase()),
    );
  }

  if (query.childPartCode) {
    filtered = filtered.filter((item) =>
      item.childPartCode
        ?.toLowerCase()
        .includes(String(query.childPartCode).toLowerCase()),
    );
  }

  if (query.childPartName) {
    filtered = filtered.filter((item) =>
      item.childPartName
        ?.toLowerCase()
        .includes(String(query.childPartName).toLowerCase()),
    );
  }

  if (query.bomVersion) {
    filtered = filtered.filter((item) =>
      item.bomVersion
        ?.toLowerCase()
        .includes(String(query.bomVersion).toLowerCase()),
    );
  }

  if (query.categoryName) {
    filtered = filtered.filter((item) =>
      item.categoryName
        ?.toLowerCase()
        .includes(String(query.categoryName).toLowerCase()),
    );
  }

  // Date range filters
  if (query.bomChangeTimeStart) {
    const startDate = new Date(String(query.bomChangeTimeStart));
    filtered = filtered.filter((item) => {
      if (!item.bomChangeTime) return false;
      return new Date(item.bomChangeTime) >= startDate;
    });
  }

  if (query.bomChangeTimeEnd) {
    const endDate = new Date(String(query.bomChangeTimeEnd));
    filtered = filtered.filter((item) => {
      if (!item.bomChangeTime) return false;
      return new Date(item.bomChangeTime) <= endDate;
    });
  }

  if (query.changeTimeStart) {
    const startDate = new Date(String(query.changeTimeStart));
    filtered = filtered.filter((item) => {
      return new Date(item.updateTime) >= startDate;
    });
  }

  if (query.changeTimeEnd) {
    const endDate = new Date(String(query.changeTimeEnd));
    filtered = filtered.filter((item) => {
      return new Date(item.updateTime) <= endDate;
    });
  }

  // Sorting
  const sortBy = String(query.sortBy || 'createTime');
  const sortOrder = String(query.sortOrder || 'desc');

  filtered.sort((a, b) => {
    let aValue: any = a[sortBy as keyof BOMRecord];
    let bValue: any = b[sortBy as keyof BOMRecord];

    // Handle dates
    if (
      sortBy.includes('Time') ||
      sortBy === 'createTime' ||
      sortBy === 'updateTime'
    ) {
      aValue = aValue ? new Date(aValue).getTime() : 0;
      bValue = bValue ? new Date(bValue).getTime() : 0;
    }

    // Handle numbers
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
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
  const filteredData = filterBomData(MOCK_BOM_DATA, query);

  // Use usePageResponseSuccess to return unified response format
  return usePageResponseSuccess(
    String(pageNumber),
    String(pageSizeNumber),
    filteredData,
  );
});
