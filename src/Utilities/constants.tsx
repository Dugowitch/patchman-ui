import { BugIcon, EnhancementIcon, FlagIcon, SecurityIcon } from '@patternfly/react-icons';
import React, { ReactNode } from 'react';
import { subtractDate } from './Helpers';
import { SortByDirection } from '@patternfly/react-table';
import { ListMeta } from './api/patchApiTypes';
import { InventoryWorkloads } from './SystemsHelpers';
import { AxiosError } from 'axios';

export const STATUS_REJECTED = 'rejected';
export const STATUS_LOADING = 'loading';
export const STATUS_RESOLVED = 'resolved';

export type AscDesc = Record<SortByDirection, string>;

export type CompoundSortOptions = Record<string, AscDesc>

export const defaultCompoundSortValues: CompoundSortOptions = {
  operating_system: {
    asc: 'osname,osmajor,osminor',
    desc: '-osname,-osmajor,-osminor',
  },
  applicable_advisories: {
    asc: 'rhsa_count,rhba_count,rhea_count',
    desc: '-rhsa_count,-rhba_count,-rhea_count',
  },
};

export const templateCompoundSortValues: CompoundSortOptions = {
  applicable_advisories: {
    asc: 'applicable_rhsa_count,applicable_rhba_count,applicable_rhea_count',
    desc: '-applicable_rhsa_count,-applicable_rhba_count,-applicable_rhea_count',
  },
  installable_advisories: {
    asc: 'installable_rhsa_count,installable_rhba_count,installable_rhea_count',
    desc: '-installable_rhsa_count,-installable_rhba_count,-installable_rhea_count',
  },
};

export type AdvisoryStatus = 'Applicable' | 'Installable';
export type UpdateStatus = 'Applicable' | 'Installable' | 'None'

// TODO: might want to eventually refactor this as boolean
// This is kind of a dirty workaround. When converting to TS, the codebase used mix of
// true/false and "true"/"false" that was unified on the string version, because boolean
// caused way too many issues and would require separate refacotr itself. For example, 
// PF filter component expects it as strings, guart and safety `||` syntax worked with
// `"false"` but not with `false` (because Boolean("false") is true), URL query strings
// do not care, and a chip expects string as well.
export enum SBool {
  true = 'true',
  false = 'false',
}

export type Set = Record<string, true>;

// selectedRows values are a dual-purpose contract:
// - `true` for pages where only selection state is needed
// - the remediation payload (EVRA, advisory ID, ...) for pages whose
//   remediation provider builds issue IDs from per-row data
// TODO: we might want to fix this later and use Set for selected
// and something else for the payload
export type SelectedRows = Record<string, true | string>;

export interface FetchError {
  title: string;
  detail: string;
  status: number;
}

export interface StoreStatus {
  isLoading: boolean;
  code?: number;
  hasError?: boolean;
}

export interface ListStore<T> {
  rows: T[];
  status?: StoreStatus
  metadata?: ListMeta | {};
  expandedRows?: Set;
  selectedRows: SelectedRows;
  queryParams: QueryParams;
  error?: FetchError | Partial<AxiosError>;
}

export const storeListDefaults: ListStore<any> = {
  rows: [],
  status: { isLoading: true },
  metadata: {
    limit: 25,
    offset: 0,
    total_items: 0,
  },
  expandedRows: {},
  selectedRows: {},
  queryParams: {},
  error: {},
};

export type FilterValue1 = string | number | SBool | AdvisoryType | Severity | UpdateStatus
export type FilterValue2 = string[] | number[] | SBool[] | AdvisoryType[] | Severity[] | UpdateStatus[]
export type FilterValue = FilterValue1 | FilterValue2

export type FilterEntries = Record<string, FilterValue>

export interface SystemPaginationQueryParams {
  page: number
  perPage: number
}

export interface DefaultPaginationQueryParams {
  limit?: number;
  offset?: number;
}

export interface BaseQueryParams {
  filter?: FilterEntries
  sort?: string
  search?: string
}

export interface AdditionalQueryParams {
  systemProfile?: InventoryWorkloads;
  selectedTags?: string[];
}

export type QueryParams = BaseQueryParams & (DefaultPaginationQueryParams | SystemPaginationQueryParams) & AdditionalQueryParams

export interface Filter {
  filter?: FilterEntries
  search?: string
}

export const systemPackagesDefaultFilters: Filter = {
  filter: { update_status: ['Installable'] },
};

export const packagesListDefaultFilters: Filter = {
  filter: { systems_applicable: ['gt:0'] },
};

export const systemsListDefaultFilters: Filter = {
  filter: {},
};

export const emptyDefaultFilters: Filter = {
  filter: {},
};

export interface PageFilters {
  advisories: Filter;
  advisorySystems: Filter;
  cves: Filter;
  packages: Filter;
  packageSystems: Filter;
  systemAdvisories: Filter;
  systemPackages: Filter;
  systems: Filter;
}

export const pageDefaultFilters: PageFilters = {
  advisories: emptyDefaultFilters,
  advisorySystems: emptyDefaultFilters,
  cves: emptyDefaultFilters,
  packages: packagesListDefaultFilters,
  packageSystems: emptyDefaultFilters,
  systemAdvisories: emptyDefaultFilters,
  systemPackages: systemPackagesDefaultFilters,
  systems: systemsListDefaultFilters,
};

export const publicDateOptions: Array<ValueLabel> = [
  {
    apiValue: `gt:${subtractDate(7)}`,
    label: 'Last 7 days',
    value: 'last7',
  },
  {
    apiValue: `gt:${subtractDate(30)}`,
    label: 'Last 30 days',
    value: 'last30',
  },
  {
    apiValue: `gt:${subtractDate(90)}`,
    label: 'Last 90 days',
    value: 'last90',
  },
  {
    apiValue: `gt:${subtractDate(365)}`,
    label: 'Last year',
    value: 'lastYear',
  },
  {
    apiValue: `lt:${subtractDate(365)}`,
    label: 'More than 1 year ago',
    value: 'moreThanYear',
  },
];

export type Severity = null | 1 | 2 | 3 | 4;
export const SEVERITY_NONE: Severity = null;
export const SEVERITY_MINOR: Severity = 1;
export const SEVERITY_MODERATE: Severity = 2;
export const SEVERITY_IMPORTANT: Severity = 3;
export const SEVERITY_CRITICAL: Severity = 4;

export interface AdvisorySeverityData extends ValueLabel<Severity> {
  color: string;
  text?: string;
}

export const advisorySeverities: Array<AdvisorySeverityData> = [
  {
    value: SEVERITY_NONE,
    label: 'None',
    color: 'var(--pf-t--global--icon--color--severity--none--default)',
  },
  {
    value: SEVERITY_MINOR,
    label: 'Minor',
    color: 'var(--pf-t--global--icon--color--severity--minor--default)',
    text:
      'This rating is given to all other issues that have a security impact. These are the types of vulnerabilities' +
      ' that are believed to require unlikely circumstances to be able to be exploited, or where a successful exploit' +
      ' would give minimal consequences.',
  },
  {
    value: SEVERITY_MODERATE,
    label: 'Moderate',
    color: 'var(--pf-t--global--icon--color--severity--moderate--default)',
    text:
      'This rating is given to flaws that may be more difficult to exploit but could still lead to some' +
      ' compromise of the confidentiality, integrity, or availability of resources, under certain circumstances.' +
      ' These are the types of vulnerabilities that could have had a Critical impact or Important impact' +
      ' but are less easily exploited based on a technical evaluation of the flaw, or affect unlikely' +
      ' configurations.',
  },
  {
    value: SEVERITY_IMPORTANT,
    label: 'Important',
    color: 'var(--pf-t--global--icon--color--severity--important--default)',
    text:
      'This rating is given to flaws that can easily compromise the confidentiality, integrity, or availability' +
      ' of resources. These are the types of vulnerabilities that allow local users to gain privileges, allow' +
      ' unauthenticated remote users to view resources that should otherwise be protected by authentication,' +
      ' allow authenticated remote users to execute arbitrary code, or allow remote users to cause a denial' +
      ' of service.',
  },
  {
    value: SEVERITY_CRITICAL,
    label: 'Critical',
    color: 'var(--pf-t--global--icon--color--severity--critical--default)',
    text:
      'This rating is given to flaws that could be easily exploited by a remote unauthenticated attacker' +
      ' and lead to system compromise (arbitrary code execution) without requiring user interaction.' +
      ' These are the types of vulnerabilities that can be exploited by worms. Flaws that require an authenticated' +
      ' remote user, a local user, or an unlikely configuration are not classed as Critical impact.',
  },
];

export type AdvisoryType = 'security' | 'bugfix' | 'enhancement' | 'other';

export const TYPE_SECURITY: AdvisoryType = 'security';
export const TYPE_BUGFIX: AdvisoryType = 'bugfix';
export const TYPE_ENHANCEMENT: AdvisoryType = 'enhancement';
export const TYPE_OTHER: AdvisoryType = 'other';

export interface AdvisoryTypeData extends ValueLabel<AdvisoryType> {
  icon: ReactNode;
}

export const advisoryTypes: Array<AdvisoryTypeData> = [
  {
    value: TYPE_SECURITY,
    label: 'Security',
    icon: <SecurityIcon />,
  },
  {
    value: TYPE_BUGFIX,
    label: 'Bugfix',
    icon: <BugIcon />,
  },
  {
    value: TYPE_ENHANCEMENT,
    label: 'Enhancement',
    icon: <EnhancementIcon />,
  },
  {
    value: TYPE_OTHER,
    label: 'Other',
    icon: <FlagIcon />,
  },
];

export interface ValueLabel<T = string> {
  value: T;
  label: string;
  apiValue?: T;
}

export const updatableTypes: Array<ValueLabel<UpdateStatus>> = [
  {
    value: 'None',
    label: 'Up to date',
  },
  {
    value: 'Installable',
    label: 'Installable',
  },
  {
    value: 'Applicable',
    label: 'Applicable',
  },
];

export const advisoryStatuses: Array<ValueLabel<AdvisoryStatus>> = [
  {
    value: 'Installable',
    label: 'Installable',
  },
  {
    value: 'Applicable',
    label: 'Applicable',
  },
];

export const packagesListUpdatableTypes: Array<ValueLabel> = [
  {
    value: 'eq:0',
    label: 'Systems up to date',
  },
  {
    value: 'gt:0',
    label: 'Systems with patches available',
  },
];

export const workloadOptions: Array<ValueLabel> = [
  { label: 'Ansible Automation Platform', value: 'ansible' },
  { label: 'CrowdStrike', value: 'crowdstrike' },
  { label: 'IBM DB2', value: 'ibm_db2' },
  { label: 'InterSystems', value: 'intersystems' },
  { label: 'Microsoft SQL', value: 'mssql' },
  { label: 'Oracle DB', value: 'oracle_db' },
  { label: 'RHEL AI', value: 'rhel_ai' },
  { label: 'SAP', value: 'sap' },
  { label: 'Satellite', value: 'satellite' },
];

export const staleSystems: Array<ValueLabel<SBool>> = [
  {
    value: SBool.true,
    label: 'Stale',
  },
  {
    value: SBool.false,
    label: 'Fresh',
  },
];

export const rebootRequired: Array<ValueLabel<SBool>> = [
  {
    value: SBool.true,
    label: 'Required',
  },
  {
    value: SBool.false,
    label: 'Not required',
  },
];

export interface FilterCategory {
  label: string;
  values?: Array<AdvisoryTypeData | AdvisorySeverityData | ValueLabel | ValueLabel<SBool>>;
}
export interface FilterCategories {
  advisory_type_name: FilterCategory;
  severity: FilterCategory;
  public_date: FilterCategory;
  update_status: FilterCategory;
  systems_applicable: FilterCategory;
  packages_updatable: FilterCategory;
  stale: FilterCategory;
  reboot_required: FilterCategory;
  os: FilterCategory;
  creator: FilterCategory;
  status: FilterCategory;
  group_name: FilterCategory;
  installed_evra: FilterCategory;
  workloads: FilterCategory;
}

export const filterCategories: FilterCategories = {
  advisory_type_name: {
    label: 'Type',
    values: advisoryTypes,
  },
  severity: {
    label: 'Severity',
    values: advisorySeverities,
  },
  public_date: {
    label: 'Publish date',
    values: publicDateOptions,
  },
  update_status: {
    label: 'Status',
    values: updatableTypes,
  },
  systems_applicable: {
    label: 'Status',
    values: packagesListUpdatableTypes,
  },
  packages_updatable: {
    label: 'Patch status',
    values: packagesListUpdatableTypes,
  },
  stale: {
    label: 'Status',
    values: staleSystems,
  },
  reboot_required: {
    label: 'Reboot',
    values: rebootRequired,
  },
  os: {
    label: 'Operating system',
  },
  creator: {
    label: 'Creator',
  },
  status: {
    label: 'Status',
    values: advisoryStatuses,
  },
  group_name: {
    label: 'Group',
  },
  installed_evra: {
    label: 'Version',
  },
  workloads: {
    label: 'Workload',
    values: workloadOptions,
  },
};

interface EntityTypes {
  advisories: 'advisories';
  packages: 'packages';
}

export const entityTypes: EntityTypes = {
  advisories: 'advisories',
  packages: 'packages',
};

export const ReadOnlyNotification = {
  title: 'title',
  detail: 'message',
};

export const remediationIdentifiers = {
  package: 'patch-package',
  advisory: 'patch-advisory',
};

export interface NotificationStateOption {
  title: string;
  variant: string;
}

export interface NotificationStates {
  pending: NotificationStateOption;
  success: NotificationStateOption;
  error: NotificationStateOption;
}

export const exportNotifications = (format?: string): NotificationStates => ({
  pending: {
    title: `Preparing export of ${format?.toUpperCase()} format. Once complete, your download will start automatically.`,
    variant: 'info',
  },
  success: {
    title: `The exported ${format?.toUpperCase()} file is being downloaded`,
    variant: 'success',
  },
  error: {
    title: 'Couldn’t download export. Reinitiate this export to try again.',
    variant: 'danger',
  },
});

export const multiValueFilters: Array<string> = [
  'installed_evra',
  'os',
  'creator',
  'status',
  'group_name',
];

export const KESSEL_API_BASE_URL = '/api/kessel/v1beta2';

export const featureFlags = {
  patch_set: 'patch.patch_set',
  kessel_enabled: 'patch-frontend.kessel-enabled',
};

export const NO_ADVISORIES_TEXT =
  'There is no installable content that can be remediated with Ansible for selected systems.';
