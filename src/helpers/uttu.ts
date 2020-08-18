import messages, {
  CombinedUttuCode,
  UttuCode,
  UttuSubCode,
} from './uttu.messages';
import { AppIntlState } from 'i18n';
import { ApolloError, isApolloError } from '@apollo/client';

type Extensions = {
  code: UttuCode;
  subCode: UttuSubCode;
  metaData: { [key: string]: object };
};

interface UttuError extends Error {
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

export const getInternationalizedUttuError = (
  intl: AppIntlState,
  e: UttuError | ApolloError
) => {
  let error;

  if (isApolloError(e)) {
    error = e.graphQLErrors[0];
  } else {
    error = e.response?.errors?.[0];
  }

  if (error?.extensions?.code) {
    const { code, subCode } = error.extensions;
    const messageCode = (subCode ? `${code}_${subCode}` : code) as
      | UttuCode
      | CombinedUttuCode;

    const errorMessage = messages[messageCode] ?? messages[UttuCode.UNKNOWN];

    return intl.formatMessage(errorMessage);
  }

  return error?.message || intl.formatMessage(messages[UttuCode.UNKNOWN]);
};
