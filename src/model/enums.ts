import { MessagesKey } from 'i18n/translations/translationKeys';

export enum ORGANISATION_TYPE {
  STATUTORY_BODY = 'statutoryBody',
  AUTHORITY = 'authority',
  OPERATOR = 'operator',
  RAIL_OPERATOR = 'railOperator',
  RAIL_FREIGHT_OPERATOR = 'railFreightOperator',
  FACILITY_OPERATOR = 'facilityOperator',
  TRAVEL_AGENT = 'travelAgent',
  SERVICED_ORGANISATION = 'servicedOrganisation',
  RETAIL_CONSORTIUM = 'retailConsortium',
  OTHER = 'other',
}

export const VEHICLE_MODE = Object.freeze({
  BUS: 'bus',
  WATER: 'water',
});

export const VEHICLE_SUBMODE = Object.freeze({
  AIRPORT_LINK_BUS: 'airportLinkBus',
  EXPRESS_BUS: 'expressBus',
  LOCAL_BUS: 'localBus',
  NIGHT_BUS: 'nightBus',
  RAIL_REPLACEMENT_BUS: 'railReplacementBus',
  REGIONAL_BUS: 'regionalBus',
  SCHOOL_BUS: 'schoolBus',
  SHUTTLE_BUS: 'shuttleBus',
  SIGHTSEEING_BUS: 'sightseeingBus',
  LOCAL_PASSENGER_FERRY: 'localPassengerFerry',
  SIGHTSEEING_SERVICE: 'sightseeingService',
});

export const FLEXIBLE_LINE_TYPE = Object.freeze({
  FIXED: 'fixed',
  MAIN_ROUTE_WITH_FLEXIBLE_ENDS: 'mainRouteWithFlexibleEnds',
  FIXED_STOP_AREA_WIDE: 'fixedStopAreaWide',
  FLEXIBLE_AREAS_ONLY: 'flexibleAreasOnly',
  HAIL_AND_RIDE_SECTIONS: 'hailAndRideSections',
  MIXED_FLEXIBLE: 'mixedFlexible',
});

export enum DAY_OF_WEEK {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
}

export enum BOOKING_METHOD {
  CALL_DRIVER = 'callDriver',
  CALL_OFFICE = 'callOffice',
  ONLINE = 'online',
  PHONE_AT_STOP = 'phoneAtStop',
  TEXT = 'text',
}

export enum BOOKING_ACCESS {
  PUBLIC = 'public',
  AUTHORISED_PUBLIC = 'authorisedPublic',
  STAFF = 'staff',
}

export enum PURCHASE_WHEN {
  TIME_OF_TRAVEL_ONLY = 'timeOfTravelOnly',
  DAY_OF_TRAVEL_ONLY = 'dayOfTravelOnly',
  UNTIL_PREVIOUS_DAY = 'untilPreviousDay',
  ADVANCE_AND_DAY_OF_TRAVEL = 'advanceAndDayOfTravel',
}

export enum PURCHASE_MOMENT {
  ON_RESERVATION = 'onReservation',
  BEFORE_BOARDING = 'beforeBoarding',
  AFTER_BOARDING = 'afterBoarding',
  ON_CHECK_OUT = 'onCheckOut',
}

export const GEOMETRY_TYPE = Object.freeze({
  POINT: 'Point',
  LINE_STRING: 'LineString',
  POLYGON: 'Polygon',
  MULTI_POINT: 'MultiPoint',
  MULTI_LINE_STRING: 'MultiLineString',
  MULTI_POLYGON: 'MultiPolygon',
  GEOMETRY_COLLECTION: 'GeometryCollection',
});

export enum DIRECTION_TYPE {
  INBOUND = 'inbound',
  OUTBOUND = 'outbound',
  CLOCKWISE = 'clockwise',
  ANTICLOCKWISE = 'anticlockwise',
}

export enum EXPORT_STATUS {
  IN_PROGRESS = 'in_progress',
  FAILED = 'failed',
  SUCCESS = 'success',
}

export enum SEVERITY {
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export const bookingAccessMessages: Record<
  BOOKING_ACCESS,
  keyof MessagesKey
> = {
  [BOOKING_ACCESS.PUBLIC]: 'bookingAccessPublic',
  [BOOKING_ACCESS.AUTHORISED_PUBLIC]: 'bookingAccessAuthorisedPublic',
  [BOOKING_ACCESS.STAFF]: 'bookingAccessStaff',
};

export const bookingTimeMessages: Record<PURCHASE_WHEN, keyof MessagesKey> = {
  [PURCHASE_WHEN.TIME_OF_TRAVEL_ONLY]: 'purchaseWhenTimeOfTravelOnly',
  [PURCHASE_WHEN.DAY_OF_TRAVEL_ONLY]: 'purchaseWhenDayOfTravelOnly',
  [PURCHASE_WHEN.UNTIL_PREVIOUS_DAY]: 'purchaseWhenUntilPreviousDay',
  [PURCHASE_WHEN.ADVANCE_AND_DAY_OF_TRAVEL]:
    'purchaseWhenAdvanceAndDayOfTravel',
};

export const bookingMethodMessages: Record<
  BOOKING_METHOD,
  keyof MessagesKey
> = {
  [BOOKING_METHOD.CALL_DRIVER]: 'bookingMethodCallDriver',
  [BOOKING_METHOD.CALL_OFFICE]: 'bookingMethodCallOffice',
  [BOOKING_METHOD.ONLINE]: 'bookingMethodOnline',
  [BOOKING_METHOD.PHONE_AT_STOP]: 'bookingMethodPhoneAtStop',
  [BOOKING_METHOD.TEXT]: 'bookingMethodText',
};

export const paymentTimeMessages: Record<PURCHASE_MOMENT, keyof MessagesKey> = {
  [PURCHASE_MOMENT.ON_RESERVATION]: 'purchaseMomentOnReservation',
  [PURCHASE_MOMENT.BEFORE_BOARDING]: 'purchaseMomentBeforeBoarding',
  [PURCHASE_MOMENT.AFTER_BOARDING]: 'purchaseMomentAfterBoarding',
  [PURCHASE_MOMENT.ON_CHECK_OUT]: 'purchaseMomentOnCheckOut',
};
