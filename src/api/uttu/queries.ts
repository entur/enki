import { gql } from '@apollo/client';

export const getProvidersQuery = `
  query GetProviders {
    providers {
      name,
      code,
      codespace {
        xmlns
      }
    }
  }
`;

export const getNetworksQuery = `
  query GetNetworks {
    networks {
      id,
      name,
      description,
      privateCode,
      authorityRef
    }
  }
`;

export const getNetworkByIdQuery = `
  query GetNetworkById($id:ID!) {
    network(id: $id) {
      id,
      version,
      created,
      createdBy,
      changed,
      changedBy,
      name,
      description,
      privateCode,
      authorityRef
    }
  }
`;

export const getFlexibleLinesQuery = `
query getFlexibleLines {
  flexibleLines {
    id,
    name,
    description,
    privateCode,
    flexibleLineType,
    operatorRef,
    network {
      id
    },
    journeyPatterns {
      pointsInSequence {
        flexibleStopPlace {
          id
        }
      }
    }
  }
}
`;

export const getFlexibleLineByIdQuery = `
  query GetFlexibleLineById($id:ID!) {
    flexibleLine(id: $id) {
      id,
      version,
      created,
      createdBy,
      changed,
      changedBy,
      name,
      description,
      privateCode,
      publicCode,
      transportMode,
      transportSubmode,
      operatorRef,
      flexibleLineType,
      notices { text }
      bookingArrangement { ...bookingArrangementFields },
      network {
        id
      },
      journeyPatterns {
        id,
        name,
        description,
        privateCode,
        pointsInSequence {
          id,
          flexibleStopPlace {
            id
            name
          },
          quayRef,
          bookingArrangement { ...bookingArrangementFields },
          destinationDisplay {
            frontText
          },
          forBoarding,
          forAlighting
        },
        serviceJourneys {
          id,
          name,
          description,
          privateCode,
          publicCode,
          operatorRef,
          notices { text }
          bookingArrangement { ...bookingArrangementFields },
          passingTimes {
            id,
            arrivalTime,
            arrivalDayOffset,
            departureTime,
            departureDayOffset,
            latestArrivalTime,
            latestArrivalDayOffset,
            earliestDepartureTime,
            earliestDepartureDayOffset
          },
          dayTypes {
            id,
            daysOfWeek,
            dayTypeAssignments {
              isAvailable,
              date,
              operatingPeriod {
                fromDate,
                toDate
              }
            }
          }
        }
      }
    }
  }

  fragment bookingArrangementFields on BookingArrangement {
    bookingContact {
      contactPerson,
      phone,
      email,
      url,
      furtherDetails
    },
    bookingNote,
    bookingMethods,
    bookingAccess,
    bookWhen,
    buyWhen,
    latestBookingTime,
    minimumBookingPeriod
  }
`;

export const getlineByIdQuery = `
  query GetlineById($id:ID!) {
    line(id: $id) {
      id,
      version,
      created,
      createdBy,
      changed,
      changedBy,
      name,
      description,
      privateCode,
      publicCode,
      transportMode,
      transportSubmode,
      operatorRef,
      notices { text }
      network {
        id
      },
      journeyPatterns {
        id,
        name,
        description,
        privateCode,
        pointsInSequence {
          id,
          flexibleStopPlace {
            id
          },
          quayRef,
          destinationDisplay {
            frontText
          },
          forBoarding,
          forAlighting
        },
        serviceJourneys {
          id,
          name,
          description,
          privateCode,
          publicCode,
          operatorRef,
          notices { text }
          passingTimes {
            id,
            arrivalTime,
            arrivalDayOffset,
            departureTime,
            departureDayOffset,
            latestArrivalTime,
            latestArrivalDayOffset,
            earliestDepartureTime,
            earliestDepartureDayOffset
          },
          dayTypes {
            id,
            daysOfWeek,
            dayTypeAssignments {
              isAvailable,
              date,
              operatingPeriod {
                fromDate,
                toDate
              }
            }
          }
        }
      }
    }
  }
`;

export const getFlexibleStopPlacesQuery = `
  query GetFlexibleStopPlaces {
    flexibleStopPlaces {
      id,
      name,
      description,
      privateCode,
      keyValues {
        key
        values
      }
      flexibleArea {
        polygon {
          coordinates
        }
      }
    }
  }
`;

export const getFlexibleStopPlaceByIdQuery = `
  query GetFlexibleStopPlaceById($id:ID!) {
    flexibleStopPlace(id: $id) {
      id,
      version,
      created,
      createdBy,
      changed,
      changedBy,
      name,
      description,
      privateCode,
      transportMode,
      keyValues {
        key
        values
      }
      flexibleArea {
        polygon {
          type,
          coordinates
        }
      }
    }
  }
`;

export const getExportsQuery = `
  query GetExports($historicDays:Long) {
    exports(historicDays: $historicDays) {
      id,
      version,
      created,
      createdBy,
      changed,
      changedBy,
      name,
      exportStatus,
      dryRun,
      downloadUrl
    }
  }
`;

export const getExportByIdQuery = `
  query GetExportById($id:ID!) {
    export(id: $id) {
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
      messages {
        severity,
        message
      }
    }
  }
`;

export const GET_LINES = gql`
  query GetLines {
    lines {
      id
      name
      privateCode
      operatorRef
    }
  }
`;

const LineEditorPage = {
  fragments: {
    line: gql`
      fragment LineEditorPageLine on Line {
        id
        version
        created
        createdBy
        changed
        changedBy
        name
        description
        privateCode
        publicCode
        transportMode
        transportSubmode
        operatorRef
        notices {
          text
        }
        network {
          id
          authorityRef
        }
        journeyPatterns {
          id
          name
          description
          privateCode
          pointsInSequence {
            id
            flexibleStopPlace {
              id
            }
            quayRef
            destinationDisplay {
              frontText
            }
            forBoarding
            forAlighting
          }
          serviceJourneys {
            id
            name
            description
            privateCode
            publicCode
            operatorRef
            notices {
              text
            }
            passingTimes {
              id
              arrivalTime
              arrivalDayOffset
              departureTime
              departureDayOffset
              latestArrivalTime
              latestArrivalDayOffset
              earliestDepartureTime
              earliestDepartureDayOffset
            }
            dayTypes {
              id
              daysOfWeek
              dayTypeAssignments {
                isAvailable
                date
                operatingPeriod {
                  fromDate
                  toDate
                }
              }
            }
          }
        }
      }
    `,
    networks: gql`
      fragment LineEditorPageNetworks on Network {
        id
        name
        description
        privateCode
        authorityRef
      }
    `,
  },
};

export const LINE_EDITOR_QUERY = gql`
  query LineEditorQuery($id: ID!, $includeLine: Boolean!) {
    line(id: $id) @include(if: $includeLine) {
      ...LineEditorPageLine
    }
    networks {
      ...LineEditorPageNetworks
    }
  }
  ${LineEditorPage.fragments.line}
  ${LineEditorPage.fragments.networks}
`;

const ExportPage = {
  fragments: {
    journeyPatterns: gql`
      fragment ExportPageJourneyPatterns on JourneyPattern {
        serviceJourneys {
          dayTypes {
            dayTypeAssignments {
              operatingPeriod {
                fromDate
                toDate
              }
            }
          }
        }
      }
    `,
  },
};

export const GET_LINES_FOR_EXPORT = gql`
  query GetLinesForExport {
    lines {
      id
      name
      journeyPatterns {
        ...ExportPageJourneyPatterns
      }
    }
    flexibleLines {
      id
      name
      journeyPatterns {
        ...ExportPageJourneyPatterns
      }
    }
  }
  ${ExportPage.fragments.journeyPatterns}
`;
