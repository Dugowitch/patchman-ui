// raw data for testing purposes only

import { AdvisoryItem, Response, SystemAdvisoryItem, SystemPackageItem } from "./api/patchApiTypes";
import { CveItem } from "./api/vulnerabilityApi";
import { ListStore, SEVERITY_MODERATE } from "./constants";
import { CvesRows, SystemItemFlat } from "./DataMappers";

export const advisoryRows: AdvisoryItem[] = [
  {
    attributes: {
      advisory_type_name: 'enhancement',
      applicable_systems: 1,
      description: 'The microcode_ctl ',
      public_date: '2020-06-24T17:22:25Z',
      reboot_required: true,
      synopsis: 'microcode_ctl',
      severity: 3,
      cve_count: 0,
      installable_systems: 1,
      release_versions: [],
    },
    id: 'RHEA-2020:2743',
    type: 'advisory',
  },
];

export const systemAdvisoryRows: SystemAdvisoryItem[] = [
  {
    attributes: {
      advisory_type_name: 'security',
      description: 'Kernel-based Virtual.',
      public_date: '2020-06-30T13:38:53Z',
      severity: 3,
      synopsis: 'Important',
      reboot_required: true,
      status: 'Installable',
      cve_count: 0,
      release_versions: [],
    },
    id: 'RHSA-2020:2774',
    type: 'advisory',
  },
];

export const systemRows: SystemItemFlat[] = [
  {
    id: 'test-system-id-1',
    type: 'system',
    groups: [{ id: '019a2fe7-92df-7430-bdb6-cb02d1c8162b', name: 'Ungrouped Hosts' }],
    created: '2021-06-05T09:03:09.154453Z',
    culled_timestamp: '2021-06-20T14:03:09.096101Z',
    display_name: 'test-system-1',
    last_evaluation: '2021-06-05T09:03:10.698831Z',
    last_upload: '2021-06-07T12:34:18.186723Z',
    packages_installed: 573,
    rhba_count: 0,
    rhea_count: 0,
    rhsa_count: 0,
    other_count: 0,
    rhsm: '',
    stale: false,
    stale_timestamp: '2021-06-06T14:03:09.096101Z',
    stale_warning_timestamp: '2021-06-13T14:03:09.096101Z',
    built_pkgcache: false,
    os: '',
    tags: null,
    baseline_id: 0,
    baseline_name: '',
    satellite_managed: false,
    workspace_id: null,
    workspace_name: null,
    template_name: '',
    template_uuid: '',
    image_based: false,
    arch: '',
    packages_installable: 0,
    packages_applicable: 0,
    installable_rhsa_count: 0,
    installable_rhba_count: 0,
    installable_rhea_count: 0,
    installable_other_count: 0,
    applicable_rhsa_count: 0,
    applicable_rhba_count: 0,
    applicable_rhea_count: 0,
    applicable_other_count: 0,
  },
  {
    id: 'test-system-id-2',
    type: 'system',
    groups: [{ id: '019a2fe7-92df-7430-bdb6-cb02d1c8162b', name: 'Ungrouped Hosts' }],
    created: '2021-06-05T09:03:09.154453Z',
    culled_timestamp: '2021-06-20T14:03:09.096101Z',
    display_name: 'test-system-2',
    last_evaluation: '2021-06-05T09:03:10.698831Z',
    last_upload: '2021-06-07T12:34:18.186723Z',
    packages_installed: 573,
    rhba_count: 0,
    rhea_count: 0,
    rhsa_count: 0,
    other_count: 0,
    rhsm: '',
    stale: false,
    stale_timestamp: '2021-06-06T14:03:09.096101Z',
    stale_warning_timestamp: '2021-06-13T14:03:09.096101Z',
    built_pkgcache: false,
    os: '',
    tags: null,
    baseline_id: 0,
    baseline_name: '',
    satellite_managed: false,
    workspace_id: null,
    workspace_name: null,
    template_name: '',
    template_uuid: '',
    image_based: false,
    arch: '',
    packages_installable: 0,
    packages_applicable: 0,
    installable_rhsa_count: 0,
    installable_rhba_count: 0,
    installable_rhea_count: 0,
    installable_other_count: 0,
    applicable_rhsa_count: 0,
    applicable_rhba_count: 0,
    applicable_rhea_count: 0,
    applicable_other_count: 0,
  },
];

export const advisoryHeader = {
  attributes: {
    advisory_type_name: 'security',
    description: 'Kernel-based Virtual.',
    public_date: '2020-06-30T13:38:53Z',
    modified_date: '2020-06-30T13:38:53Z',
    severity: 3,
    synopsis: 'Important',
    applicable_systems: 1,
    installable_systems: 1,
    cve_count: 1,
    reboot_required: false,
    release_versions: [],
  },
  id: 'RHSA-2020:2774',
  type: 'advisory',
};

export const advisoryDetailRows = {
  data: {
    attributes: {
      cves: ['CVE-2020-11080'],
      description: 'libnghttp2.',
      fixes: null,
      modified_date: '2020-06-25T16:31:29Z',
      packages: { libnghttp2: '1.33.0-3.el8_2.1.x86_64' },
      public_date: '2020-06-25T16:31:29Z',
      references: [],
      severity: 3,
      solution: 'For details',
      synopsis: 'Important: ',
      topic: 'An update .',
    },
  },
  id: 'RHSA-2020:2755',
  type: 'advisory',
};

export const systemPackages: SystemPackageItem[] = [
  {
    description: 'This package contains testing data',
    evra: 'test-evra',
    name: 'test-name',
    summary: 'Access control list utilities',
    updatable: false,
    update_status: 'None',
    updates: [{ evra: 'test-evra', status: 'Installable' }],
  },
];

export const entityDetail = {
  loaded: true,
  activeApps: [],
  entity: {
    account: '60',
    insights_id: 'test-insights-id',
  },
};

export const cveRows: CveItem[] = [
  {
    attributes: {
      cvss_score: '7.300',
      impact: 'Moderate',
      synopsis: 'CVE-2021-29921',
    },
    id: 'CVE-2021-29921',
    type: 'cve',
  },
  {
    attributes: {
      cvss_score: '7.300',
      impact: 'Moderate',
      synopsis: 'CVE-2021-29922',
    },
    id: 'CVE-2021-29922',
    type: 'cve',
  },
  {
    attributes: {
      cvss_score: '7.300',
      impact: 'Moderate',
      synopsis: 'CVE-2021-29923',
    },
    id: 'CVE-2021-29923',
    type: 'cve',
  },
  {
    attributes: {
      cvss_score: '7.300',
      impact: 'Moderate',
      synopsis: 'CVE-2021-29924',
    },
    id: 'CVE-2021-29924',
    type: 'cve',
  },
  {
    attributes: {
      cvss_score: '7.300',
      impact: 'Moderate',
      synopsis: 'CVE-2021-29925',
    },
    id: 'CVE-2021-29925',
    type: 'cve',
  },
  {
    attributes: {
      cvss_score: '7.300',
      impact: 'Moderate',
      synopsis: 'CVE-2021-29926',
    },
    id: 'CVE-2021-29926',
    type: 'cve',
  },
  {
    attributes: {
      cvss_score: '7.300',
      impact: 'Moderate',
      synopsis: 'CVE-2021-29927',
    },
    id: 'CVE-2021-29927',
    type: 'cve',
  },
  {
    attributes: {
      cvss_score: '7.300',
      impact: 'Moderate',
      synopsis: 'CVE-2021-29928',
    },
    id: 'CVE-2021-29928',
    type: 'cve',
  },
  {
    attributes: {
      cvss_score: '7.300',
      impact: 'Moderate',
      synopsis: 'CVE-2021-29929',
    },
    id: 'CVE-2021-29929',
    type: 'cve',
  },
  {
    attributes: {
      cvss_score: '7.300',
      impact: 'Moderate',
      synopsis: 'CVE-2021-29930',
    },
    id: 'CVE-2021-29930',
    type: 'cve',
  },
  {
    attributes: {
      cvss_score: '7.300',
      impact: 'Moderate',
      synopsis: 'CVE-2021-29931',
    },
    id: 'CVE-2021-29931',
    type: 'cve',
  },
  {
    attributes: {
      cvss_score: '7.300',
      impact: 'Moderate',
      synopsis: 'CVE-2021-29932',
    },
    id: 'CVE-2021-29932',
    type: 'cve',
  },
];

export const readyCveRows: CvesRows = [
  {
    id: 'CVE-2021-29921',
    key: 'CVE-2021-29921',
    cells: [{ title: '[Object] ' }, { title: '[Object]', value: SEVERITY_MODERATE }, { title: '7.3' }],
  },
  {
    id: 'CVE-2021-29922',
    key: 'CVE-2021-29922',
    cells: [{ title: '[Object] ' }, { title: '[Object]', value: SEVERITY_MODERATE }, { title: '7.3' }],
  },
  {
    id: 'CVE-2021-29923',
    key: 'CVE-2021-29923',
    cells: [{ title: '[Object] ' }, { title: '[Object]', value: SEVERITY_MODERATE }, { title: '7.3' }],
  },
  {
    id: 'CVE-2021-29924',
    key: 'CVE-2021-29924',
    cells: [{ title: '[Object] ' }, { title: '[Object]', value: SEVERITY_MODERATE }, { title: '7.3' }],
  },
  {
    id: 'CVE-2021-29925',
    key: 'CVE-2021-29925',
    cells: [{ title: '[Object] ' }, { title: '[Object]', value: SEVERITY_MODERATE }, { title: '7.3' }],
  },
  {
    id: 'CVE-2021-29926',
    key: 'CVE-2021-29926',
    cells: [{ title: '[Object] ' }, { title: '[Object]', value: SEVERITY_MODERATE }, { title: '7.3' }],
  },
  {
    id: 'CVE-2021-29927',
    key: 'CVE-2021-29927',
    cells: [{ title: '[Object] ' }, { title: '[Object]', value: SEVERITY_MODERATE }, { title: '7.3' }],
  },
  {
    id: 'CVE-2021-29928',
    key: 'CVE-2021-29928',
    cells: [{ title: '[Object] ' }, { title: '[Object]', value: SEVERITY_MODERATE }, { title: '7.3' }],
  },
  {
    id: 'CVE-2021-29929',
    key: 'CVE-2021-29929',
    cells: [{ title: '[Object] ' }, { title: '[Object]', value: SEVERITY_MODERATE }, { title: '7.3' }],
  },
  {
    id: 'CVE-2021-29930',
    key: 'CVE-2021-29930',
    cells: [{ title: '[Object] ' }, { title: '[Object]', value: SEVERITY_MODERATE }, { title: '7.3' }],
  },
  {
    id: 'CVE-2021-29931',
    key: 'CVE-2021-29931',
    cells: [{ title: '[Object] ' }, { title: '[Object]', value: SEVERITY_MODERATE }, { title: '7.3' }],
  },
  {
    id: 'CVE-2021-29932',
    key: 'CVE-2021-29932',
    cells: [{ title: '[Object] ' }, { title: '[Object]', value: SEVERITY_MODERATE }, { title: '7.3' }],
  },
];

export const packageDetailData = { // TODO
  data: {
    attributes: {
      description: 'testDescription',
    },
  },
};

export const systemsStoreState: ListStore<SystemItemFlat> = {
  selectedRows: {},
  queryParams: { page: 1, perPage: 20, sort: '-last_upload', search: 'testSearch' },
  rows: systemRows,
};

export const packageVersions: Response<{evra: string}> = {
  data: [{ evra: '0.0.25-1.el7.noarch' }, { evra: '0.0.25-4.el8.noarch' }],
  links: {
    first: '/packages/abattis-cantarell-fonts/versions?offset=0\u0026limit=20\u0026sort=evra',
    last: '/packages/abattis-cantarell-fonts/versions?offset=0\u0026limit=20\u0026sort=evra',
    next: null,
    previous: null,
  },
  meta: { limit: 20, offset: 0, sort: ['evra'], filter: {}, total_items: 2 },
};
