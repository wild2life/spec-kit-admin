import type { MaterialRecord } from '~/utils/mock-material-data';

import { eventHandler, readBody } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { MOCK_MATERIAL_DATA } from '~/utils/mock-material-data';
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
    fileName = '物料主数据',
    ...searchFilters
  } = body;

  // Filter data based on search filters (reuse logic from list.get.ts)
  let filteredData = [...MOCK_MATERIAL_DATA];

  // Apply search filters (simplified - reuse filterMaterialData function in real implementation)
  if (searchFilters.businessUnit) {
    filteredData = filteredData.filter(
      (item) =>
        item.businessUnit
          ?.toLowerCase()
          .includes(String(searchFilters.businessUnit).toLowerCase()) ||
        item.businessUnitCode
          ?.toLowerCase()
          .includes(String(searchFilters.businessUnit).toLowerCase()),
    );
  }

  if (searchFilters.supplier) {
    filteredData = filteredData.filter(
      (item) =>
        item.supplierName
          ?.toLowerCase()
          .includes(String(searchFilters.supplier).toLowerCase()) ||
        item.supplierCode
          ?.toLowerCase()
          .includes(String(searchFilters.supplier).toLowerCase()),
    );
  }

  if (searchFilters.supplierName) {
    filteredData = filteredData.filter((item) =>
      item.supplierName
        ?.toLowerCase()
        .includes(String(searchFilters.supplierName).toLowerCase()),
    );
  }

  if (searchFilters.cheryPartName) {
    filteredData = filteredData.filter((item) =>
      item.cheryPartName
        ?.toLowerCase()
        .includes(String(searchFilters.cheryPartName).toLowerCase()),
    );
  }

  if (searchFilters.supplierAssemblyPartName) {
    filteredData = filteredData.filter((item) =>
      item.supplierAssemblyPartName
        ?.toLowerCase()
        .includes(String(searchFilters.supplierAssemblyPartName).toLowerCase()),
    );
  }

  if (searchFilters.projectName) {
    filteredData = filteredData.filter((item) =>
      item.projectName
        ?.toLowerCase()
        .includes(String(searchFilters.projectName).toLowerCase()),
    );
  }

  if (searchFilters.factoryName) {
    filteredData = filteredData.filter(
      (item) =>
        item.factoryName
          ?.toLowerCase()
          .includes(String(searchFilters.factoryName).toLowerCase()) ||
        item.factoryCode
          ?.toLowerCase()
          .includes(String(searchFilters.factoryName).toLowerCase()),
    );
  }

  if (searchFilters.chipMPNIdentifierName) {
    filteredData = filteredData.filter((item) =>
      item.chipMPNIdentifierName
        ?.toLowerCase()
        .includes(String(searchFilters.chipMPNIdentifierName).toLowerCase()),
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
    'cheryPartNumber',
    'cheryPartName',
    'businessUnitCode',
    'businessUnit',
    'supplierCode',
    'supplierName',
    'supplierAssemblyPartNumber',
    'supplierAssemblyPartName',
    'cheryHardwareVersionNumber',
    'cherySoftwareVersionNumber',
    'vehicleModel',
    'projectName',
    'isSOP',
    'dataSyncExecutionTime',
    'factoryCode',
    'factoryName',
    'supplierPartVersionNumber',
    'chipProcurementType',
    'chipMPNIdentifierCode',
    'chipMPNIdentifierName',
    'dataSource',
    'materialValidityPeriodDays',
    'type',
    'creatorLoginAccount',
    'createTime',
    'updaterAccount',
    'updateTime',
  ];

  const columnsToExport =
    selectedColumns && selectedColumns.length > 0
      ? selectedColumns
      : allColumns;

  // Generate CSV content
  const headers = columnsToExport.map((col: string) => {
    const headerMap: Record<string, string> = {
      cheryPartNumber: '奇瑞零件号',
      cheryPartName: '奇瑞零件名称',
      businessUnitCode: '事业部编号',
      businessUnit: '事业部',
      supplierCode: '供应商代码',
      supplierName: '供应商名称',
      supplierAssemblyPartNumber: '供应商总成零件号',
      supplierAssemblyPartName: '供应商总成零件名称',
      cheryHardwareVersionNumber: '奇瑞硬件版本号',
      cherySoftwareVersionNumber: '奇瑞软件版本号',
      vehicleModel: '车型',
      projectName: '项目名称',
      isSOP: '是否SOP',
      dataSyncExecutionTime: '数据同步执行时间',
      factoryCode: '工厂代码',
      factoryName: '工厂名称',
      supplierPartVersionNumber: '供应商零件版本号',
      chipProcurementType: '芯片采购类型',
      chipMPNIdentifierCode: '芯片MPN标识码',
      chipMPNIdentifierName: '芯片MPN标识名称',
      dataSource: '数据来源',
      materialValidityPeriodDays: '物料有效期（天）',
      type: '类型',
      creatorLoginAccount: '创建人登录账号',
      createTime: '创建时间',
      updaterAccount: '更新人账号',
      updateTime: '更新时间',
    };
    return headerMap[col] || col;
  });

  const rows = filteredData.map((item: MaterialRecord) =>
    columnsToExport.map((col: string) => {
      const value = item[col as keyof MaterialRecord];
      if (value === null || value === undefined) {
        return '';
      }
      if (typeof value === 'boolean') {
        return value ? '是' : '否';
      }
      if (value instanceof Date) {
        return value.toISOString();
      }
      // Escape commas and quotes in CSV
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    }),
  );

  const csvContent =
    headers.join(',') + '\n' + rows.map((row) => row.join(',')).join('\n');

  const buffer = Buffer.from(csvContent, 'utf-8');

  event.node.res.setHeader('Content-Type', 'text/csv;charset=utf-8');
  event.node.res.setHeader(
    'Content-Disposition',
    `attachment; filename="${fileName}.csv"`,
  );

  return buffer;
});

