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

export const getLinesQuery = `
  query getLines {
    lines {
      id,
      name,
      description,
      privateCode,
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
      fromDate,
      toDate,
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
      fromDate,
      toDate,
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
  query LineEditorQuery($id: ID!) {
    line(id: $id) {
      ...LineEditorPageLine
    }
    networks {
      ...LineEditorPageNetworks
    }
  }
  ${LineEditorPage.fragments.line}
  ${LineEditorPage.fragments.networks}
`;
