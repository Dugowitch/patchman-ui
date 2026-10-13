import { AdvisoryStatus, AdvisoryType, Severity } from "../constants";

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
