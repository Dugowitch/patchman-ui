import { IFormatter, ITransform, SortByDirection } from '@patternfly/react-table';
import staleFilter from '../PresentationalComponents/Filters/SystemStaleFilter';
import systemsUpdatableFilter from '../PresentationalComponents/Filters/SystemsUpdatableFilter';
import systemsWorkloadFilter from '../PresentationalComponents/Filters/WorkloadFilter';
import { defaultCompoundSortValues } from './constants';
import { ReactNode } from 'react';

export interface InventoryWorkloads {
  sap_system?: boolean;
  sap_sids?: string[];
  ansible?: boolean | { controller_version: string };
  mssql?: boolean | { version: string };
  crowdstrike?: boolean;
  ibm_db2?: boolean;
  intersystems?: boolean;
  oracle_db?: boolean;
  rhel_ai?: boolean;
  satellite?: boolean;
}

export const workloadToSystemInventory = (
  workloads: string[] = [],
): InventoryWorkloads => ({
  ...(workloads.includes('sap') && { sap_system: true }),
  ...(workloads.includes('ansible') && { ansible: { controller_version: 'not_nil' } }),
  ...(workloads.includes('mssql') && { mssql: { version: 'not_nil' } }),
  ...(workloads.includes('crowdstrike') && { crowdstrike: true }),
  ...(workloads.includes('ibm_db2') && { ibm_db2: true }),
  ...(workloads.includes('intersystems') && { intersystems: true }),
  ...(workloads.includes('oracle_db') && { oracle_db: true }),
  ...(workloads.includes('rhel_ai') && { rhel_ai: true }),
  ...(workloads.includes('satellite') && { satellite: true }),
});

export const buildFilterConfig = (filter, apply) => ({
  items: [
    staleFilter(apply, filter),
    systemsUpdatableFilter(apply, filter),
    systemsWorkloadFilter(apply, filter),
  ],
});

export interface ColumnDefinition {
  key: string;
  title?: string;
  cellFormatters?: IFormatter[];
  transforms?: ITransform[];
  renderFunc?: (...args: unknown[]) => ReactNode;
  props?: unknown;
  inventoryKey?: string;
  sortKey?: string;
}

export const mergeInventoryColumns = (
  patchmanColumns: ColumnDefinition[],
  inventoryColumns: ColumnDefinition[],
): ColumnDefinition[] =>
  patchmanColumns.map((column) => ({
    ...inventoryColumns.find(
      (inventoryColumn) => inventoryColumn.key === (column.inventoryKey ?? column.key),
    ),
    ...column,
  }));

export const createSystemsSortBy = (
  orderBy: string,
  orderDirection: SortByDirection,
  hasLastUpload?: boolean,
): string => {
  if (orderBy === 'updated') {
    if (!hasLastUpload) {
      orderBy = 'last_upload';
    } else {
      orderBy = 'os';
    }
  } else if (orderBy === 'group_name') {
    orderBy = 'groups'; // patch API service uses 'groups' instead of 'group_name' sort parameter
  }

  let sort = `${orderDirection === SortByDirection.asc ? '' : '-'}${orderBy}`;

  // if orderBy is for a compound column reset sort value to relative compound sort value
  Object.keys(defaultCompoundSortValues).forEach((col) => {
    if (col === orderBy) {
      sort = defaultCompoundSortValues[col]![orderDirection];
    }
  });

  return sort;
};

export type OSFilter__InventoryTable = Record<string, Record<string, boolean>>

export const osFilterReduction = (osFilter: OSFilter__InventoryTable, os: string): OSFilter__InventoryTable => {
  const [osName, osVersion] = os.split(' ');
  const [major] = osVersion.split('.');

  return {
    ...osFilter,
    [`${osName}-${major}`]: {
      ...(osFilter[`${osName}-${major}`] || {}),
      [`${osName}-${major}-${osVersion}`]: true,
    },
  };
}

export const osParamParser = (paramValue: string): OSFilter__InventoryTable =>
  paramValue
    .replace('in:', '')
    .split(',')
    .reduce(osFilterReduction, {});
