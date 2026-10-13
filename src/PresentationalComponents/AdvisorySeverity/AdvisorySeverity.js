import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import {
  advisorySeverities,
  SEVERITY_CRITICAL,
  SEVERITY_IMPORTANT,
  SEVERITY_MINOR,
  SEVERITY_MODERATE,
  SEVERITY_NONE,
} from '../../Utilities/constants';
import {
  SeverityCriticalIcon,
  SeverityImportantIcon,
  SeverityMinorIcon,
  SeverityModerateIcon,
  SeverityNoneIcon,
} from '@patternfly/react-icons';
import IconWithLabel from '../Snippets/IconWithLabel';

/**
 * Display advisory severity icon with label.
 * @param {object} props
 * @param {string} [props.size='sm'] - The size of the icon (default: 'sm').
 * @param {null|1|2|3|4} [props.severity] - The numeric value of advisory severity (default: null).
 * @returns {JSX.Element}
 */
const AdvisorySeverity = ({ size = 'sm', severity = SEVERITY_NONE }) => {
  const severityData = advisorySeverities[severity] ?? advisorySeverities[0];

  return useMemo(() => {
    let SevIcon = SeverityNoneIcon;
    switch (severity) {
      case SEVERITY_MINOR:
        SevIcon = SeverityMinorIcon;
        break;
      case SEVERITY_MODERATE:
        SevIcon = SeverityModerateIcon;
        break;
      case SEVERITY_IMPORTANT:
        SevIcon = SeverityImportantIcon;
        break;
      case SEVERITY_CRITICAL:
        SevIcon = SeverityCriticalIcon;
        break;
    }

    return (
      <IconWithLabel
        icon={<SevIcon color={severityData.color} />}
        size={size}
        label={severityData.label}
      />
    );
  }, [size, severity]);
};

AdvisorySeverity.propTypes = {
  size: PropTypes.string,
  severity: PropTypes.oneOf([null, 1, 2, 3, 4]),
};

export default AdvisorySeverity;
