import { eventHandler } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse } from '~/utils/response';

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  // Generate Excel template with headers
  // For now, return a simple CSV template
  const headers = [
    '事业部编号',
    '事业部',
    '供应商代码',
    '供应商名称',
    '奇瑞零件号',
    '奇瑞零件名称',
    'BOM编码',
    'BOM名称',
    '供应商父件编码',
    '供应商父件名称',
    '父件类型',
    '父件单位',
    '子件编码',
    '子件名称',
    '子件类型',
    '子件用量',
    '子件单位',
    'BOM版本',
    'BOM变更时间',
    '品类编码',
    '品类名称',
    '数据来源',
  ];

  const csvContent = headers.join(',') + '\n';
  const buffer = Buffer.from(csvContent, 'utf-8');

  event.node.res.setHeader('Content-Type', 'text/csv;charset=utf-8');
  event.node.res.setHeader(
    'Content-Disposition',
    'attachment; filename="BOM主数据导入模板.csv"',
  );

  return buffer;
});

