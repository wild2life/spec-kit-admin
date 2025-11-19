import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:factory',
      order: 100,
      title: '生产质量',
    },
    name: 'Manufacture',
    path: '/manufacture',
    children: [
      {
        meta: {
          icon: 'lucide:database',
          title: '生产质量数据',
        },
        name: 'BaseData',
        path: 'baseData',
        children: [
          {
            meta: {
              title: $t('manufacture.bom.title'),
            },
            name: 'SqeSupplierBom',
            path: 'sqe_supplier_bom',
            component: () =>
              import('#/views/manufacture/baseData/sqe-supplier-bom/index.vue'),
          },
          {
            meta: {
              title: $t('manufacture.material.title'),
            },
            name: 'SupplierProMaterialData',
            path: 'supplier_pro_material_data',
            component: () =>
              import(
                '#/views/manufacture/baseData/supplier-pro-material-data/index.vue'
              ),
          },
        ],
      },
    ],
  },
];

export default routes;
