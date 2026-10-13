import React, { Dispatch, JSX, ReactNode, SetStateAction } from 'react';
import { Flex, FlexItem, Tooltip } from '@patternfly/react-core';
import {
  BugIcon,
  EnhancementIcon,
  FlagIcon,
  LockIcon,
  SecurityIcon,
} from '@patternfly/react-icons';
import { ISortBy, SortByDirection } from '@patternfly/react-table';
import findIndex from 'lodash/findIndex';
import pickBy from 'lodash/pickBy';
import qs from 'query-string';
import LinesEllipsis from 'react-lines-ellipsis';
import messages from '../Messages';
import AdvisoriesIcon from '../PresentationalComponents/Snippets/AdvisoriesIcon';
import {
  defaultCompoundSortValues,
  emptyDefaultFilters,
  filterCategories,
  multiValueFilters,
  SEVERITY_NONE,
  SEVERITY_CRITICAL,
  SEVERITY_IMPORTANT,
  SEVERITY_MINOR,
  SEVERITY_MODERATE,
  AdvisoryStatus,
  Severity,
  CompoundSortOptions,
  UpdateStatus,
  SelectedRows,
  FilterEntries,
  FilterValue,
  FilterValue2,
  Filter,
  BaseQueryParams,
  SystemPaginationQueryParams,
  DefaultPaginationQueryParams,
  AdditionalQueryParams,
  FilterCategory,
} from './constants';
import { intl } from './IntlProvider';
import { generateFilter } from '@redhat-cloud-services/frontend-components-utilities/helpers';
import { InsightsLink } from '@redhat-cloud-services/frontend-components/InsightsLink';
import { ColumnDefinition, OSFilter__InventoryTable, InventoryWorkloads } from './SystemsHelpers';
import { CvesRows, SystemOS } from './DataMappers';
import { PackageSystemItem, PackageSystemsResponse } from './api/patchApiTypes';

export const removeUndefinedObjectItems = <T,>(originalObject: T): T => {
  const newObject = JSON.parse(JSON.stringify(originalObject));
  Object.keys(newObject).forEach((key) => newObject[key] === undefined && delete newObject[key]);
  return newObject;
};

export const convertLimitOffset = (limit: number, offset: number): [number, number] => [
  offset / limit + 1,
  limit,
];

export const createSortBy = (
  header: ColumnDefinition[] | undefined,
  values: string[] | undefined,
  offset: number,
  compoundSortValues: CompoundSortOptions = defaultCompoundSortValues,
): ISortBy => {
  if (!values) {
    return {};
  }

  let [column] = values;
  let multiple = values.join();
  let direction = column[0] === '-' ? SortByDirection.desc : SortByDirection.asc;
  Object.keys(compoundSortValues).forEach((col) => {
    Object.keys(compoundSortValues[col]).forEach((dir) => {
      if (compoundSortValues[col][dir] === multiple) {
        column = col;
        direction = dir as SortByDirection;
      }
    });
  });

  column = column.replace(/^(-|\+)/, '');
  const index = findIndex(header, (item) => item.key === column);
  let sort = {
    index: index + offset,
    direction,
  };
  return sort;
};

export const addOrRemoveItemFromSet = <T,>(
  targetObj: Record<string, T>,
  inputArr: Array<{ rowId: string; value: T | false }>,
): Record<string, T> => {
  const result = { ...targetObj }
  for (const {rowId, value} of inputArr) {
    if (value) {
      result[rowId] = value
      continue
    }
    delete result[rowId]
  }
  return result;
};

export type SelectedItems = Array<{ id: string; selected: boolean | string }>;
export const getNewSelectedItems = (selectedItems: SelectedItems, currentItems: SelectedRows): SelectedRows => {
  let payload = ([] as SelectedItems)
    .concat(selectedItems)
    .map((item) => ({ rowId: item.id, value: item.selected }));
  const mergedSelection = addOrRemoveItemFromSet(currentItems, payload);

  return pickBy(mergedSelection, (v) => !!v);
};

// for expandable rows only
export const getRowIdByIndexExpandable = (
  arrayOfObjects: Array<{ id: string }>,
  index: number,
): string => arrayOfObjects[index / 2].id;

export const getOffsetFromPageLimit = (page: number, limit: number): number => page * limit - limit;

export const truncate = (str: string, max: number, end: ReactNode): ReactNode =>
  str.length > max ? (
    <>
      {str.substring(0, max - 1)}
      ...&nbsp;{end}
    </>
  ) : (
    str
  );

const findBullets = (description: string): string => {
  let substringIndex = description.search(/:/);
  // + 2 accounts for the 2 new lines to separate the sentence from the start of the bullets
  return substringIndex > 0
    ? description.slice(0, substringIndex + 2) +
        preserveNewlines(description.substring(substringIndex + 2))
    : description;
};

export const truncateDescription = (
  description: string,
  wordLength: number,
  setWordLength: Dispatch<SetStateAction<number>>,
): ReactNode =>
  truncate(
    findBullets(description),
    wordLength,
    <a onClick={() => setWordLength(description.length)}>
      {intl.formatMessage(messages.linksReadMore)}
    </a>,
  );

export const createAdvisoriesIcons = (
  [rhea, rhba, rhsa, other]: number[],
  status: AdvisoryStatus = 'Applicable',
): JSX.Element => (
  <Flex style={{ flexWrap: 'nowrap' }}>
    {[rhea, rhba, rhsa].every((item) => item === 0) && `No ${status.toLowerCase()} advisories`}
    {rhsa !== 0 && (
      <FlexItem spacer={{ default: 'spacerXs' }}>
        <AdvisoriesIcon tooltipText='Security advisories' count={rhsa} Icon={SecurityIcon} />
      </FlexItem>
    )}
    {rhba !== 0 && (
      <FlexItem spacer={{ default: 'spacerXs' }}>
        <AdvisoriesIcon tooltipText='Bug fixes' count={rhba} Icon={BugIcon} />
      </FlexItem>
    )}
    {rhea !== 0 && (
      <FlexItem spacer={{ default: 'spacerXs' }}>
        <AdvisoriesIcon tooltipText='Enhancements' count={rhea} Icon={EnhancementIcon} />
      </FlexItem>
    )}
    {other !== 0 && (
      <FlexItem spacer={{ default: 'spacerXs' }}>
        <AdvisoriesIcon tooltipText='Other' count={other} Icon={FlagIcon} />
      </FlexItem>
    )}
  </Flex>
);

export const createUpgradableColumn = (updatableStatus: UpdateStatus): string => {
  switch (updatableStatus) {
    case 'None':
      return intl.formatMessage(messages.labelsColumnsUpToApplicable);
    case 'Applicable':
      return intl.formatMessage(messages.labelsColumnsUpToInstallable);
    case 'Installable':
      return intl.formatMessage(messages.labelsColumnsUpgradable);
  }
};

/**
 * Inserts zero-width breakable spaces to correctly break EVRA.
 */
export const wrappableEVRA = (evra: string = ''): JSX.Element => {
  const [ev, ra] = evra.split('-');
  let [e, v]: (string | undefined)[] = ev.split(':');
  if (v === undefined) {
    v = e;
    e = undefined;
  }
  const raParts = (ra ?? '').split('.');
  const a = raParts.pop();
  const r = raParts.join('.');
  return (
    <span style={{ overflowWrap: 'anywhere' }}>
      {e && `${e}:\u200B`}
      {v + '\u200B'}
      {r && `-${r}\u200B`}
      {a && `.${a}`}
    </span>
  );
};

export const getSeverityByCveImpact = (impact: string | null | undefined): Severity => {
  switch (impact) {
    case 'None':
      return SEVERITY_NONE;
    case 'Low':
      return SEVERITY_MINOR;
    case 'Moderate':
      return SEVERITY_MODERATE;
    case 'Important':
      return SEVERITY_IMPORTANT;
    case 'Critical':
      return SEVERITY_CRITICAL;
    default: // null, undefined
      return SEVERITY_NONE;
  }
};

export const createPackagesColumn = (packageCount: number, systemID: string): JSX.Element => (
  <InsightsLink
    to={{
      pathname: `/systems/${systemID}`,
      // @ts-expect-error InsightsLink type definition is incomplete
      state: { tab: 'packages' },
    }}
  >
    {packageCount}
  </InsightsLink>
);

interface WindowLike {
  location?: Pick<Location, 'href'>;
}

export const handlePatchLink = (type: 'advisories' | 'packages', name: string, body?: ReactNode, windowLike?: WindowLike): JSX.Element => {
  const loc = windowLike?.location ?? (typeof location !== 'undefined' ? location : { href: '' });
  if (loc.href.indexOf('inventory') === -1) {
    // @ts-expect-error InsightsLink type definition is incomplete
    return <InsightsLink to={`/${type}/${name}`}>{body === undefined ? name : body}</InsightsLink>;
  }
  return <a href={`${document.baseURI}insights/patch/${type}/${name}`}>{body || name}</a>;
}

export const arrayFromObj = <T,>(items: { [s: string]: T } | ArrayLike<T>): T[] =>
  Object.values(items).filter((value) => value);

export interface RemediationsIssues {
  issues: Array<{ id: string; description: string }>;
  systems: string[];
}
export const remediationProvider = (
  issues: string | string[],
  systems: string | string[],
  remediationIdentifier: string,
): RemediationsIssues | false => {
  issues = ([] as string[]).concat(issues);
  systems = ([] as string[]).concat(systems);
  return issues.length && systems.length
    ? {
        issues: issues.map((item) => ({
          id: `${remediationIdentifier}:${item}`,
          description: item,
        })),
        systems,
      }
    : false;
};

export const remediationProviderWithPairs = (
  issuePairs: string[],
  transformFunc: (x: string[], y: string) => RemediationsIssues,
  remediationIdentifier: string,
): RemediationsIssues | false =>
  issuePairs ? transformFunc(issuePairs, remediationIdentifier) : false;

export const getFilterValue = (
  category: string,
  val: FilterValue,
  shouldTranslateKeys?: boolean
): FilterValue => {
  if (!shouldTranslateKeys) {
    return val
  }

  const filterCategory: FilterCategory | undefined = filterCategories[category];
  if (!filterCategory || !filterCategory.values) {
    return val;
  }

  const filterOption = filterCategory.values.find((item) => item.value === val);
  if (filterOption !== undefined && filterOption.apiValue !== undefined) {
    return filterOption.apiValue
  }

  return val;
};

// Array#toString / String(array) turns null into '', so keep the API literal "null"
const getFilterStringFromApi = (value: any): string =>
  value === null ? 'null' : String(value);

const calculateWorkloads = (systemProfile: InventoryWorkloads): string => {
  let result = '';
  Object.entries(generateFilter({ system_profile: systemProfile })).forEach(
    ([key, value]) => (result = `${result}&${key}=${value}`),
  );
  return result;
};

export interface URLParams extends BaseQueryParams, AdditionalQueryParams, DefaultPaginationQueryParams {
  id?: string;
  group_name?: string;
  package_name?: string
}

export const encodeParams = (parameters: URLParams, shouldTranslateKeys: boolean): string => {
  const flattenFilters = (
    filter: FilterEntries | undefined,
    shouldTranslateKeys: boolean,
  ): Record<string, string> => {
    let result = {};
    filter &&
      Object.entries(filter).forEach(([key, value]) => {
        value = getFilterValue(key, value, shouldTranslateKeys);
        const operator =
          ([] as FilterValue2).concat(value).length > 1 || multiValueFilters.includes(key) ? 'in:' : '';
        const serializedValue = Array.isArray(value)
          ? value.map(getFilterStringFromApi).join(',')
          : getFilterStringFromApi(value);
        result = {
          ...result,
          [`filter[${key}]`]: `${operator}${serializedValue}`,
        };
      });
    return result;
  };

  let { filter, systemProfile = {}, group_name, ...allParams } = parameters;

  allParams = {
    ...allParams,
    ...flattenFilters({ ...filter, ...(group_name ? { group_name } : {}) }, shouldTranslateKeys),
  };
  let params: string[] = [];
  Object.keys(allParams).forEach((key) => {
    const argKey = encodeURIComponent(key);
    const argValue = encodeURIComponent(allParams[key]);

    if (
      !['', undefined, null].some((value) =>
        ([argValue, key] as Array<string | null | undefined>).includes(value),
      )
    ) {
      if (!['selectedTags', 'systemProfile'].includes(key)) {
        params.push(argKey.concat('=').concat(argValue));
      } else if (key === 'selectedTags' && allParams[key]) {
        params.push.apply(params, allParams[key]);
      }
    }
  });

  const workloadsFilter =
    (Object.keys(systemProfile).length > 0 && calculateWorkloads(systemProfile)) || '';

  return '?'.concat(params.join('&')).concat(workloadsFilter);
};

export const encodeApiParams = (parameters: URLParams): string => encodeParams(parameters, true);

export const encodeURLParams = (parameters: URLParams): string => {
  delete parameters.id;
  let urlParams = { ...parameters };
  delete urlParams.selectedTags;
  return encodeParams(removeUndefinedObjectItems(urlParams), false);
};

export const decomposeFilterValue = <T, >(filterValue: T, parser: ((x: T) => any) | undefined): any => {
  if (parser) {
    return parser(filterValue);
  } else if (typeof filterValue === 'string' && filterValue.startsWith('in:')) {
    const values = filterValue.slice(3);
    return values.split(',');
  } else {
    return filterValue;
  }
};

const getApiValueFromFilterString = (value: unknown) => {
  if (Array.isArray(value)) {
    return value.map(getApiValueFromFilterString);
  }

  return value === 'null' ? null : value;
};

export const decodeQueryparams = (queryString: string, parsers: Record<string, (x: unknown) => any> = {}): Partial<BaseQueryParams & (DefaultPaginationQueryParams | SystemPaginationQueryParams)> => {
  const parsed = qs.parse(queryString);
  const res = {};
  for (const key in parsed){
    if (key.startsWith('filter[system_profile]')) {
      continue
    }

    const convertedToInt = parseInt(String(parsed[key]), 10);
    const typeHandledParam = isNaN(convertedToInt) ? parsed[key] : convertedToInt;

    const bracketIndex = key.search(/\[.*\]/);
    if (bracketIndex <= 0) {
      res[key] = typeHandledParam;
      continue
    }

    const objParent = key.slice(0, bracketIndex);
    const objKey = key.slice(bracketIndex + 1, -1);
    const parser = parsers[objKey];
    const decomposedValue = decomposeFilterValue(typeHandledParam, parser);
    const normalizedValue =
      objParent === 'filter' ? getApiValueFromFilterString(decomposedValue) : decomposedValue;
    res[objParent] = {
      ...res[objParent],
      [objKey]: normalizedValue,
    };
  }
  return res;
};

const compareNormalizedValues = (left: any, right: any): number =>
  getFilterStringFromApi(left).localeCompare(getFilterStringFromApi(right));

const normalizeFilterComparisonValue = (category: string, value: unknown) => {
  if (Array.isArray(value)) {
    return [...value]
      .map((item) => normalizeFilterComparisonValue(category, item))
      .sort(compareNormalizedValues);
  }

  if (multiValueFilters.includes(category) && typeof value === 'string') {
    return value.split(',').sort(compareNormalizedValues);
  }

  return value;
};

const areFilterValuesEqual = (category: string, currentValue: FilterValue, defaultValue: FilterValue): boolean =>
  JSON.stringify(normalizeFilterComparisonValue(category, currentValue)) ===
  JSON.stringify(normalizeFilterComparisonValue(category, defaultValue));

const sanitizeFilterState = (filters: FilterEntries = {}): FilterEntries =>
  Object.entries(filters).reduce((activeFilters: FilterEntries, [category, value]) => {
    if (value !== undefined && value !== '' && ([] as FilterValue2).concat(value).length !== 0) {
      activeFilters[category] = value;
    }

    return activeFilters;
  }, {});

const hasActiveNestedFilterValue = (value: any): boolean => {
  if (Array.isArray(value)) {
    return value.some(hasActiveNestedFilterValue);
  }

  if (value && typeof value === 'object') {
    return Object.values(value).some(hasActiveNestedFilterValue);
  }

  return ![undefined, null, '', false].includes(value);
};

export const getDefaultFilterState = (defaultFilters: Filter = emptyDefaultFilters): Required<Filter> => ({
  filter: sanitizeFilterState(defaultFilters?.filter ?? {}),
  search: defaultFilters.search ?? '',
});

export const hasActiveInventoryFilters = (filters: Record<string, unknown> = {}) => hasActiveNestedFilterValue(filters);

export const hasDefaultFilterState = (defaultFilters: Filter = emptyDefaultFilters): boolean => {
  const { filter, search } = getDefaultFilterState(defaultFilters);

  return Object.keys(filter).length > 0 || search !== '';
};

export const getActiveFilterState = (
  filters: FilterEntries = {},
  search: string = '',
  defaultFilters: Filter = emptyDefaultFilters,
): Required<Filter> & {hasDefaultFilterState: boolean} => {
  const sanitizedFilters = sanitizeFilterState(filters);
  const { filter: defaultFilter, search: defaultSearch } = getDefaultFilterState(defaultFilters);

  const activeFilters = Object.keys(sanitizedFilters).reduce((currentFilters: FilterEntries, category: string) => {
    const currentValue = sanitizedFilters[category];
    const defaultValue = defaultFilter[category];

    if (!areFilterValuesEqual(category, currentValue, defaultValue)) {
      currentFilters[category] = currentValue;
    }

    return currentFilters;
  }, {});

  return {
    filter: activeFilters,
    hasDefaultFilterState: hasDefaultFilterState(defaultFilters),
    search: (search ?? '') === defaultSearch ? '' : search,
  };
};

export const buildFilterChips = (filters, search, searchChipLabel = 'Search', parsers = {}) => {
  let filterConfig = [];
  const buildChips = (filters, category) => {
    if (parsers[category]) {
      return parsers[category](filters[category]);
    } else if (multiValueFilters.includes(category)) {
      const filterValues =
        (filters[category] &&
          ((typeof filters[category] === 'string' && filters[category].split(',')) ||
            filters[category])) ||
        [];
      // Leave the raw value intact (including `null`) so chips render and removal logic works
      return filterValues.map((value) => ({
        name: value,
        id: category,
        value,
      }));
    } else {
      const { values } = filterCategories[category];

      // Previously we dropped truthy-but-falsy values like `null`, which hid the severity chip
      if (filters[category] === undefined || filters[category] === '') {
        return [];
      }

      return [].concat(filters[category]).map((filterValue) => {
        const match = values.find(
          (item) => getFilterStringFromApi(item.value) === getFilterStringFromApi(filterValue),
        );
        return {
          name: match.label,
          value: filterValue,
          id: match.value,
        };
      });
    }
  };

  const processFilters = () => {
    let categories = Object.keys(filters).filter(
      (item) => filters[item] !== '' && [].concat(filters[item]).length !== 0,
    );
    filterConfig = filterConfig.concat(
      categories.map((category) => ({
        category: filterCategories[category].label,
        id: category,
        chips: buildChips(filters, category),
      })),
    );
  };

  const processSearch = () => {
    filterConfig = filterConfig.concat([
      {
        category: searchChipLabel,
        id: 'search',
        chips: [
          {
            name: search,
            value: search,
          },
        ],
      },
    ]);
  };

  filters && processFilters();
  search && processSearch();

  return filterConfig;
};

export const buildActiveFilterConfig = (
  filters: FilterEntries,
  search: string,
  deleteFilters: (...args: unknown[]) => void,
  deleteFilterGroup: (...args: unknown[]) => void,
  searchChipLabel: string = 'Search',
  defaultFilters: Filter = emptyDefaultFilters,
) => {
  const visibleFilters = sanitizeFilterState(filters);
  const visibleSearch = search ?? '';
  const {
    filter: deviatedFilters,
    hasDefaultFilterState,
    search: deviatedSearch,
  } = getActiveFilterState(filters, search, defaultFilters);
  const hasDeviation = Object.keys(deviatedFilters).length > 0 || Boolean(deviatedSearch);

  return {
    filters: buildFilterChips(visibleFilters, visibleSearch, searchChipLabel),
    onDelete: deleteFilters,
    onDeleteGroup: deleteFilterGroup,
    deleteTitle: intl.formatMessage(
      hasDefaultFilterState ? messages.labelsFiltersReset : messages.labelsFiltersClear,
    ),
    ...(hasDefaultFilterState && { showDeleteButton: hasDeviation }),
  };
};

export interface OSFilter {
  os?: string[];
}

export const buildOsFilter = (osFilter: OSFilter__InventoryTable = {}): OSFilter => {
  const osVersions = Object.entries(osFilter).reduce(
    (acc, [, osGroupValues]) => [
      ...acc,
      ...Object.entries(osGroupValues)
        .filter(([, value]) => value === true)
        .map(([key]) => {
          const keyParts = key.split('-');
          return keyParts.slice(0, keyParts.length - 2) + ' ' + keyParts[keyParts.length - 1];
        }),
    ],
    ([] as string[]),
  );

  return osVersions.length > 0
    ? { os: osVersions }
    : {};
};

interface InventoryFilters {
  hostGroupFilter?: string[]
  osFilter?: OSFilter__InventoryTable 
}

export const buildApiFilters = (patchFilters: FilterEntries, inventoryFilters: InventoryFilters): FilterEntries => ({
  ...patchFilters,
  ...(Array.isArray(inventoryFilters.hostGroupFilter) && inventoryFilters.hostGroupFilter.length > 0
    ? { group_name: inventoryFilters.hostGroupFilter }
    : {}),
  ...buildOsFilter(inventoryFilters?.osFilter),
});

export const changeListParams = (oldParams, newParams) => {
  const newState = { ...oldParams, ...newParams };
  const offsetResetParams = ['filter', 'search', 'limit', 'selectedTags'];
  if (offsetResetParams.some((item) => newParams.hasOwnProperty(item))) {
    newState.offset = 0;
  }

  if (newParams.hasOwnProperty('filter')) {
    newState.filter = { ...oldParams.filter, ...newParams.filter };

    // we need explicitly remove 'undefined' filters for safety
    Object.keys(newState.filter).forEach(
      (key) =>
        (newState.filter[key] === undefined || newState.filter[key] === '') &&
        delete newState.filter[key],
    );
  }

  if (newState.hasOwnProperty('tags')) {
    newState && delete newState.tags;
  }

  return newState;
};

export function subtractDate(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

export function preserveNewlines(input: string): string {
  return input && input.replace(new RegExp('\\n\\n(?=.*[\\n\\n])', 'g'), '\n');
}

export interface CvesWithSortBy {
  sortBy: ISortBy
  sortedCves: CvesRows
}

export function sortCves(cves: CvesRows, index: number, direction: SortByDirection): CvesWithSortBy {
  const sortedCves = cves.sort(({ cells: aCells }, { cells: bCells }) => {
    const aCell = aCells[index].value || aCells[index].title;
    const bCell = bCells[index].value || bCells[index].title;

    const stringA = aCell.toString().toUpperCase();
    const stringB = bCell.toString().toUpperCase();

    return stringA.localeCompare(stringB);
  });

  return {
    sortBy: { index, direction },
    sortedCves: direction === SortByDirection.asc ? sortedCves : sortedCves.reverse(),
  };
}

export const createOSColumn = ({ osName, rhsm }: SystemOS): ReactNode => {
  // replace the last space with nbsp;
  // this assumes the last space in `osName` string separates name from version like "RHEL 9.10" or "CentOS Linux 7.10"
  osName = osName.replace(/ (?!.* )/, '\u00A0');
  return !rhsm ? (
    osName
  ) : (
    <span>
      {osName}
      <Tooltip
        content={intl.formatMessage(messages.textLockVersionTooltip, {
          lockedVersion: rhsm,
        })}
      >
        <span className='pf-v6-u-text-nowrap'>
          {'\u200d'}
          <LockIcon className='pf-v6-u-mx-xs' data-testid='tooltip-target' />
        </span>
      </Tooltip>
    </span>
  );
};

export const removeUndefinedObjectKeys = (selectedRows: SelectedRows): string[] =>
  Object.keys(selectedRows).filter((row) => selectedRows[row]);

export const prepareEntitiesParams = (parameters) => {
  const offset =
    parameters.offset || getOffsetFromPageLimit(parameters.page || 1, parameters.perPage || 20);
  const limit = parameters.limit || parameters.perPage || 20;

  const apiParams = { ...parameters, offset, limit };

  // we need explicitly remove 'undefined' parameters for safety
  return removeUndefinedObjectItems(apiParams);
};

export const filterRemediatableSystems = (result) => ({
  data: result?.data.filter((system) => {
    const {
      packages_installed: installedPckg,
      packages_updatable: updatablePckg,
      rhba_count: rhba,
      rhsa_count: rhsa,
      rhea_count: rhea,
    } = system.attributes || {};

    const isDisabled =
      updatablePckg === 0 || [installedPckg, rhba, rhsa, rhea].every((count) => count === 0);

    return !isDisabled;
  }),
});

export const filterRemediatablePackageSystems = (result: PackageSystemsResponse): Pick<PackageSystemsResponse, 'data'> => ({
  data: result.data.filter((system: PackageSystemItem) => system.updatable),
});

export const persistantParams = (patchParams: SystemPaginationQueryParams & Omit<BaseQueryParams, 'filter'>, decodedParams: Partial<BaseQueryParams & (DefaultPaginationQueryParams | SystemPaginationQueryParams)>): SystemPaginationQueryParams & {
  sortBy?: {key: string, direction: SortByDirection}
} => {
  const persistantParams = { ...patchParams, ...decodedParams };

  if (typeof persistantParams.sort === 'string' && persistantParams.sort.match(/-?groups/)) {
    // "group_name" is the sort key used by Inventory (requires translation between Patch and Inventory)
    persistantParams.sort = persistantParams.sort.replace('groups', 'group_name');
  }

  return {
    page: Number(persistantParams.page || 1),
    perPage: Number(persistantParams.perPage || 20),
    ...(persistantParams.sort && {
      sortBy: {
        key: persistantParams.sort.replace(/^-/, ''),
        direction: persistantParams.sort.match(/^-/) ? SortByDirection.desc : SortByDirection.asc,
      },
    }),
  };
};

export const handleLongSynopsis = (synopsis: string): JSX.Element => (
  <LinesEllipsis text={synopsis} maxLine='1' ellipsis='(...)' trimRight basedOn='letters' />
);

export const isRHAdvisory = (name: string): boolean => /^(RHEA|RHBA|RHSA)/.test(name);

/**
 * Build one `tags=…` query fragment with a single URI encode pass. Inventory / insights-chrome
 * sometimes passes tag strings that are already `tags=` segments or percent-encoded and encoding
 * again turns `%2F` into `%252F` and breaks the patch API.
 */
const buildTagsQuerySegment = (rawTagInput: string): string => {
  if (rawTagInput === undefined || rawTagInput === null) {
    return '';
  }
  let inner = String(rawTagInput).trim();
  if (inner.startsWith('tags=')) {
    inner = inner.slice(5);
  }
  let decoded = inner;
  try {
    decoded = decodeURIComponent(inner);
  } catch {
    decoded = inner;
  }
  return `tags=${encodeURIComponent(decoded)}`;
};

interface TagGroup {
  category?: string | null;
  values: {
    tagKey: string;
    value?: string;
  }[]
}

const isTagGroup = (value: unknown): value is TagGroup => {
  if (!isObject(value)) return false;

  const obj = value as Record<string, unknown>;
  return (
    (obj.category === undefined || obj.category === null || typeof obj.category === 'string') &&
    Array.isArray(obj.values) &&
    obj.values.every((value) =>
      isObject(value) &&
      typeof (value as Record<string, unknown>).tagKey === 'string' &&
      (!Object.prototype.hasOwnProperty.call(value, 'value') ||
        typeof (value as Record<string, unknown>).value === 'string')
    )
  );
};

export interface GlobalFilterConfig {
  selectedTags: string[];
  systemProfile: InventoryWorkloads;
}

export const mapGlobalFilters = (tags: string[] | TagGroup[] | null | undefined, workloads: Record<string, {isSelected: boolean}> = {}): GlobalFilterConfig => {
  let tagsInUrlFormat: string[] = [];
  if (tags) {
    tags.forEach((tag: unknown) => {
      if (isTagGroup(tag)) {
        for (let value of tag.values) {
          tagsInUrlFormat.push(buildTagsQuerySegment(`${tag.category}/${value.tagKey}=${value.value}`))
        }
      } else if (typeof tag === 'string') {
        tagsInUrlFormat.push(buildTagsQuerySegment(tag));
      }
    });
  }

  return {
    systemProfile: {
      ...(workloads?.SAP?.isSelected && { sap_system: true }),
      ...(workloads?.['Ansible Automation Platform']?.isSelected && {
        ansible: { controller_version: 'not_nil' },
      }),
      ...(workloads?.['Microsoft SQL']?.isSelected && {
        mssql: { version: 'not_nil' },
      }),
      ...(workloads?.CrowdStrike?.isSelected && { crowdstrike: true }),
      ...(workloads?.['IBM DB2']?.isSelected && { ibm_db2: true }),
      ...(workloads?.InterSystems?.isSelected && { intersystems: true }),
      ...(workloads?.['Oracle DB']?.isSelected && { oracle_db: true }),
      ...(workloads?.['RHEL AI']?.isSelected && { rhel_ai: true }),
    },
    selectedTags: tagsInUrlFormat.filter(Boolean),
  };
};

export const isObject = (variable: unknown): variable is object =>
  typeof variable === 'object' && variable !== null;
