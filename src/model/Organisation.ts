type MultilingualString = {
  lang: string;
  value: string;
};

type ContactDetails = {
  email: string;
  phone: string;
  url: string;
};

type KeyValue = {
  key: string;
  value: string;
};

type KeyList = {
  keyValue?: KeyValue[];
};

export type Organisation = {
  id: string;
  name: MultilingualString;
  legalName: MultilingualString;
  contactDetails: ContactDetails;
  keyList?: KeyList;
};
