import { isNil, isEmpty } from 'ramda';
import { isBlank } from 'helpers/forms';

import messages from './validateForm.messages';

function validateNetworkRef(networkRef) {
  if (isNil(networkRef) || isEmpty(networkRef)) {
    return messages.errorFlexibleLineNetworkRefEmpty;
  }
}

function validateOperatorRef(operatorRef) {
  if (isNil(operatorRef) || isEmpty(operatorRef)) {
    return messages.errorFlexibleLineOperatorRefEmpty;
  }
}

function validateFlexibleLineType(flexibleLineType) {
  if (isNil(flexibleLineType) || isEmpty(flexibleLineType)) {
    return messages.errorFlexibleLineFlexibleLineTypeEmpty;
  }
}

function validateName(name) {
  if (isBlank(name)) {
    return 'Navn må fylles inn.';
  }
}

function validatePublicCode(publicCode) {
  if (isBlank(publicCode)) {
    return 'Public Code må fylles inn.';
  }
}

export default function(flexibleLine) {
  if (!flexibleLine) {
    return {
      isValid: true,
      errors: {
        networkRef: undefined,
        name: undefined,
        publicCode: undefined,
        operatorRef: undefined
      }
    };
  }
  let errors = {
    networkRef: validateNetworkRef(flexibleLine.networkRef),
    name: validateName(flexibleLine.name),
    publicCode: validatePublicCode(flexibleLine.publicCode),
    operatorRef: validateOperatorRef(flexibleLine.operatorRef),
    flexibleLineType: validateFlexibleLineType(flexibleLine.flexibleLineType)
  };

  return {
    isValid: Object.values(errors).filter(Boolean).length === 0,
    errors: errors
  };
}
