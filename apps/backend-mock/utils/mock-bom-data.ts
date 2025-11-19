import { faker } from '@faker-js/faker';

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
  bomChangeTime?: string;
  createTime: string;
  updateTime: string;
  categoryCode?: string;
  categoryName?: string;
  creatorLoginAccount: string;
  dataSource?: string;
  updaterAccount?: string;
}

// Chinese business units and suppliers for realistic data
const BUSINESS_UNITS = [
  { code: 'BU001', name: '乘用车事业部' },
  { code: 'BU002', name: '商用车事业部' },
  { code: 'BU003', name: '新能源事业部' },
  { code: 'BU004', name: '零部件事业部' },
];

const SUPPLIERS = [
  { code: 'SUP001', name: '奇瑞汽车零部件有限公司' },
  { code: 'SUP002', name: '安徽奇瑞科技有限公司' },
  { code: 'SUP003', name: '芜湖奇瑞汽车技术有限公司' },
  { code: 'SUP004', name: '奇瑞新能源技术有限公司' },
  { code: 'SUP005', name: '奇瑞商用车有限公司' },
];

const PART_TYPES = ['标准件', '定制件', '外购件', '自制件'];
const UNITS = ['个', '件', '套', '台', 'kg', 'm'];
const CATEGORIES = [
  { code: 'CAT001', name: '发动机系统' },
  { code: 'CAT002', name: '底盘系统' },
  { code: 'CAT003', name: '车身系统' },
  { code: 'CAT004', name: '电气系统' },
  { code: 'CAT005', name: '内饰系统' },
];

const DATA_SOURCES = ['ERP系统', 'PLM系统', '手工录入', '批量导入'];

/**
 * Generate mock BOM Master Data records
 */
export function generateMockBomData(count: number): BOMRecord[] {
  const dataList: BOMRecord[] = [];
  const now = new Date();
  const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

  for (let i = 0; i < count; i++) {
    const businessUnit = faker.helpers.arrayElement(BUSINESS_UNITS);
    const supplier = faker.helpers.arrayElement(SUPPLIERS);
    const category = faker.helpers.arrayElement(CATEGORIES);
    const bomVersion = `v${faker.number.int({ min: 1, max: 5 })}.${faker.number.int({ min: 0, max: 9 })}`;
    const bomCode = `BOM${String(i + 1).padStart(6, '0')}`;
    const createTime = faker.date.between({ from: oneYearAgo, to: now });
    const updateTime = faker.date.between({ from: createTime, to: now });
    const bomChangeTime = faker.datatype.boolean(0.7)
      ? faker.date.between({ from: createTime, to: now })
      : undefined;

    const dataItem: BOMRecord = {
      id: faker.string.uuid(),
      businessUnitCode: businessUnit.code,
      businessUnit: businessUnit.name,
      supplierCode: supplier.code,
      supplierName: supplier.name,
      cheryPartNumber: `CHERY-${faker.string.alphanumeric(8).toUpperCase()}`,
      cheryPartName: `${faker.commerce.productName()}零件`,
      bomCode,
      bomName: `${faker.commerce.productName()}BOM`,
      supplierParentPartCode: `SUP-${faker.string.alphanumeric(8).toUpperCase()}`,
      supplierParentPartName: `${faker.commerce.productName()}父件`,
      parentPartType: faker.helpers.arrayElement(PART_TYPES),
      parentPartUnit: faker.helpers.arrayElement(UNITS),
      childPartCode: `CHILD-${faker.string.alphanumeric(8).toUpperCase()}`,
      childPartName: `${faker.commerce.productName()}子件`,
      childPartType: faker.helpers.arrayElement(PART_TYPES),
      childPartQuantity: faker.number.float({
        min: 0.1,
        max: 100,
        fractionDigits: 2,
      }),
      childPartUnit: faker.helpers.arrayElement(UNITS),
      bomVersion,
      bomChangeTime: bomChangeTime?.toISOString(),
      createTime: createTime.toISOString(),
      updateTime: updateTime.toISOString(),
      categoryCode: category.code,
      categoryName: category.name,
      creatorLoginAccount: faker.helpers.arrayElement([
        'admin',
        'vben',
        'jack',
      ]),
      dataSource: faker.helpers.arrayElement(DATA_SOURCES),
      updaterAccount: faker.datatype.boolean(0.5)
        ? faker.helpers.arrayElement(['admin', 'vben', 'jack'])
        : undefined,
    };

    dataList.push(dataItem);
  }

  return dataList;
}

// Generate 500 mock records by default
export const MOCK_BOM_DATA = generateMockBomData(500);
