import { renderHook } from '@testing-library/react';
import { SortByDirection } from '@patternfly/react-table';
import {
  buildFilterConfig,
  createSystemsSortBy,
  mergeInventoryColumns,
  workloadToSystemInventory,
} from './SystemsHelpers';
import { SBool } from './constants';

describe('createSystemsSortBy,', () => {
  it('should translate main parameters', () => {
    expect(createSystemsSortBy('abc', SortByDirection.asc, undefined)).toEqual('abc');
    expect(createSystemsSortBy('abc', SortByDirection.desc, undefined)).toEqual('-abc');
  });

  it('should translate group name parameter', () => {
    expect(createSystemsSortBy('group_name', SortByDirection.asc, undefined)).toEqual('groups');
    expect(createSystemsSortBy('group_name', SortByDirection.desc, undefined)).toEqual('-groups');
  });

  it('should translate updated parameter', () => {
    expect(createSystemsSortBy('updated', SortByDirection.asc, false)).toEqual('last_upload');
    expect(createSystemsSortBy('updated', SortByDirection.desc, false)).toEqual('-last_upload');
  });

  it('should translate updated parameter while having last upload', () => {
    expect(createSystemsSortBy('updated', SortByDirection.asc, true)).toEqual('os');
    expect(createSystemsSortBy('updated', SortByDirection.desc, true)).toEqual('-os');
  });
});

describe('mergeInventoryColumns', () => {
  it('should merge basic columns correctly', () => {
    const patchColumns = [
      {
        key: 'display_name',
      },
      {
        key: 'package_count',
        title: 'Package count',
      },
    ];

    const inventoryColumns = [
      {
        key: 'display_name',
        title: 'Display name',
      },
    ];

    expect(mergeInventoryColumns(patchColumns, inventoryColumns)).toMatchObject([
      {
        key: 'display_name',
        title: 'Display name',
      },
      {
        key: 'package_count',
        title: 'Package count',
      },
    ]);
  });

  it('should merge modified columns correctly', () => {
    const patchColumns = [
      {
        key: 'display_name',
        title: 'Name',
      },
      {
        key: 'package_count',
        title: 'Package count',
      },
    ];

    const inventoryColumns = [
      {
        key: 'display_name',
        title: 'Display name',
      },
    ];

    expect(mergeInventoryColumns(patchColumns, inventoryColumns)).toMatchObject([
      {
        key: 'display_name',
        title: 'Name',
      },
      {
        key: 'package_count',
        title: 'Package count',
      },
    ]);
  });

  it('should merge renamed columns correctly', () => {
    const patchColumns = [
      {
        inventoryKey: 'display_name',
        key: 'name',
      },
      {
        key: 'package_count',
        title: 'Package count',
      },
    ];

    const inventoryColumns = [
      {
        key: 'display_name',
        title: 'Display name',
      },
    ];

    expect(mergeInventoryColumns(patchColumns, inventoryColumns)).toMatchObject([
      {
        key: 'name',
        title: 'Display name',
      },
      {
        key: 'package_count',
        title: 'Package count',
      },
    ]);
  });
});

describe('workloadToSystemInventory', () => {
  it('should return empty object for empty workloads', () => {
    expect(workloadToSystemInventory([])).toEqual({});
  });

  it('should map sap to sap_system', () => {
    expect(workloadToSystemInventory(['sap'])).toEqual({ sap_system: true });
  });

  it('should map ansible to ansible controller_version', () => {
    expect(workloadToSystemInventory(['ansible'])).toEqual({
      ansible: { controller_version: 'not_nil' },
    });
  });

  it('should map mssql to mssql version', () => {
    expect(workloadToSystemInventory(['mssql'])).toEqual({
      mssql: { version: 'not_nil' },
    });
  });

  it('should map crowdstrike', () => {
    expect(workloadToSystemInventory(['crowdstrike'])).toEqual({ crowdstrike: true });
  });

  it('should map ibm_db2', () => {
    expect(workloadToSystemInventory(['ibm_db2'])).toEqual({ ibm_db2: true });
  });

  it('should map intersystems', () => {
    expect(workloadToSystemInventory(['intersystems'])).toEqual({ intersystems: true });
  });

  it('should map oracle_db', () => {
    expect(workloadToSystemInventory(['oracle_db'])).toEqual({ oracle_db: true });
  });

  it('should map rhel_ai', () => {
    expect(workloadToSystemInventory(['rhel_ai'])).toEqual({ rhel_ai: true });
  });

  it('should map multiple workloads at once', () => {
    expect(workloadToSystemInventory(['sap', 'ansible', 'mssql', 'crowdstrike'])).toEqual({
      sap_system: true,
      ansible: { controller_version: 'not_nil' },
      mssql: { version: 'not_nil' },
      crowdstrike: true,
    });
  });
});

describe('buildFilterConfig', () => {
  it('should return filter items for status, patch status, and workload', () => {
    const apply = jest.fn();
    const filter = { stale: [SBool.true, SBool.false] };

    const { result } = renderHook(() => buildFilterConfig(filter, apply));
    expect(result.current.items).toHaveLength(3);
    expect(result.current.items[0]).toMatchObject({
      label: 'Status',
      type: 'singleSelect',
    });
    expect(result.current.items[1]).toMatchObject({
      label: 'Patch status',
      type: 'singleSelect',
    });
    expect(result.current.items[2]).toMatchObject({
      label: 'Workload',
      type: 'checkbox',
    });
  });
});
