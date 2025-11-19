import { requestClient } from '#/api/request';

/**
 * Material Master Data Record
 */
export interface MaterialRecord {
  id: string;
  cheryPartNumber: string;
  cheryPartName?: string;
  businessUnitCode?: string;
  businessUnit?: string;
  supplierCode?: string;
  supplierName?: string;
  supplierAssemblyPartNumber?: string;
  supplierAssemblyPartName?: string;
  cheryHardwareVersionNumber?: string;
  cherySoftwareVersionNumber?: string;
  vehicleModel?: string;
  projectName?: string;
  isSOP?: boolean;
  dataSyncExecutionTime?: string; // ISO 8601
  factoryCode?: string;
  factoryName?: string;
  supplierPartVersionNumber?: string;
  chipProcurementType?: string;
  chipMPNIdentifierCode?: string;
  chipMPNIdentifierName?: string;
  dataSource?: string;
  materialValidityPeriodDays?: number;
  type?: string;
  creatorLoginAccount: string;
  createTime: string; // ISO 8601
  updaterAccount?: string;
  updateTime: string; // ISO 8601
}

/**
 * Material List Query Parameters
 */
export interface MaterialListParams {
  page?: number;
  pageSize?: number;
  businessUnit?: string;
  supplier?: string;
  supplierName?: string;
  cheryPartName?: string;
  supplierAssemblyPartName?: string;
  projectName?: string;
  factoryName?: string;
  chipMPNIdentifierName?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Material List Response
 */
export interface MaterialListResponse {
  items: MaterialRecord[];
  total: number;
}

/**
 * Import Result
 */
export interface ImportResult {
  totalRows: number;
  successCount: number;
  failedCount: number;
  duplicateCount: number;
  errors?: Array<{
    rowNumber: number;
    field?: string;
    message: string;
    value?: any;
  }>;
}

/**
 * Export Configuration
 */
export interface ExportConfig {
  selectedColumns: string[];
  exportMode: 'all' | 'paginated';
  pageSize?: number;
  pageNumber?: number;
  fileName?: string;
  // Optional search filters
  businessUnit?: string;
  supplier?: string;
  supplierName?: string;
  cheryPartName?: string;
  supplierAssemblyPartName?: string;
  projectName?: string;
  factoryName?: string;
  chipMPNIdentifierName?: string;
}

/**
 * Delete Parameters
 */
export interface DeleteParams {
  ids: string[];
}

/**
 * Delete Response
 */
export interface DeleteResponse {
  deletedCount: number;
  failedIds?: string[];
}

/**
 * Get Material Master Data List
 */
export async function getMaterialListApi(
  params: MaterialListParams,
): Promise<MaterialListResponse> {
  const response = await requestClient.get<MaterialListResponse>(
    '/manufacture/material/list',
    {
      params,
    },
  );
  return response;
}

/**
 * Import Material Master Data
 */
export async function importMaterialApi(
  file: File,
  overwriteDuplicates = true,
): Promise<ImportResult> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('overwriteDuplicates', String(overwriteDuplicates));

  const response = await requestClient.post<ImportResult>(
    '/manufacture/material/import',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response;
}

/**
 * Export Material Master Data
 */
export async function exportMaterialApi(
  config: ExportConfig,
): Promise<Blob> {
  const response = await requestClient.post<Blob>(
    '/manufacture/material/export',
    config,
    {
      responseType: 'blob',
    },
  );
  return response;
}

/**
 * Delete Material Master Data
 */
export async function deleteMaterialApi(
  params: DeleteParams,
): Promise<DeleteResponse> {
  const response = await requestClient.post<DeleteResponse>(
    '/manufacture/material/delete',
    params,
  );
  return response;
}

/**
 * Download Import Template
 */
export async function downloadTemplateApi(): Promise<Blob> {
  const response = await requestClient.get<Blob>(
    '/manufacture/material/template',
    {
      responseType: 'blob',
    },
  );
  return response;
}

/**
 * Report Parameters
 */
export interface ReportParams {
  recordIds?: string[];
}

/**
 * Report Response
 */
export interface ReportResponse {
  success: boolean;
  reportedCount: number;
  message?: string;
}

/**
 * Report Material Master Data
 */
export async function reportMaterialApi(params?: ReportParams) {
  return requestClient.post<ReportResponse>(
    '/manufacture/material/report',
    params,
  );
}

