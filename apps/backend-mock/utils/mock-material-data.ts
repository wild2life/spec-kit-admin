import { faker } from '@faker-js/faker';

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
  dataSyncExecutionTime?: string;
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
  createTime: string;
  updaterAccount?: string;
  updateTime: string;
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

const VEHICLE_MODELS = [
  '瑞虎8',
  '艾瑞泽5',
  '瑞虎5x',
  '瑞虎7',
  '艾瑞泽GX',
  '瑞虎3x',
  '星途TX',
  '捷途X70',
];

const PROJECT_NAMES = [
  'T1X项目',
  'M1X项目',
  'A3X项目',
  'T2X项目',
  'M2X项目',
  'A4X项目',
];

const FACTORIES = [
  { code: 'FAC001', name: '芜湖工厂' },
  { code: 'FAC002', name: '大连工厂' },
  { code: 'FAC003', name: '鄂尔多斯工厂' },
  { code: 'FAC004', name: '开封工厂' },
];

const CHIP_PROCUREMENT_TYPES = ['直接采购', '间接采购', '代工采购'];
const MATERIAL_TYPES = ['标准件', '定制件', '外购件', '自制件'];
const DATA_SOURCES = ['ERP系统', 'PLM系统', '手工录入', '批量导入'];

/**
 * Generate mock Material Master Data records
 */
export function generateMockMaterialData(count: number): MaterialRecord[] {
  const dataList: MaterialRecord[] = [];
  const now = new Date();
  const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

  for (let i = 0; i < count; i++) {
    const businessUnit = faker.helpers.arrayElement(BUSINESS_UNITS);
    const supplier = faker.helpers.arrayElement(SUPPLIERS);
    const factory = faker.helpers.arrayElement(FACTORIES);
    const createTime = faker.date.between({ from: oneYearAgo, to: now });
    const updateTime = faker.date.between({ from: createTime, to: now });
    const dataSyncExecutionTime = faker.datatype.boolean(0.7)
      ? faker.date.between({ from: createTime, to: now })
      : undefined;

    const dataItem: MaterialRecord = {
      id: faker.string.uuid(),
      cheryPartNumber: `CHERY-${faker.string.alphanumeric(8).toUpperCase()}`,
      cheryPartName: `${faker.commerce.productName()}零件`,
      businessUnitCode: businessUnit.code,
      businessUnit: businessUnit.name,
      supplierCode: supplier.code,
      supplierName: supplier.name,
      supplierAssemblyPartNumber: `SUP-${faker.string.alphanumeric(8).toUpperCase()}`,
      supplierAssemblyPartName: `${faker.commerce.productName()}总成零件`,
      cheryHardwareVersionNumber: `HW${faker.number.int({ min: 1, max: 5 })}.${faker.number.int({ min: 0, max: 9 })}`,
      cherySoftwareVersionNumber: `SW${faker.number.int({ min: 1, max: 5 })}.${faker.number.int({ min: 0, max: 9 })}`,
      vehicleModel: faker.helpers.arrayElement(VEHICLE_MODELS),
      projectName: faker.helpers.arrayElement(PROJECT_NAMES),
      isSOP: faker.datatype.boolean(0.6),
      dataSyncExecutionTime: dataSyncExecutionTime?.toISOString(),
      factoryCode: factory.code,
      factoryName: factory.name,
      supplierPartVersionNumber: `V${faker.number.int({ min: 1, max: 5 })}.${faker.number.int({ min: 0, max: 9 })}`,
      chipProcurementType: faker.helpers.arrayElement(CHIP_PROCUREMENT_TYPES),
      chipMPNIdentifierCode: `MPN-${faker.string.alphanumeric(10).toUpperCase()}`,
      chipMPNIdentifierName: `${faker.commerce.productName()}芯片`,
      dataSource: faker.helpers.arrayElement(DATA_SOURCES),
      materialValidityPeriodDays: faker.number.int({ min: 30, max: 3650 }),
      type: faker.helpers.arrayElement(MATERIAL_TYPES),
      creatorLoginAccount: faker.helpers.arrayElement(['admin', 'vben', 'jack']),
      createTime: createTime.toISOString(),
      updaterAccount: faker.datatype.boolean(0.5)
        ? faker.helpers.arrayElement(['admin', 'vben', 'jack'])
        : undefined,
      updateTime: updateTime.toISOString(),
    };

    dataList.push(dataItem);
  }

  return dataList;
}

// Generate 500 mock records by default
export const MOCK_MATERIAL_DATA = generateMockMaterialData(500);

