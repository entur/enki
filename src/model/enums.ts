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

export enum VEHICLE_MODE {
  AIR = 'air',
  BUS = 'bus',
  CABLEWAY = 'cableway',
  COACH = 'coach',
  FUNICULAR = 'funicular',
  METRO = 'metro',
  RAIL = 'rail',
  TRAM = 'tram',
  WATER = 'water',
  TAXI = 'taxi',
}

enum AIR_SUBMODE {
  DOMESTIC_FLIGHT = 'domesticFlight',
  HELICOPTER_SERVICE = 'helicopterService',
  INTERNATIONAL_FLIGHT = 'internationalFlight',
}

enum BUS_SUBMODE {
  AIRPORT_LINK_BUS = 'airportLinkBus',
  EXPRESS_BUS = 'expressBus',
  LOCAL_BUS = 'localBus',
  NIGHT_BUS = 'nightBus',
  RAIL_REPLACEMENT_BUS = 'railReplacementBus',
  REGIONAL_BUS = 'regionalBus',
  SCHOOL_BUS = 'schoolBus',
  SHUTTLE_BUS = 'shuttleBus',
  SIGHTSEEING_BUS = 'sightseeingBus',
}

enum TELECABIN_SUBMODE {
  TELECABIN = 'telecabin',
}

enum COACH_SUBMODE {
  INTERNATIONAL_COACH = 'internationalCoach',
  NATIONAL_COACH = 'nationalCoach',
  TOURIST_COACH = 'touristCoach',
}

enum FUNICULAR_SUBMODE {
  FUNICULAR = 'funicular',
}

enum METRO_SUBMODE {
  METRO = 'metro',
}

enum RAIL_SUBMODE {
  AIRPORT_LINK_RAIL = 'airportLinkRail',
  INTERNATIONAL = 'international',
  INTERREGIONAL_RAIL = 'interregionalRail',
  LOCAL = 'local',
  LONG_DISTANCE = 'longDistance',
  NIGHT_RAIL = 'nightRail',
  REGIONAL_RAIL = 'regionalRail',
  TOURIST_RAILWAY = 'touristRailway',
}

enum TRAM_SUBMODE {
  CITY_TRAM = 'cityTram',
  LOCAL_TRAM = 'localTram',
}

enum WATER_SUBMODE {
  HIGH_SPEED_PASSENGER_SERVICE = 'highSpeedPassengerService',
  HIGH_SPEED_VEHICLE_SERVICE = 'highSpeedVehicleService',
  INTERNATIONAL_CAR_FERRY = 'internationalCarFerry',
  INTERNATIONAL_PASSENGER_FERRY = 'internationalPassengerFerry',
  LOCAL_CAR_FERRY = 'localCarFerry',
  LOCAL_PASSENGER_FERRY = 'localPassengerFerry',
  NATIONAL_CAR_FERRY = 'nationalCarFerry',
  SIGHTSEEING_SERVICE = 'sightseeingService',
}

enum TAXI_SUBMODE {
  CHARTER_TAXI = 'charterTaxi',
  COMMUNAL_TAXI = 'communalTaxi',
  WATER_TAXI = 'waterTaxi',
}

export type VEHICLE_SUBMODE =
  | AIR_SUBMODE
  | BUS_SUBMODE
  | TELECABIN_SUBMODE
  | COACH_SUBMODE
  | FUNICULAR_SUBMODE
  | METRO_SUBMODE
  | RAIL_SUBMODE
  | TRAM_SUBMODE
  | WATER_SUBMODE
  | TAXI_SUBMODE;

export const VEHICLE_SUBMODE_LINK: Record<VEHICLE_MODE, VEHICLE_SUBMODE[]> = {
  [VEHICLE_MODE.AIR]: Object.values(AIR_SUBMODE),
  [VEHICLE_MODE.BUS]: Object.values(BUS_SUBMODE),
  [VEHICLE_MODE.CABLEWAY]: Object.values(TELECABIN_SUBMODE),
  [VEHICLE_MODE.COACH]: Object.values(COACH_SUBMODE),
  [VEHICLE_MODE.FUNICULAR]: Object.values(FUNICULAR_SUBMODE),
  [VEHICLE_MODE.METRO]: Object.values(METRO_SUBMODE),
  [VEHICLE_MODE.RAIL]: Object.values(RAIL_SUBMODE),
  [VEHICLE_MODE.TRAM]: Object.values(TRAM_SUBMODE),
  [VEHICLE_MODE.WATER]: Object.values(WATER_SUBMODE),
  [VEHICLE_MODE.TAXI]: Object.values(TAXI_SUBMODE),
};

export const vehicleModeMessages: Record<VEHICLE_MODE, keyof MessagesKey> = {
  [VEHICLE_MODE.AIR]: 'air',
  [VEHICLE_MODE.BUS]: 'bus',
  [VEHICLE_MODE.CABLEWAY]: 'cableway',
  [VEHICLE_MODE.COACH]: 'coach',
  [VEHICLE_MODE.FUNICULAR]: 'funicular',
  [VEHICLE_MODE.METRO]: 'metro',
  [VEHICLE_MODE.RAIL]: 'rail',
  [VEHICLE_MODE.TRAM]: 'tram',
  [VEHICLE_MODE.WATER]: 'water',
  [VEHICLE_MODE.TAXI]: 'taxi',
};

export const vehicleSubmodeMessages: Record<
  VEHICLE_SUBMODE,
  keyof MessagesKey
> = {
  [AIR_SUBMODE.DOMESTIC_FLIGHT]: 'domesticFlight',
  [AIR_SUBMODE.HELICOPTER_SERVICE]: 'helicopterService',
  [AIR_SUBMODE.INTERNATIONAL_FLIGHT]: 'internationalFlight',
  [BUS_SUBMODE.AIRPORT_LINK_BUS]: 'airportLinkBus',
  [BUS_SUBMODE.EXPRESS_BUS]: 'expressBus',
  [BUS_SUBMODE.LOCAL_BUS]: 'localBus',
  [BUS_SUBMODE.NIGHT_BUS]: 'nightBus',
  [BUS_SUBMODE.RAIL_REPLACEMENT_BUS]: 'railReplacementBus',
  [BUS_SUBMODE.REGIONAL_BUS]: 'regionalBus',
  [BUS_SUBMODE.SCHOOL_BUS]: 'schoolBus',
  [BUS_SUBMODE.SHUTTLE_BUS]: 'shuttleBus',
  [BUS_SUBMODE.SIGHTSEEING_BUS]: 'sightseeingBus',
  [TELECABIN_SUBMODE.TELECABIN]: 'telecabin',
  [COACH_SUBMODE.INTERNATIONAL_COACH]: 'internationalCoach',
  [COACH_SUBMODE.NATIONAL_COACH]: 'nationalCoach',
  [COACH_SUBMODE.TOURIST_COACH]: 'touristCoach',
  [FUNICULAR_SUBMODE.FUNICULAR]: 'funicular',
  [METRO_SUBMODE.METRO]: 'metro',
  [RAIL_SUBMODE.AIRPORT_LINK_RAIL]: 'airportLinkRail',
  [RAIL_SUBMODE.INTERNATIONAL]: 'international',
  [RAIL_SUBMODE.INTERREGIONAL_RAIL]: 'interregionalRail',
  [RAIL_SUBMODE.LOCAL]: 'local',
  [RAIL_SUBMODE.LONG_DISTANCE]: 'longDistance',
  [RAIL_SUBMODE.NIGHT_RAIL]: 'nightRail',
  [RAIL_SUBMODE.REGIONAL_RAIL]: 'regionalRail',
  [RAIL_SUBMODE.TOURIST_RAILWAY]: 'touristRailway',
  [TRAM_SUBMODE.CITY_TRAM]: 'cityTram',
  [TRAM_SUBMODE.LOCAL_TRAM]: 'localTram',
  [WATER_SUBMODE.HIGH_SPEED_PASSENGER_SERVICE]: 'highSpeedPassengerService',
  [WATER_SUBMODE.HIGH_SPEED_VEHICLE_SERVICE]: 'highSpeedVehicleService',
  [WATER_SUBMODE.INTERNATIONAL_CAR_FERRY]: 'internationalCarFerry',
  [WATER_SUBMODE.INTERNATIONAL_PASSENGER_FERRY]: 'internationalPassengerFerry',
  [WATER_SUBMODE.LOCAL_CAR_FERRY]: 'localCarFerry',
  [WATER_SUBMODE.LOCAL_PASSENGER_FERRY]: 'localPassengerFerry',
  [WATER_SUBMODE.NATIONAL_CAR_FERRY]: 'nationalCarFerry',
  [WATER_SUBMODE.SIGHTSEEING_SERVICE]: 'sightseeingService',
  [TAXI_SUBMODE.CHARTER_TAXI]: 'charterTaxi',
  [TAXI_SUBMODE.COMMUNAL_TAXI]: 'communalTaxi',
  [TAXI_SUBMODE.WATER_TAXI]: 'waterTaxi',
};

export enum DAY_OF_WEEK {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
}

export enum BOOKING_LIMIT_TYPE {
  NONE = 'none',
  TIME = 'time',
  PERIOD = 'period',
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

export enum FLEXIBLE_STOP_AREA_TYPE {
  UNRESTRICTED_ROAD_NETWORK = 'UnrestrictedRoadNetwork',
  UNRESTRICTED_PUBLIC_TRANSPORT_AREAS = 'UnrestrictedPublicTransportAreas',
}

export const bookingAccessMessages: Record<BOOKING_ACCESS, keyof MessagesKey> =
  {
    [BOOKING_ACCESS.PUBLIC]: 'bookingAccessPublic',
    [BOOKING_ACCESS.AUTHORISED_PUBLIC]: 'bookingAccessAuthorisedPublic',
    [BOOKING_ACCESS.STAFF]: 'bookingAccessStaff',
  };

export const bookingTimeMessages: Record<PURCHASE_WHEN, keyof MessagesKey> = {
  [PURCHASE_WHEN.DAY_OF_TRAVEL_ONLY]: 'purchaseWhenDayOfTravelOnly',
  [PURCHASE_WHEN.UNTIL_PREVIOUS_DAY]: 'purchaseWhenUntilPreviousDay',
  [PURCHASE_WHEN.ADVANCE_AND_DAY_OF_TRAVEL]:
    'purchaseWhenAdvanceAndDayOfTravel',
};

export const bookingMethodMessages: Record<BOOKING_METHOD, keyof MessagesKey> =
  {
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

export const flexibleStopAreaTypeMessages: Record<
  FLEXIBLE_STOP_AREA_TYPE,
  keyof MessagesKey
> = {
  [FLEXIBLE_STOP_AREA_TYPE.UNRESTRICTED_ROAD_NETWORK]:
    'flexibleStopAreaTypeUnrestrictedRoadNetwork',
  [FLEXIBLE_STOP_AREA_TYPE.UNRESTRICTED_PUBLIC_TRANSPORT_AREAS]:
    'flexibleStopAreaTypeUnrestrictedPublicTransportAreas',
};
