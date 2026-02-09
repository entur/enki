import { graphql, http, HttpResponse } from 'msw';
import {
  mockProviders,
  mockNetworks,
  mockBrandings,
  mockDayTypes,
  mockFlexibleStopPlaces,
  mockFlexibleLines,
  mockLines,
  mockExports,
  mockOrganisations,
  mockStopPlaces,
  quayToStopPlace,
} from './mockData';

// Helper to add __typename to a DayType and its nested assignments/periods.
function addDayTypeTypenames(
  dt: (typeof mockLines)[number]['journeyPatterns'][number]['serviceJourneys'][number]['dayTypes'][number],
) {
  return {
    __typename: 'DayType',
    ...dt,
    dayTypeAssignments: dt.dayTypeAssignments.map((dta) => ({
      __typename: 'DayTypeAssignment',
      ...dta,
      operatingPeriod: dta.operatingPeriod
        ? { __typename: 'OperatingPeriod', ...dta.operatingPeriod }
        : null,
    })),
  };
}

// Helper to add __typename to a ServiceJourney and its nested entities.
function addServiceJourneyTypenames(
  sj: (typeof mockLines)[number]['journeyPatterns'][number]['serviceJourneys'][number],
) {
  return {
    __typename: 'ServiceJourney',
    ...sj,
    notices: (sj.notices as Record<string, unknown>[]).map((n) => ({
      __typename: 'Notice',
      ...n,
    })),
    passingTimes: sj.passingTimes.map((pt) => ({
      __typename: 'TimetabledPassingTime',
      ...pt,
    })),
    dayTypes: sj.dayTypes.map(addDayTypeTypenames),
  };
}

// Add __typename fields to line data so Apollo Client's InMemoryCache
// can properly normalize and return nested objects like journeyPatterns.
function addLineTypenames(line: (typeof mockLines)[number]) {
  return {
    __typename: 'Line',
    ...line,
    notices: line.notices.map((n: Record<string, unknown>) => ({
      __typename: 'Notice',
      ...n,
    })),
    network: line.network ? { __typename: 'Network', ...line.network } : null,
    branding: line.branding
      ? { __typename: 'Branding', ...line.branding }
      : null,
    journeyPatterns: line.journeyPatterns.map((jp) => ({
      __typename: 'JourneyPattern',
      ...jp,
      pointsInSequence: jp.pointsInSequence.map((pis) => ({
        __typename: 'StopPointInJourneyPattern',
        ...pis,
        destinationDisplay: pis.destinationDisplay
          ? { __typename: 'DestinationDisplay', ...pis.destinationDisplay }
          : null,
      })),
      serviceJourneys: jp.serviceJourneys.map(addServiceJourneyTypenames),
    })),
  };
}

// Helper to map a service journey for export (dayTypes → dayTypeAssignments chain).
function mapServiceJourneyForExport(sj: { dayTypes: typeof mockDayTypes }) {
  return {
    dayTypes: sj.dayTypes.map((dt) => ({
      dayTypeAssignments: dt.dayTypeAssignments.map((dta) => ({
        operatingPeriod: dta.operatingPeriod,
      })),
    })),
  };
}

// Helper to map journey patterns for export responses.
function mapJourneyPatterns(
  jps: { serviceJourneys: { dayTypes: typeof mockDayTypes }[] }[],
) {
  return jps.map((jp) => ({
    serviceJourneys: jp.serviceJourneys.map(mapServiceJourneyForExport),
  }));
}

export const handlers = [
  // ---------- Bootstrap & config ----------
  http.get('*/bootstrap.json', () => {
    return HttpResponse.json({
      uttuApiUrl: 'https://other/bar',
      xmlnsUrlPrefix: 'http://www.rutebanken.org/ns/',
      disableAuthentication: true,
      routeGeometrySupportedVehicleModes: ['bus', 'coach', 'taxi', 'water'],
      exportGenerateServiceLinksDefault: false,
      exportIncludeDatedServiceJourneysDefault: false,
      optionalPublicCodeOnLine: true,
      sandboxFeatures: {
        JourneyPatternStopPointMap: true,
      },
      extPath: 'Entur',
    });
  }),

  // ---------- GraphQL Queries ----------

  graphql.query('GetUserContext', () => {
    return HttpResponse.json({
      data: {
        userContext: {
          preferredName: 'Mock Bruker',
          isAdmin: true,
          providers: mockProviders.map(({ name, code }) => ({ name, code })),
        },
      },
    });
  }),

  graphql.query('GetProviders', () => {
    return HttpResponse.json({
      data: {
        providers: mockProviders,
      },
    });
  }),

  graphql.query('GetNetworks', () => {
    return HttpResponse.json({
      data: {
        networks: mockNetworks.map(
          ({ id, name, description, privateCode, authorityRef }) => ({
            id,
            name,
            description,
            privateCode,
            authorityRef,
          }),
        ),
      },
    });
  }),

  graphql.query('GetNetworkById', ({ variables }) => {
    const network = mockNetworks.find((n) => n.id === variables.id);
    return HttpResponse.json({
      data: {
        network: network ?? null,
      },
    });
  }),

  graphql.query('GetBrandings', () => {
    return HttpResponse.json({
      data: {
        brandings: mockBrandings.map(
          ({ id, name, shortName, description, url, imageUrl }) => ({
            id,
            name,
            shortName,
            description,
            url,
            imageUrl,
          }),
        ),
      },
    });
  }),

  graphql.query('GetBrandingById', ({ variables }) => {
    const branding = mockBrandings.find((b) => b.id === variables.id);
    return HttpResponse.json({
      data: {
        branding: branding ?? null,
      },
    });
  }),

  graphql.query('getFlexibleLines', () => {
    return HttpResponse.json({
      data: {
        flexibleLines: mockFlexibleLines.map(
          ({
            id,
            name,
            description,
            privateCode,
            publicCode,
            flexibleLineType,
            operatorRef,
            network,
            branding,
            journeyPatterns,
          }) => ({
            id,
            name,
            description,
            privateCode,
            publicCode,
            flexibleLineType,
            operatorRef,
            network,
            branding,
            journeyPatterns: journeyPatterns.map((jp) => ({
              pointsInSequence: jp.pointsInSequence.map((p) => ({
                flexibleStopPlace: p.flexibleStopPlace
                  ? { id: p.flexibleStopPlace.id }
                  : null,
              })),
            })),
          }),
        ),
      },
    });
  }),

  graphql.query('GetFlexibleLineById', ({ variables }) => {
    const line = mockFlexibleLines.find((l) => l.id === variables.id);
    return HttpResponse.json({
      data: {
        flexibleLine: line ?? null,
      },
    });
  }),

  graphql.query('GetLines', () => {
    return HttpResponse.json({
      data: {
        lines: mockLines.map(
          ({ id, name, privateCode, publicCode, operatorRef }) => ({
            id,
            name,
            privateCode,
            publicCode,
            operatorRef,
          }),
        ),
      },
    });
  }),

  graphql.query('GetlineById', ({ variables }) => {
    const line = mockLines.find((l) => l.id === variables.id);
    return HttpResponse.json({
      data: {
        line: line ?? null,
      },
    });
  }),

  graphql.query('LineEditorQuery', ({ variables }) => {
    const rawLine = variables.includeLine
      ? (mockLines.find((l) => l.id === variables.id) ?? null)
      : undefined;
    const line = rawLine ? addLineTypenames(rawLine) : rawLine;
    return HttpResponse.json({
      data: {
        ...(variables.includeLine ? { line } : {}),
        networks: mockNetworks.map(
          ({ id, name, description, privateCode, authorityRef }) => ({
            __typename: 'Network' as const,
            id,
            name,
            description,
            privateCode,
            authorityRef,
          }),
        ),
        brandings: mockBrandings.map(
          ({ id, name, shortName, description, url, imageUrl }) => ({
            __typename: 'Branding' as const,
            id,
            name,
            shortName,
            description,
            url,
            imageUrl,
          }),
        ),
      },
    });
  }),

  graphql.query('GetFlexibleStopPlaces', () => {
    return HttpResponse.json({
      data: {
        flexibleStopPlaces: mockFlexibleStopPlaces.map(
          ({
            id,
            name,
            description,
            privateCode,
            keyValues,
            flexibleAreas,
          }) => ({
            id,
            name,
            description,
            privateCode,
            keyValues,
            flexibleAreas: flexibleAreas.map((fa) => ({
              keyValues: fa.keyValues,
              polygon: fa.polygon,
            })),
          }),
        ),
      },
    });
  }),

  graphql.query('GetFlexibleStopPlaceById', ({ variables }) => {
    const fsp = mockFlexibleStopPlaces.find((f) => f.id === variables.id);
    return HttpResponse.json({
      data: {
        flexibleStopPlace: fsp ?? null,
      },
    });
  }),

  graphql.query('GetExports', () => {
    return HttpResponse.json({
      data: {
        exports: mockExports.map(
          ({
            id,
            version,
            created,
            createdBy,
            changed,
            changedBy,
            name,
            exportStatus,
            dryRun,
            downloadUrl,
          }) => ({
            id,
            version,
            created,
            createdBy,
            changed,
            changedBy,
            name,
            exportStatus,
            dryRun,
            downloadUrl,
          }),
        ),
      },
    });
  }),

  graphql.query('GetExportById', ({ variables }) => {
    const exp = mockExports.find((e) => e.id === variables.id);
    return HttpResponse.json({
      data: {
        export: exp ?? null,
      },
    });
  }),

  graphql.query('GetDayTypes', () => {
    return HttpResponse.json({
      data: {
        dayTypes: mockDayTypes,
      },
    });
  }),

  graphql.query('GetDayTypesByIds', ({ variables }) => {
    const ids: string[] = variables.ids ?? [];
    const found = mockDayTypes.filter((dt) => ids.includes(dt.id));
    return HttpResponse.json({
      data: {
        dayTypesByIds: found,
      },
    });
  }),

  graphql.query('GetLinesForExport', () => {
    return HttpResponse.json({
      data: {
        lines: mockLines.map((l) => ({
          id: l.id,
          name: l.name,
          journeyPatterns: mapJourneyPatterns(l.journeyPatterns),
        })),
        flexibleLines: mockFlexibleLines.map((l) => ({
          id: l.id,
          name: l.name,
          journeyPatterns: mapJourneyPatterns(l.journeyPatterns),
        })),
      },
    });
  }),

  graphql.query('OrganisationsQuery', () => {
    return HttpResponse.json({
      data: {
        organisations: mockOrganisations,
      },
    });
  }),

  graphql.query('StopPlacesQuery', () => {
    return HttpResponse.json({
      data: {
        stopPlaces: mockStopPlaces,
      },
    });
  }),

  graphql.query('StopPlaceByQuayRefQuery', ({ variables }) => {
    const stopPlace = quayToStopPlace[variables.id] ?? null;
    return HttpResponse.json({
      data: {
        stopPlaceByQuayRef: stopPlace,
      },
    });
  }),

  graphql.query('ServiceLinkQuery', ({ variables }) => {
    const fromSp = quayToStopPlace[variables.quayRefFrom];
    const toSp = quayToStopPlace[variables.quayRefTo];
    if (!fromSp || !toSp) {
      return HttpResponse.json({
        data: { serviceLink: null },
      });
    }
    const fromLoc = fromSp.centroid.location;
    const toLoc = toSp.centroid.location;
    return HttpResponse.json({
      data: {
        serviceLink: {
          quayRefFrom: variables.quayRefFrom,
          quayRefTo: variables.quayRefTo,
          serviceLinkRef: `TST:ServiceLink:${variables.quayRefFrom}_${variables.quayRefTo}`,
          routeGeometry: {
            distance: 1500,
            coordinates: [
              [fromLoc.longitude, fromLoc.latitude],
              [toLoc.longitude, toLoc.latitude],
            ],
          },
        },
      },
    });
  }),

  // ---------- GraphQL Mutations ----------

  graphql.mutation('MutateNetwork', ({ variables }) => {
    const id = variables.input?.id || 'TST:Network:new';
    return HttpResponse.json({
      data: { mutateNetwork: { id } },
    });
  }),

  graphql.mutation('DeleteNetwork', ({ variables }) => {
    return HttpResponse.json({
      data: { deleteNetwork: { id: variables.id } },
    });
  }),

  graphql.mutation('MutateBranding', ({ variables }) => {
    const id = variables.input?.id || 'TST:Branding:new';
    return HttpResponse.json({
      data: { mutateBranding: { id } },
    });
  }),

  graphql.mutation('DeleteBranding', ({ variables }) => {
    return HttpResponse.json({
      data: { deleteBranding: { id: variables.id } },
    });
  }),

  graphql.mutation('MutateFlexibleLine', ({ variables }) => {
    const id = variables.input?.id || 'TST:FlexibleLine:new';
    return HttpResponse.json({
      data: { mutateFlexibleLine: { id } },
    });
  }),

  graphql.mutation('DeleteFlexibleLine', ({ variables }) => {
    return HttpResponse.json({
      data: { deleteFlexibleLine: { id: variables.id } },
    });
  }),

  graphql.mutation('MutateFlexibleStopPlace', ({ variables }) => {
    const id = variables.input?.id || 'TST:FlexibleStopPlace:new';
    return HttpResponse.json({
      data: { mutateFlexibleStopPlace: { id } },
    });
  }),

  graphql.mutation('DeleteFlexibleStopPlace', ({ variables }) => {
    return HttpResponse.json({
      data: { deleteFlexibleStopPlace: { id: variables.id } },
    });
  }),

  graphql.mutation('MutateExport', ({ variables }) => {
    const id = variables.input?.id || 'TST:Export:new';
    return HttpResponse.json({
      data: { export: { id } },
    });
  }),

  graphql.mutation('Mutateline', ({ variables }) => {
    const id = variables.input?.id || 'TST:Line:new';
    return HttpResponse.json({
      data: { mutateLine: { id } },
    });
  }),

  graphql.mutation('Deleteline', ({ variables }) => {
    return HttpResponse.json({
      data: { deleteLine: { id: variables.id } },
    });
  }),

  graphql.mutation('SaveCodespace', ({ variables }) => {
    return HttpResponse.json({
      data: { mutateCodespace: { xmlns: variables.input?.xmlns || 'TST' } },
    });
  }),

  graphql.mutation('SaveProvider', ({ variables }) => {
    return HttpResponse.json({
      data: { mutateProvider: { code: variables.input?.code || 'TST' } },
    });
  }),

  graphql.mutation('MutateDayType', ({ variables }) => {
    const id = variables.input?.id || 'TST:DayType:new';
    return HttpResponse.json({
      data: {
        mutateDayType: {
          id,
          daysOfWeek: variables.input?.daysOfWeek || [],
          dayTypeAssignments: variables.input?.dayTypeAssignments || [],
          name: variables.input?.name || null,
          changed: new Date().toISOString(),
        },
      },
    });
  }),

  graphql.mutation('DeleteDayType', ({ variables }) => {
    return HttpResponse.json({
      data: { deleteDayType: { id: variables.id } },
    });
  }),

  graphql.mutation('DeleteDayTypes', ({ variables }) => {
    const ids: string[] = variables.ids || [];
    return HttpResponse.json({
      data: { deleteDayTypes: ids.map((id: string) => ({ id })) },
    });
  }),

  graphql.mutation('MigrateLine', ({ variables }) => {
    return HttpResponse.json({
      data: {
        migrateLine: {
          id: variables.input?.lineId || 'TST:Line:migrated',
        },
      },
    });
  }),

  // ---------- HTTP handlers ----------

  // Export file download
  http.get('*/export/*/download', () => {
    const content = new Blob(['<mock-netex-export />'], {
      type: 'application/zip',
    });
    return new HttpResponse(content, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="export.zip"',
      },
    });
  }),
];
