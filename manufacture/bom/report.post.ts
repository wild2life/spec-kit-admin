import { eventHandler, readBody } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { MOCK_BOM_DATA } from '~/utils/mock-bom-data';
import { unAuthorizedResponse, useResponseSuccess } from '~/utils/response';

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const body = await readBody(event);
  const { recordIds } = body;

  // In a real implementation, we would:
  // 1. Validate that all record IDs exist (if provided)
  // 2. Check permissions
  // 3. Submit data to external reporting system
  // 4. Handle response from external system
  // 5. Return success/failure status

  // Mock report - determine which records to report
  let recordsToReport: typeof MOCK_BOM_DATA;
  if (recordIds && Array.isArray(recordIds) && recordIds.length > 0) {
    // Report specific records
    recordsToReport = MOCK_BOM_DATA.filter((record) =>
      recordIds.includes(record.id),
    );
  } else {
    // Report all records (in real implementation, this would be all visible/filtered records)
    recordsToReport = MOCK_BOM_DATA;
  }

  const reportedCount = recordsToReport.length;

  // Simulate external system submission
  // In a real implementation, this would be an actual API call to external system
  const success = reportedCount > 0;

  // Simulate occasional failures (2% failure rate)
  const shouldFail = Math.random() < 0.02;
  if (shouldFail) {
    return {
      code: 500,
      message: 'Failed to submit data to external reporting system',
      data: null,
      error: {
        code: 'REPORT_FAILED',
        message: 'External system is temporarily unavailable',
      },
    };
  }

  return useResponseSuccess({
    success,
    reportedCount,
    message: success
      ? `Successfully reported ${reportedCount} record(s)`
      : 'No records to report',
  });
});
