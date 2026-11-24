import { processDate } from '@redhat-cloud-services/frontend-components-utilities/helpers';
import type { JSX } from 'react';
import { EmptyAdvisoryList } from '../PresentationalComponents/Snippets/EmptyStates';
import {
  createAdvisoriesRows,
  createSystemAdvisoriesRows,
  createSystemPackagesRows,
  createSystemsRows,
  SystemItemFlat,
  TEmptyRow,
  TRow,
} from './DataMappers';
import { handlePatchLink } from './Helpers';
import { advisoryRows, systemAdvisoryRows, systemPackages, systemRows } from './RawDataForTesting';
import { SystemUpToDate } from '../PresentationalComponents/Snippets/SystemUpToDate';
import messages from '../Messages';
import { intl } from '../Utilities/IntlProvider';
import { SystemItem } from './api/patchApiTypes';

describe('DataMappers', () => {
  it('Should create advisories rows', () => {
    const [firstRow, secondRow] = createAdvisoriesRows(advisoryRows, {}, {}) as TRow[];
    expect(firstRow.id).toEqual(advisoryRows[0].id);
    expect(firstRow.isOpen).toEqual(false);
    expect(firstRow.selected).toEqual(false);
    expect(firstRow.cells[0].title).toEqual(handlePatchLink('advisories', advisoryRows[0].id));
    expect(firstRow.cells[5].title).toEqual(intl.formatMessage(messages.labelsRebootRequired));
    expect(firstRow.cells[6].title).toEqual(processDate(advisoryRows[0].attributes.public_date!));
    expect((firstRow.cells[2].title as JSX.Element).props.type).toEqual(
      advisoryRows[0].attributes.advisory_type_name,
    );
    expect((firstRow.cells[3].title as JSX.Element).props.severity).toEqual(
      advisoryRows[0].attributes.severity,
    );
    expect(firstRow.cells[4].title).toEqual(
      handlePatchLink(
        'advisories',
        advisoryRows[0].id,
        advisoryRows[0].attributes.applicable_systems,
      ),
    );
    expect(firstRow.cells[1]).toBeTruthy();
    const portalAdvisoryLink = secondRow.cells[0].title as JSX.Element;
    expect(portalAdvisoryLink.props.row).toEqual(advisoryRows[0]);
  });

  it('Should createAdvisoriesRows handle empty row data', () => {
    const result = createAdvisoriesRows([], {}, {}) as TEmptyRow[];
    expect(result[0].heightAuto).toBeTruthy();
    expect(result[0].cells[0].props).toEqual({ colSpan: 7 });
    expect((result[0].cells[0].title as JSX.Element).type).toEqual(EmptyAdvisoryList);
  });

  it('Should create System Advisories Rows', () => {
    const [firstRow, secondRow] = createSystemAdvisoriesRows(
      systemAdvisoryRows,
      {},
      {},
      { limit: 20, offset: 0, total_items: 2 },
    ) as TRow[];

    expect(firstRow.id).toEqual(systemAdvisoryRows[0].id);
    expect(firstRow.isOpen).toEqual(false);
    expect(firstRow.selected).toEqual(false);
    expect(firstRow.cells[6].title).toEqual(
      processDate(systemAdvisoryRows[0].attributes.public_date!),
    );
    expect(firstRow.cells[5].title).toEqual('Required');
    expect((firstRow.cells[3].title as JSX.Element).props.type).toEqual(
      systemAdvisoryRows[0].attributes.advisory_type_name,
    );
    expect((firstRow.cells[4].title as JSX.Element).props.severity).toEqual(
      advisoryRows[0].attributes.severity,
    );
    expect(firstRow.cells[1]).toBeTruthy();
    expect(firstRow.cells[0].title).toEqual(
      handlePatchLink('advisories', systemAdvisoryRows[0].id),
    );
    const portalAdvisoryLink = secondRow.cells[0].title as JSX.Element;
    expect(portalAdvisoryLink.props.row).toEqual(systemAdvisoryRows[0]);
  });

  it('Should createSystemAdvisoriesRows handle empty row data and show SystemUpToDate', () => {
    const result = createSystemAdvisoriesRows([], {}, {}, {
      limit: 20,
      offset: 0,
      total_items: 0,
      filter: {},
    }) as TEmptyRow[];
    expect(result[0].heightAuto).toBeTruthy();
    expect(result[0].cells[0].props).toEqual({ colSpan: 7 });
    expect((result[0].cells[0].title as JSX.Element).type).toEqual(SystemUpToDate);
  });

  it('Should createSystemAdvisoriesRows handle empty row data and show EmptyAdvisoryList', () => {
    const result = createSystemAdvisoriesRows([], {}, {}, {
      limit: 20,
      offset: 0,
      total_items: 0,
      search: 'test',
    }) as TEmptyRow[];
    expect(result[0].heightAuto).toBeTruthy();
    expect(result[0].cells[0].props).toEqual({ colSpan: 7 });
    expect((result[0].cells[0].title as JSX.Element).type).toEqual(EmptyAdvisoryList);
  });

  it('Should create system rows', () => {
    const result = createSystemsRows(systemRows, {});
    expect(result[0].id).toEqual(systemRows[0].id);
    expect(result[0].key).toEqual(expect.stringContaining(systemRows[0].id));
    expect(result[0].applicable_advisories).toEqual([
      systemRows[0].rhea_count,
      systemRows[0].rhba_count,
      systemRows[0].rhsa_count,
      systemRows[0].other_count,
    ]);
    expect(result[0].selected).toEqual(false);
  });

  it('Should createSystemRows handle empty data', () => {
    const result = createSystemsRows([], {});
    expect(result).toEqual([]);
  });

  it('Should createSystemRows handle undfined rhea_count, rhba_count, rhsa_count', () => {
    const { rhsa_count, rhba_count, rhea_count, other_count, ...testRow } = systemRows[0];
    const testData = [
      { ...testRow, id: '8ddb54f5-aeeb-49b1-8448-c29049d686c1', display_name: 'automation_host' },
    ] as SystemItemFlat[];
    const result = createSystemsRows(testData);
    expect(result[0].applicable_advisories).toEqual([0, 0, 0, 0]);
  });

  it('Should create package list', () => {
    const packages = createSystemPackagesRows(systemPackages);
    expect(packages).toEqual([
      {
        id: 'test-name-test-evra',
        key: 'test-name-test-evra',
        selected: false,
        disableSelection: true,
        cells: [
          { title: expect.anything() }, // FIXME!
          {
            title: expect.objectContaining({
              props: expect.objectContaining({
                children: expect.arrayContaining(['test\u200B', '.evra']),
              }),
            }),
          },
          {
            title: expect.objectContaining({
              props: expect.objectContaining({
                children: expect.arrayContaining(['test\u200B', '.evra']),
              }),
            }),
          },
          { title: expect.anything() },
          { title: expect.anything() },
          { title: 'Access control list utilities' },
        ],
      },
    ]);

    expect(packages[0]).toMatchSnapshot();

    const packagesWithCompleteData = createSystemPackagesRows([
      {
        ...systemPackages[0],
        updates: [{ evra: 'testEvra', status: 'Installable' }],
        updatable: true,
        update_status: 'Installable',
      },
    ]);

    expect(packagesWithCompleteData).toEqual([
      {
        id: 'test-name-test-evra',
        key: 'test-name-test-evra',
        selected: false,
        disableSelection: false,
        cells: [
          { title: expect.anything() }, // FIXME!
          {
            title: expect.objectContaining({
              props: expect.objectContaining({
                children: expect.arrayContaining(['test\u200B', '.evra']),
              }),
            }),
          },
          {
            title: expect.objectContaining({
              props: expect.objectContaining({
                children: expect.arrayContaining(['testEvra\u200B']),
              }),
            }),
          },
          { title: expect.anything() },
          { title: expect.anything() },
          { title: 'Access control list utilities' },
        ],
      },
    ]);
  });

  it('Should create empty package list', () => {
    const packages = createSystemPackagesRows([]);
    expect(packages).toEqual([
      {
        heightAuto: true,
        cells: [
          {
            props: { colSpan: 7 },
            title: expect.anything(),
          },
        ],
      },
    ]);
  });
});
