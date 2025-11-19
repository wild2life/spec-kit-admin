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
    '奇瑞零件号',
    '奇瑞零件名称',
    '事业部编号',
    '事业部',
    '供应商代码',
    '供应商名称',
    '供应商总成零件号',
    '供应商总成零件名称',
    '奇瑞硬件版本号',
    '奇瑞软件版本号',
    '车型',
    '项目名称',
    '是否SOP',
    '数据同步执行时间',
    '工厂代码',
    '工厂名称',
    '供应商零件版本号',
    '芯片采购类型',
    '芯片MPN标识码',
    '芯片MPN标识名称',
    '数据来源',
    '物料有效期（天）',
    '类型',
  ];

  const csvContent = headers.join(',') + '\n';
  const buffer = Buffer.from(csvContent, 'utf-8');

  event.node.res.setHeader('Content-Type', 'text/csv;charset=utf-8');
  event.node.res.setHeader(
    'Content-Disposition',
    'attachment; filename="物料主数据导入模板.csv"',
  );

  return buffer;
});

