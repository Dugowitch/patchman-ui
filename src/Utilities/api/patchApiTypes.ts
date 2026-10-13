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

