import messages, {
  UttuCode,
  UttuSubCode,
  CombinedUttuCode
} from './uttu.messages';
import { IntlFormatters } from 'react-intl';

type Extensions = {
  code: UttuCode;
  subCode: UttuSubCode;
  metaData: { [key: string]: object };
};

type UttuError = {
  response:
    | undefined
    | {
        errors: { message?: string; extensions?: Extensions }[];
      };
};

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
  intl: IntlFormatters,
  e: UttuError
) => {
  const error = e.response?.errors?.[0];
  if (error?.extensions?.code) {
    const { code, subCode, metaData = {} } = error.extensions;
    const messageCode = (subCode ? `${code}_${subCode}` : code) as
      | UttuCode
      | CombinedUttuCode;

    console.log(messageCode);
    const errorMessage = messages[messageCode] ?? messages.UNKNOWN;

    return intl.formatMessage(errorMessage, metaData as any);
  }

  return error?.message || intl.formatMessage(messages[UttuCode.UNKNOWN]);
};
