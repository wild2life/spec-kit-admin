import type { BOMRecord } from '~/utils/mock-bom-data';

import { eventHandler, readBody } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { MOCK_BOM_DATA } from '~/utils/mock-bom-data';
import { unAuthorizedResponse } from '~/utils/response';

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const body = await readBody(event);
  const {
    selectedColumns,
    exportMode,
    pageSize,
    pageNumber,
    fileName = 'BOM主数据',
    ...searchFilters
  } = body;

  // Filter data based on search filters (reuse logic from list.get.ts)
  let filteredData = [...MOCK_BOM_DATA];

  // Apply search filters (simplified - reuse filterBomData function in real implementation)
  if (searchFilters.bomCode) {
    filteredData = filteredData.filter((item) =>
      item.bomCode?.toLowerCase().includes(String(searchFilters.bomCode).toLowerCase()),
    );
  }

  // Apply pagination if needed
  if (exportMode === 'paginated' && pageSize && pageNumber) {
    const start = (pageNumber - 1) * pageSize;
    const end = start + pageSize;
    filteredData = filteredData.slice(start, end);
  }

  // Filter columns
  const allColumns = [
    'businessUnitCode',
    'businessUnit',
    'supplierCode',
    'supplierName',
    'cheryPartNumber',
    'cheryPartName',
    'bomCode',
    'bomName',
    'supplierParentPartCode',
    'supplierParentPartName',
    'parentPartType',
    'parentPartUnit',
    'childPartCode',
    'childPartName',
    'childPartType',
    'childPartQuantity',
    'childPartUnit',
    'bomVersion',
    'bomChangeTime',
    'createTime',
    'updateTime',
    'categoryCode',
    'categoryName',
    'creatorLoginAccount',
    'dataSource',
    'updaterAccount',
  ];

  const columnsToExport = selectedColumns && selectedColumns.length > 0
    ? selectedColumns
    : allColumns;

  // Generate CSV content
  const headers = columnsToExport.map((col: string) => {
    const headerMap: Record<string, string> = {
      businessUnitCode: '事业部编号',
      businessUnit: '事业部',
      supplierCode: '供应商代码',
      supplierName: '供应商名称',
      cheryPartNumber: '奇瑞零件号',
      cheryPartName: '奇瑞零件名称',
      bomCode: 'BOM编码',
      bomName: 'BOM名称',
      supplierParentPartCode: '供应商父件编码',
      supplierParentPartName: '供应商父件名称',
      parentPartType: '父件类型',
      parentPartUnit: '父件单位',
      childPartCode: '子件编码',
      childPartName: '子件名称',
      childPartType: '子件类型',
      childPartQuantity: '子件用量',
      childPartUnit: '子件单位',
      bomVersion: 'BOM版本',
      bomChangeTime: 'BOM变更时间',
      createTime: '创建时间',
      updateTime: '更新时间',
      categoryCode: '品类编码',
      categoryName: '品类名称',
      creatorLoginAccount: '创建人登录账号',
      dataSource: '数据来源',
      updaterAccount: '更新人账号',
    };
    return headerMap[col] || col;
  });

  const csvRows = [
    headers.join(','),
    ...filteredData.map((record) =>
      columnsToExport
        .map((col: string) => {
          const value = record[col as keyof BOMRecord];
          // Escape commas and quotes in CSV
          if (value === null || value === undefined) return '';
          const str = String(value);
          if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        })
        .join(','),
    ),
  ];

  const csvContent = csvRows.join('\n');
  const buffer = Buffer.from(csvContent, 'utf-8');

  event.node.res.setHeader('Content-Type', 'text/csv;charset=utf-8');
  event.node.res.setHeader(
    'Content-Disposition',
    `attachment; filename="${fileName}.csv"`,
  );

  return buffer;
});

