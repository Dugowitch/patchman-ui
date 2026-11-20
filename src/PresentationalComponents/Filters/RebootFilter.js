import { useMemo } from 'react';
import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';
import { rebootRequired } from '../../Utilities/constants';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';

const rebootFilter = (apply, currentFilter = {}) => {
  let { reboot_required: currentValue } = currentFilter;

  const rebootMap = useMemo(
    () =>
      rebootRequired.map(({ value, label }) => ({
        label,
        value,
      })),
    [],
  );

  const currentValueStringType =
    currentValue &&
    ((Array.isArray(currentValue) && currentValue) || [currentValue]);

  const filterByReboot = (value) => {
    apply({ filter: { reboot_required: value } });
  };

  return {
    label: intl.formatMessage(messages.labelsFiltersReboot),
    type: conditionalFilterType.checkbox,
    filterValues: {
      onChange: (event, value) => {
        filterByReboot(value);
      },
      items: rebootMap,
      value: currentValueStringType,
      placeholder: intl.formatMessage(messages.labelsFiltersRebootPlaceholder),
    },
  };
};

export default rebootFilter;
