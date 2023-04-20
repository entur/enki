import messages, {
  CombinedUttuCode,
  UttuCode,
  UttuSubCode,
} from './uttu.messages';
import { ApolloError, isApolloError } from '@apollo/client';
import { sentryCaptureException } from 'app/store';
import { IntlShape } from 'react-intl';

type Extensions = {
  code: UttuCode;
  subCode: UttuSubCode;
  metaData: { [key: string]: object };
};

export interface UttuError extends Error {
  response:
    | undefined
    | {
        errors: { message?: string; extensions?: Extensions }[];
      };
}

export const getUttuError = (e: UttuError) =>
  e.response?.errors?.[0]?.message ?? null;

export const getStyledUttuError = (
  e: UttuError,
  generalMessage: string,
  fallback = ''
) =>
  getUttuError(e)
    ? `${generalMessage}: ${getUttuError(e)}`
    : `${generalMessage}. ${fallback}`;

export const getInternationalizedUttuError = (intl: IntlShape, e: Error) => {
  let error;

  if (isApolloError(e)) {
    error = e.graphQLErrors[0];
  } else {
    error = (e as UttuError).response?.errors?.[0];
  }

  if (error?.extensions?.code) {
    const { code, subCode } = error.extensions;
    const messageCode = (subCode ? `${code}_${subCode}` : code) as
      | UttuCode
      | CombinedUttuCode;

    const errorMessage = messages[messageCode] ?? messages[UttuCode.UNKNOWN];

    if (!messages[messageCode]) {
      sentryCaptureException(e);
    }

    return intl.formatMessage({ id: errorMessage });
  }

  sentryCaptureException(e);

  return intl.formatMessage({ id: messages[UttuCode.UNKNOWN] });
};
