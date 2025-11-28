import { requestClient } from '#/api/request';

/**
 * BOM Master Data Record
 */
export interface BOMRecord {
  id: string;
  businessUnitCode: string;
  businessUnit?: string;
  supplierCode?: string;
  supplierName?: string;
  cheryPartNumber?: string;
  cheryPartName?: string;
  bomCode: string;
  bomName?: string;
  supplierParentPartCode?: string;
  supplierParentPartName?: string;
  parentPartType?: string;
  parentPartUnit?: string;
  childPartCode?: string;
  childPartName?: string;
  childPartType?: string;
  childPartQuantity?: number;
  childPartUnit?: string;
  bomVersion: string;
  bomChangeTime?: string; // ISO 8601
  createTime: string; // ISO 8601
  updateTime: string; // ISO 8601
  categoryCode?: string;
  categoryName?: string;
  creatorLoginAccount: string;
  dataSource?: string;
  updaterAccount?: string;
}

/**
 * BOM List Query Parameters
 */
export interface BomListParams {
  page?: number;
  pageSize?: number;
  businessUnit?: string;
  supplier?: string;
  cheryPartNumber?: string;
  cheryPartName?: string;
  bomCode?: string;
  bomName?: string;
  supplierParentPartCode?: string;
  supplierParentPartName?: string;
  childPartCode?: string;
  childPartName?: string;
  bomVersion?: string;
  categoryName?: string;
  bomChangeTime?: any; // Date range picker value (will be converted to start/end)
  bomChangeTimeStart?: string; // ISO 8601
  bomChangeTimeEnd?: string; // ISO 8601
  changeTime?: any; // Date range picker value (will be converted to start/end)
  changeTimeStart?: string; // ISO 8601
  changeTimeEnd?: string; // ISO 8601
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * BOM List Response
 */
export interface BomListResponse {
  items: BOMRecord[];
  total: number;
}

/**
 * Import Result
 */
export interface ImportResult {
  totalRows: number;
  successCount: number;
  errorCount: number;
  duplicateCount: number;
  errors?: Array<{
    field?: string;
    message: string;
    rowNumber: number;
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
  cheryPartNumber?: string;
  cheryPartName?: string;
  bomCode?: string;
  bomName?: string;
  supplierParentPartCode?: string;
  supplierParentPartName?: string;
  childPartCode?: string;
  childPartName?: string;
  bomVersion?: string;
  categoryName?: string;
  bomChangeTimeStart?: string;
  bomChangeTimeEnd?: string;
  changeTimeStart?: string;
  changeTimeEnd?: string;
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
 * Get BOM Master Data List
 */
export async function getBomListApi(params?: BomListParams) {
  return requestClient.get<BomListResponse>('/manufacture/bom/list', {
    params,
  });
}

/**
 * Download Import Template
 */
export async function downloadTemplateApi() {
  return requestClient.get<Blob>('/manufacture/bom/template', {
    responseType: 'blob',
  });
}

/**
 * Import BOM Master Data
 */
export async function importBomApi(file: File, overwriteDuplicates = true) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('overwriteDuplicates', String(overwriteDuplicates));
  return requestClient.post<ImportResult>('/manufacture/bom/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

/**
 * Export BOM Master Data
 */
export async function exportBomApi(config: ExportConfig) {
  return requestClient.post<Blob>('/manufacture/bom/export', config, {
    responseType: 'blob',
  });
}

/**
 * Delete BOM Master Data
 */
export async function deleteBomApi(params: DeleteParams) {
  return requestClient.post<DeleteResponse>('/manufacture/bom/delete', params);
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
 * Report BOM Master Data
 */
export async function reportBomApi(params?: ReportParams) {
  return requestClient.post<ReportResponse>('/manufacture/bom/report', params);
}
