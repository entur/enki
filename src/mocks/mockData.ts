// Centralized mock data for MSW browser mock layer
// Uses realistic Norwegian transit data with NeTEx-style IDs

export const mockProviders = [
  {
    name: 'Ruter Flex',
    code: 'RUT',
    codespace: {
      xmlns: 'RUT',
      xmlnsUrl: 'http://www.rutebanken.org/ns/rut',
    },
  },
  {
    name: 'AtB Flex',
    code: 'ATB',
    codespace: {
      xmlns: 'ATB',
      xmlnsUrl: 'http://www.rutebanken.org/ns/atb',
    },
  },
  {
    name: 'Test provider',
    code: 'TST',
    codespace: {
      xmlns: 'TST',
      xmlnsUrl: 'http://www.rutebanken.org/ns/tst',
    },
  },
];

export const mockNetworks = [
  {
    id: 'TST:Network:1',
    version: '1',
    created: '2025-01-15T10:00:00Z',
    createdBy: 'mock-user',
    changed: '2025-01-15T10:00:00Z',
    changedBy: 'mock-user',
    name: 'Ruter Flex',
    description: 'Fleksible linjer i Oslo-området',
    privateCode: 'RUTFLEX',
    authorityRef: 'TST:Authority:1',
  },
  {
    id: 'TST:Network:2',
    version: '1',
    created: '2025-02-01T08:30:00Z',
    createdBy: 'mock-user',
    changed: '2025-02-01T08:30:00Z',
    changedBy: 'mock-user',
    name: 'AtB Flex',
    description: 'Fleksible linjer i Trøndelag',
    privateCode: 'ATBFLEX',
    authorityRef: 'TST:Authority:2',
  },
];

export const mockBrandings = [
  {
    id: 'TST:Branding:1',
    version: '1',
    created: '2025-01-10T09:00:00Z',
    createdBy: 'mock-user',
    changed: '2025-01-10T09:00:00Z',
    changedBy: 'mock-user',
    name: 'Ruter Flex',
    shortName: 'RFlex',
    description: 'Branding for Ruter fleksible linjer',
    url: 'https://ruter.no/flex',
    imageUrl: 'https://ruter.no/flex/logo.png',
  },
  {
    id: 'TST:Branding:2',
    version: '1',
    created: '2025-01-12T11:00:00Z',
    createdBy: 'mock-user',
    changed: '2025-01-12T11:00:00Z',
    changedBy: 'mock-user',
    name: 'AtB Flex',
    shortName: 'AFlex',
    description: 'Branding for AtB fleksible linjer',
    url: 'https://atb.no/flex',
    imageUrl: null,
  },
];

export const mockDayTypes = [
  {
    id: 'TST:DayType:1',
    changed: '2025-01-15T10:00:00Z',
    name: 'Hverdager',
    numberOfServiceJourneys: 2,
    daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    dayTypeAssignments: [
      {
        isAvailable: true,
        date: null,
        operatingPeriod: {
          fromDate: '2025-01-01',
          toDate: '2025-12-31',
        },
      },
    ],
  },
  {
    id: 'TST:DayType:2',
    changed: '2025-01-15T10:00:00Z',
    name: 'Lørdager',
    numberOfServiceJourneys: 1,
    daysOfWeek: ['saturday'],
    dayTypeAssignments: [
      {
        isAvailable: true,
        date: null,
        operatingPeriod: {
          fromDate: '2025-01-01',
          toDate: '2025-12-31',
        },
      },
    ],
  },
  {
    id: 'TST:DayType:3',
    changed: '2025-01-15T10:00:00Z',
    name: 'Søndager',
    numberOfServiceJourneys: 1,
    daysOfWeek: ['sunday'],
    dayTypeAssignments: [
      {
        isAvailable: true,
        date: null,
        operatingPeriod: {
          fromDate: '2025-06-01',
          toDate: '2025-08-31',
        },
      },
    ],
  },
];

export const mockFlexibleStopPlaces = [
  {
    id: 'TST:FlexibleStopPlace:1',
    version: '1',
    created: '2025-01-10T09:00:00Z',
    createdBy: 'mock-user',
    changed: '2025-01-10T09:00:00Z',
    changedBy: 'mock-user',
    name: 'Oslo Sentrum Sone',
    description: 'Fleksibelt stoppested i Oslo sentrum',
    privateCode: 'OSLOSONE1',
    transportMode: 'bus',
    keyValues: [
      {
        key: 'FlexibleStopAreaType',
        values: ['UnrestrictedRoadNetwork'],
      },
    ],
    flexibleAreas: [
      {
        keyValues: [
          {
            key: 'FlexibleStopAreaType',
            values: ['UnrestrictedRoadNetwork'],
          },
        ],
        polygon: {
          type: 'Polygon',
          coordinates: [
            [
              [10.73, 59.91],
              [10.76, 59.91],
              [10.76, 59.93],
              [10.73, 59.93],
              [10.73, 59.91],
            ],
          ],
        },
      },
    ],
  },
  {
    id: 'TST:FlexibleStopPlace:2',
    version: '1',
    created: '2025-01-12T11:00:00Z',
    createdBy: 'mock-user',
    changed: '2025-01-12T11:00:00Z',
    changedBy: 'mock-user',
    name: 'Grünerløkka Sone',
    description: 'Fleksibelt stoppested på Grünerløkka',
    privateCode: 'GRLSONE1',
    transportMode: 'bus',
    keyValues: [
      {
        key: 'FlexibleStopAreaType',
        values: ['UnrestrictedPublicTransportAreas'],
      },
    ],
    flexibleAreas: [
      {
        keyValues: [
          {
            key: 'FlexibleStopAreaType',
            values: ['UnrestrictedPublicTransportAreas'],
          },
        ],
        polygon: {
          type: 'Polygon',
          coordinates: [
            [
              [10.75, 59.92],
              [10.77, 59.92],
              [10.77, 59.94],
              [10.75, 59.94],
              [10.75, 59.92],
            ],
          ],
        },
      },
    ],
  },
  {
    id: 'TST:FlexibleStopPlace:3',
    version: '1',
    created: '2025-02-01T08:30:00Z',
    createdBy: 'mock-user',
    changed: '2025-02-01T08:30:00Z',
    changedBy: 'mock-user',
    name: 'Bygdøy Sone',
    description: 'Fleksibelt stoppested på Bygdøy',
    privateCode: 'BYGDSONE1',
    transportMode: 'water',
    keyValues: [],
    flexibleAreas: [
      {
        keyValues: [],
        polygon: {
          type: 'Polygon',
          coordinates: [
            [
              [10.67, 59.9],
              [10.7, 59.9],
              [10.7, 59.92],
              [10.67, 59.92],
              [10.67, 59.9],
            ],
          ],
        },
      },
    ],
  },
];

export const mockFlexibleLines = [
  {
    id: 'TST:FlexibleLine:101',
    version: '2',
    created: '2025-01-15T10:00:00Z',
    createdBy: 'mock-user',
    changed: '2025-03-01T14:30:00Z',
    changedBy: 'mock-user',
    name: 'Fleksirute Oslo Sentrum',
    description: 'Bestillingstransport i Oslo sentrum',
    privateCode: 'FLEX101',
    publicCode: 'F101',
    transportMode: 'bus',
    transportSubmode: 'localBus',
    operatorRef: 'TST:Operator:1',
    flexibleLineType: 'flexibleAreasOnly',
    notices: [{ text: 'Bestilles minst 2 timer før avgang' }],
    bookingArrangement: {
      bookingContact: {
        contactPerson: 'Kundeservice',
        phone: '+47 22 22 22 22',
        email: 'flex@ruter.no',
        url: 'https://ruter.no/flex',
        furtherDetails: 'Bestill via app eller telefon',
      },
      bookingNote: 'Bestill minst 2 timer før ønsket avgang',
      bookingMethods: ['callOffice', 'online'],
      bookingAccess: 'public',
      bookWhen: 'advanceAndDayOfTravel',
      buyWhen: ['onReservation'],
      latestBookingTime: '14:00:00',
      minimumBookingPeriod: 'PT2H',
    },
    network: { id: 'TST:Network:1' },
    branding: { id: 'TST:Branding:1' },
    journeyPatterns: [
      {
        id: 'TST:JourneyPattern:1',
        name: 'Oslo Sentrum - Grünerløkka',
        description: 'Fleksirute mellom sentrum og Grünerløkka',
        privateCode: 'JP1',
        pointsInSequence: [
          {
            id: 'TST:StopPointInJourneyPattern:1',
            flexibleStopPlace: {
              id: 'TST:FlexibleStopPlace:1',
              name: 'Oslo Sentrum Sone',
            },
            quayRef: null,
            bookingArrangement: null,
            destinationDisplay: { frontText: 'Grünerløkka' },
            forBoarding: true,
            forAlighting: false,
          },
          {
            id: 'TST:StopPointInJourneyPattern:2',
            flexibleStopPlace: {
              id: 'TST:FlexibleStopPlace:2',
              name: 'Grünerløkka Sone',
            },
            quayRef: null,
            bookingArrangement: null,
            destinationDisplay: null,
            forBoarding: false,
            forAlighting: true,
          },
        ],
        serviceJourneys: [
          {
            id: 'TST:ServiceJourney:1',
            name: 'Morgentur',
            description: 'Morgenavgang Oslo Sentrum - Grünerløkka',
            privateCode: 'SJ1',
            publicCode: 'F101-1',
            operatorRef: 'TST:Operator:1',
            notices: [],
            bookingArrangement: null,
            passingTimes: [
              {
                id: 'TST:TimetabledPassingTime:1',
                arrivalTime: null,
                arrivalDayOffset: 0,
                departureTime: '08:00:00',
                departureDayOffset: 0,
                latestArrivalTime: null,
                latestArrivalDayOffset: 0,
                earliestDepartureTime: '07:30:00',
                earliestDepartureDayOffset: 0,
              },
              {
                id: 'TST:TimetabledPassingTime:2',
                arrivalTime: '08:30:00',
                arrivalDayOffset: 0,
                departureTime: null,
                departureDayOffset: 0,
                latestArrivalTime: '09:00:00',
                latestArrivalDayOffset: 0,
                earliestDepartureTime: null,
                earliestDepartureDayOffset: 0,
              },
            ],
            dayTypes: [mockDayTypes[0]],
          },
          {
            id: 'TST:ServiceJourney:2',
            name: 'Ettermiddagstur',
            description: 'Ettermiddagsavgang Oslo Sentrum - Grünerløkka',
            privateCode: 'SJ2',
            publicCode: 'F101-2',
            operatorRef: 'TST:Operator:1',
            notices: [{ text: 'Ekstra kapasitet på fredager' }],
            bookingArrangement: null,
            passingTimes: [
              {
                id: 'TST:TimetabledPassingTime:3',
                arrivalTime: null,
                arrivalDayOffset: 0,
                departureTime: '15:00:00',
                departureDayOffset: 0,
                latestArrivalTime: null,
                latestArrivalDayOffset: 0,
                earliestDepartureTime: '14:30:00',
                earliestDepartureDayOffset: 0,
              },
              {
                id: 'TST:TimetabledPassingTime:4',
                arrivalTime: '15:30:00',
                arrivalDayOffset: 0,
                departureTime: null,
                departureDayOffset: 0,
                latestArrivalTime: '16:00:00',
                latestArrivalDayOffset: 0,
                earliestDepartureTime: null,
                earliestDepartureDayOffset: 0,
              },
            ],
            dayTypes: [mockDayTypes[0]],
          },
        ],
      },
    ],
  },
  {
    id: 'TST:FlexibleLine:102',
    version: '1',
    created: '2025-02-01T08:30:00Z',
    createdBy: 'mock-user',
    changed: '2025-02-01T08:30:00Z',
    changedBy: 'mock-user',
    name: 'Bygdøy Ferge Flex',
    description: 'Fleksibel fergerute til Bygdøy',
    privateCode: 'FLEX102',
    publicCode: 'F102',
    transportMode: 'water',
    transportSubmode: 'localPassengerFerry',
    operatorRef: 'TST:Operator:2',
    flexibleLineType: 'mixedFlexible',
    notices: [],
    bookingArrangement: null,
    network: { id: 'TST:Network:1' },
    branding: null,
    journeyPatterns: [
      {
        id: 'TST:JourneyPattern:2',
        name: 'Aker Brygge - Bygdøy',
        description: 'Fleksirute mellom Aker Brygge og Bygdøy',
        privateCode: 'JP2',
        pointsInSequence: [
          {
            id: 'TST:StopPointInJourneyPattern:3',
            flexibleStopPlace: null,
            quayRef: 'NSR:Quay:1001',
            bookingArrangement: null,
            destinationDisplay: { frontText: 'Bygdøy' },
            forBoarding: true,
            forAlighting: false,
          },
          {
            id: 'TST:StopPointInJourneyPattern:4',
            flexibleStopPlace: {
              id: 'TST:FlexibleStopPlace:3',
              name: 'Bygdøy Sone',
            },
            quayRef: null,
            bookingArrangement: null,
            destinationDisplay: null,
            forBoarding: false,
            forAlighting: true,
          },
        ],
        serviceJourneys: [
          {
            id: 'TST:ServiceJourney:3',
            name: 'Sommertur',
            description: 'Sommeravgang Aker Brygge - Bygdøy',
            privateCode: 'SJ3',
            publicCode: 'F102-1',
            operatorRef: 'TST:Operator:2',
            notices: [],
            bookingArrangement: null,
            passingTimes: [
              {
                id: 'TST:TimetabledPassingTime:5',
                arrivalTime: null,
                arrivalDayOffset: 0,
                departureTime: '10:00:00',
                departureDayOffset: 0,
                latestArrivalTime: null,
                latestArrivalDayOffset: 0,
                earliestDepartureTime: null,
                earliestDepartureDayOffset: 0,
              },
              {
                id: 'TST:TimetabledPassingTime:6',
                arrivalTime: '10:20:00',
                arrivalDayOffset: 0,
                departureTime: null,
                departureDayOffset: 0,
                latestArrivalTime: null,
                latestArrivalDayOffset: 0,
                earliestDepartureTime: null,
                earliestDepartureDayOffset: 0,
              },
            ],
            dayTypes: [mockDayTypes[1]],
          },
        ],
      },
    ],
  },
];

export const mockLines = [
  {
    id: 'TST:Line:201',
    version: '1',
    created: '2025-01-20T12:00:00Z',
    createdBy: 'mock-user',
    changed: '2025-01-20T12:00:00Z',
    changedBy: 'mock-user',
    name: 'Linje 201 Majorstuen - Tøyen',
    description: 'Fast linje mellom Majorstuen og Tøyen',
    privateCode: 'L201',
    publicCode: '201',
    transportMode: 'bus',
    transportSubmode: 'localBus',
    operatorRef: 'TST:Operator:1',
    notices: [],
    network: { id: 'TST:Network:1', authorityRef: 'TST:Authority:1' },
    branding: { id: 'TST:Branding:1' },
    journeyPatterns: [
      {
        id: 'TST:JourneyPattern:3',
        name: 'Majorstuen - Tøyen',
        description: 'Via Stortinget',
        privateCode: 'JP3',
        pointsInSequence: [
          {
            id: 'TST:StopPointInJourneyPattern:5',
            flexibleStopPlace: null,
            quayRef: 'NSR:Quay:2001',
            destinationDisplay: { frontText: 'Tøyen' },
            forBoarding: true,
            forAlighting: false,
          },
          {
            id: 'TST:StopPointInJourneyPattern:6',
            flexibleStopPlace: null,
            quayRef: 'NSR:Quay:2002',
            destinationDisplay: { frontText: 'Tøyen' },
            forBoarding: true,
            forAlighting: true,
          },
          {
            id: 'TST:StopPointInJourneyPattern:7',
            flexibleStopPlace: null,
            quayRef: 'NSR:Quay:2003',
            destinationDisplay: null,
            forBoarding: false,
            forAlighting: true,
          },
        ],
        serviceJourneys: [
          {
            id: 'TST:ServiceJourney:4',
            name: 'Morgenrute',
            description: 'Morgenavgang',
            privateCode: 'SJ4',
            publicCode: '201-1',
            operatorRef: 'TST:Operator:1',
            notices: [],
            passingTimes: [
              {
                id: 'TST:TimetabledPassingTime:7',
                arrivalTime: null,
                arrivalDayOffset: 0,
                departureTime: '07:15:00',
                departureDayOffset: 0,
                latestArrivalTime: null,
                latestArrivalDayOffset: 0,
                earliestDepartureTime: null,
                earliestDepartureDayOffset: 0,
              },
              {
                id: 'TST:TimetabledPassingTime:8',
                arrivalTime: '07:25:00',
                arrivalDayOffset: 0,
                departureTime: '07:26:00',
                departureDayOffset: 0,
                latestArrivalTime: null,
                latestArrivalDayOffset: 0,
                earliestDepartureTime: null,
                earliestDepartureDayOffset: 0,
              },
              {
                id: 'TST:TimetabledPassingTime:9',
                arrivalTime: '07:40:00',
                arrivalDayOffset: 0,
                departureTime: null,
                departureDayOffset: 0,
                latestArrivalTime: null,
                latestArrivalDayOffset: 0,
                earliestDepartureTime: null,
                earliestDepartureDayOffset: 0,
              },
            ],
            dayTypes: [mockDayTypes[0]],
          },
        ],
      },
    ],
  },
  {
    id: 'TST:Line:202',
    version: '1',
    created: '2025-02-10T09:00:00Z',
    createdBy: 'mock-user',
    changed: '2025-02-10T09:00:00Z',
    changedBy: 'mock-user',
    name: 'Linje 202 Jernbanetorget - Lysaker',
    description: 'Fast linje mellom Jernbanetorget og Lysaker',
    privateCode: 'L202',
    publicCode: '202',
    transportMode: 'bus',
    transportSubmode: 'expressBus',
    operatorRef: 'TST:Operator:1',
    notices: [],
    network: { id: 'TST:Network:1', authorityRef: 'TST:Authority:1' },
    branding: null,
    journeyPatterns: [
      {
        id: 'TST:JourneyPattern:4',
        name: 'Jernbanetorget - Lysaker',
        description: 'Ekspressrute',
        privateCode: 'JP4',
        pointsInSequence: [
          {
            id: 'TST:StopPointInJourneyPattern:8',
            flexibleStopPlace: null,
            quayRef: 'NSR:Quay:3001',
            destinationDisplay: { frontText: 'Lysaker' },
            forBoarding: true,
            forAlighting: false,
          },
          {
            id: 'TST:StopPointInJourneyPattern:9',
            flexibleStopPlace: null,
            quayRef: 'NSR:Quay:3002',
            destinationDisplay: null,
            forBoarding: false,
            forAlighting: true,
          },
        ],
        serviceJourneys: [
          {
            id: 'TST:ServiceJourney:5',
            name: 'Ekspressavgang',
            description: null,
            privateCode: 'SJ5',
            publicCode: '202-1',
            operatorRef: 'TST:Operator:1',
            notices: [],
            passingTimes: [
              {
                id: 'TST:TimetabledPassingTime:10',
                arrivalTime: null,
                arrivalDayOffset: 0,
                departureTime: '08:00:00',
                departureDayOffset: 0,
                latestArrivalTime: null,
                latestArrivalDayOffset: 0,
                earliestDepartureTime: null,
                earliestDepartureDayOffset: 0,
              },
              {
                id: 'TST:TimetabledPassingTime:11',
                arrivalTime: '08:25:00',
                arrivalDayOffset: 0,
                departureTime: null,
                departureDayOffset: 0,
                latestArrivalTime: null,
                latestArrivalDayOffset: 0,
                earliestDepartureTime: null,
                earliestDepartureDayOffset: 0,
              },
            ],
            dayTypes: [mockDayTypes[0]],
          },
        ],
      },
    ],
  },
];

export const mockExports = [
  {
    id: 'TST:Export:1',
    version: '1',
    created: '2025-03-01T12:00:00Z',
    createdBy: 'mock-user',
    changed: '2025-03-01T12:00:00Z',
    changedBy: 'mock-user',
    name: 'Mars 2025 eksport',
    exportStatus: 'success',
    dryRun: false,
    generateServiceLinks: true,
    includeDatedServiceJourneys: false,
    downloadUrl: 'export/TST:Export:1/download',
    messages: [{ severity: 'info', message: 'Export completed successfully' }],
  },
  {
    id: 'TST:Export:2',
    version: '1',
    created: '2025-03-10T09:00:00Z',
    createdBy: 'mock-user',
    changed: '2025-03-10T09:15:00Z',
    changedBy: 'mock-user',
    name: 'Test eksport (dry run)',
    exportStatus: 'success',
    dryRun: true,
    generateServiceLinks: false,
    includeDatedServiceJourneys: false,
    downloadUrl: null,
    messages: [
      { severity: 'info', message: 'Dry run completed' },
      {
        severity: 'warn',
        message: 'Line TST:Line:202 has no day types assigned',
      },
    ],
  },
  {
    id: 'TST:Export:3',
    version: '1',
    created: '2025-03-15T14:00:00Z',
    createdBy: 'mock-user',
    changed: '2025-03-15T14:05:00Z',
    changedBy: 'mock-user',
    name: 'Feilet eksport',
    exportStatus: 'failed',
    dryRun: false,
    generateServiceLinks: true,
    includeDatedServiceJourneys: true,
    downloadUrl: null,
    messages: [
      {
        severity: 'error',
        message: 'Validation failed: missing required fields',
      },
    ],
  },
];

export const mockOrganisations = [
  {
    id: 'TST:Authority:1',
    name: { value: 'Ruter AS' },
    type: 'authority',
  },
  {
    id: 'TST:Authority:2',
    name: { value: 'AtB AS' },
    type: 'authority',
  },
  {
    id: 'TST:Operator:1',
    name: { value: 'Vy Buss AS' },
    type: 'operator',
  },
  {
    id: 'TST:Operator:2',
    name: { value: 'Boreal Transport' },
    type: 'operator',
  },
];

export const mockStopPlaces = [
  {
    id: 'NSR:StopPlace:1',
    name: { value: 'Oslo Bussterminal' },
    transportMode: 'bus',
    centroid: { location: { longitude: 10.7597, latitude: 59.9116 } },
    quays: [
      {
        id: 'NSR:Quay:1001',
        name: { value: 'Plattform 1' },
        publicCode: '1',
        centroid: { location: { longitude: 10.7597, latitude: 59.9116 } },
      },
      {
        id: 'NSR:Quay:1002',
        name: { value: 'Plattform 2' },
        publicCode: '2',
        centroid: { location: { longitude: 10.7599, latitude: 59.9117 } },
      },
    ],
  },
  {
    id: 'NSR:StopPlace:2',
    name: { value: 'Majorstuen' },
    transportMode: 'bus',
    centroid: { location: { longitude: 10.7128, latitude: 59.9306 } },
    quays: [
      {
        id: 'NSR:Quay:2001',
        name: { value: 'Plattform A' },
        publicCode: 'A',
        centroid: { location: { longitude: 10.7128, latitude: 59.9306 } },
      },
    ],
  },
  {
    id: 'NSR:StopPlace:3',
    name: { value: 'Stortinget' },
    transportMode: 'bus',
    centroid: { location: { longitude: 10.7372, latitude: 59.9127 } },
    quays: [
      {
        id: 'NSR:Quay:2002',
        name: { value: 'Stortinget' },
        publicCode: '1',
        centroid: { location: { longitude: 10.7372, latitude: 59.9127 } },
      },
    ],
  },
  {
    id: 'NSR:StopPlace:4',
    name: { value: 'Tøyen' },
    transportMode: 'bus',
    centroid: { location: { longitude: 10.7716, latitude: 59.9139 } },
    quays: [
      {
        id: 'NSR:Quay:2003',
        name: { value: 'Tøyen' },
        publicCode: '1',
        centroid: { location: { longitude: 10.7716, latitude: 59.9139 } },
      },
    ],
  },
  {
    id: 'NSR:StopPlace:5',
    name: { value: 'Jernbanetorget' },
    transportMode: 'bus',
    centroid: { location: { longitude: 10.7522, latitude: 59.9113 } },
    quays: [
      {
        id: 'NSR:Quay:3001',
        name: { value: 'Jernbanetorget' },
        publicCode: '1',
        centroid: { location: { longitude: 10.7522, latitude: 59.9113 } },
      },
    ],
  },
  {
    id: 'NSR:StopPlace:6',
    name: { value: 'Lysaker' },
    transportMode: 'bus',
    centroid: { location: { longitude: 10.6354, latitude: 59.9113 } },
    quays: [
      {
        id: 'NSR:Quay:3002',
        name: { value: 'Lysaker stasjon' },
        publicCode: '1',
        centroid: { location: { longitude: 10.6354, latitude: 59.9113 } },
      },
    ],
  },
];

// Map quay IDs to their parent stop places for StopPlaceByQuayRef
export const quayToStopPlace: Record<string, (typeof mockStopPlaces)[number]> =
  {};
for (const sp of mockStopPlaces) {
  for (const quay of sp.quays) {
    quayToStopPlace[quay.id] = sp;
  }
}
