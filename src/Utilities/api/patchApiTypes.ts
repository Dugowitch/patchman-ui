import { AdvisoryStatus, AdvisoryType, Severity, UpdateStatus } from "../constants";

// API response common ======================================================== 

export interface Links {
	first:  string
	last:  string
	next: string | null
	previous: string | null
}

export interface ListMeta {
	limit: number
  offset: number
  sort?: string[]
  search?: string
  filter?: Record<string, FilterData> | null
  total_items: number
  subtotals?: Record<string, number>
  has_systems?: boolean
}

export interface FilterData {
	op: string
	values: string[] | null
}

export interface Response<T> {
  data: T[]
  links: Links
  meta: ListMeta
}

export interface ResponseItem<T> {
  id: string;
  type: string;
  attributes: T;
}

// advisories common ==========================================================

export interface AdvisoryAtributesCommon {
  advisory_type_name: AdvisoryType;
  cve_count: number;
  description: string;
  public_date?: string;
  reboot_required: boolean;
  release_versions: string[];
  severity?: Severity;
  severity_name?: string;
  synopsis: string;
}

// advisories specific ========================================================

export interface AdvisoryAtributes extends AdvisoryAtributesCommon {
  applicable_systems: number;
  installable_systems: number;
}

export type AdvisoryItem = ResponseItem<AdvisoryAtributes>

export type AdvisoriesResponse = Response<AdvisoryItem>

// system advisories specific =================================================

export interface SystemAdvisoryAtributes extends AdvisoryAtributesCommon {
  status: AdvisoryStatus;
}

export type SystemAdvisoryItem = ResponseItem<SystemAdvisoryAtributes>

export type SystemAdvisoriesResponse = Response<SystemAdvisoryItem>

// packages specific ==========================================================

export interface PackageItem {
  name: string
	summary: string
	systems_installed: number
	systems_installable: number
	systems_applicable: number
}

export type PackagesResponse = Response<PackageItem>

// system packages common =====================================================

export interface SystemPackageAttributes {
  name: string
	evra: string
	summary: string
	description: string
	updatable: boolean
	update_status: UpdateStatus
}

// system packages specific ===================================================

export interface PackageUpdate {
  evra: string
	status: string
}

export interface SystemPackageItem extends SystemPackageAttributes {
  updates: PackageUpdate[] | null
}

export type SystemPackagesResponse = Response<SystemPackageItem>

// systems common =============================================================

export interface SystemTag {
  key: string;
  namespace: string;
  value: string;
}

export interface SystemGroup {
  id: string;
  name: string;
}

export interface SystemAttributesAdditional {
  // SystemLastUpload
  last_upload: string | null // TODO: *time.Time
  // SystemTimestamps
  stale_timestamp: string | null // TODO: *time.Time
  stale_warning_timestamp: string | null // TODO: *time.Time
  culled_timestamp: string | null // TODO: *time.Time
  created: string | null // TODO: *time.Time
  // SystemStale
  stale: boolean
  // SystemBuiltPkgcache
  built_pkgcache: boolean
}

export interface SystemAttributesCommon {
  // SystemDisplayName
  display_name: string;
  // OSAttributes
  os: string
  rhsm: string
  // SystemTags
  tags: SystemTag[] | null
  // BaselineIDAttr
  baseline_id: number
  // BaselineNameAttr
  baseline_name: string
  // SystemSatelliteManaged
  satellite_managed: boolean
  // SystemGroups
  groups: SystemGroup[] | null
	// SystemWorkspace
  workspace_id: string | null
  workspace_name: string | null
  // TemplateAttibutes
  template_name: string
  template_uuid: string
}

// systems specific ===========================================================

export interface SystemAttributes extends SystemAttributesCommon, SystemAttributesAdditional {
  last_evaluation: string | null; // TODO: *time.Time; possibly Date
  rhsa_count: number
  rhba_count: number
  rhea_count: number
  other_count: number
  packages_installed: number
  image_based: boolean
  arch: string

  packages_installable: number
  packages_applicable: number
  installable_rhsa_count: number
  installable_rhba_count: number
  installable_rhea_count: number
  installable_other_count: number
  applicable_rhsa_count: number
  applicable_rhba_count: number
  applicable_rhea_count: number
  applicable_other_count: number
}

export type SystemItem = ResponseItem<SystemAttributes>

export type SystemsResponse = Response<SystemItem>

// advisory systems specific ==================================================

export interface AdvisorySystemAttributes extends SystemAttributesCommon, SystemAttributesAdditional {
  status: string // TODO: or AdvisoryStatus?
}
 
export type AdvisorySystemItem = ResponseItem<AdvisorySystemAttributes>

export type AdvisorySystemsResponse = Response<AdvisorySystemItem>

// package systems specific ===================================================

export interface PackageSystemItem extends SystemAttributesCommon {
  baseline_uptodate: boolean | null
  id: string // uuid; inventory_id
  installed_evra: string
  available_evra: string
  updatable: boolean
  update_status: string
}

export type PackageSystemsResponse = Response<PackageSystemItem>
