import { createIntl, createIntlCache, IntlCache, IntlShape } from 'react-intl';

const cache: IntlCache = createIntlCache();
const locale: string = navigator.language.slice(0, 2);

export const intl: IntlShape = createIntl({ onError: console.log, locale }, cache);
