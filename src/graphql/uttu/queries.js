export const getProviders = `
  query GetProviders {
    providers {
      name,
      code
    }
  }
`;

export const getNetworks = `
  query GetNetworks {
    networks {
      id,
      name,
      description,
      authorityRef
    }
  }
`;

export const getFlexibleLines = `
  query GetFlexibleLines {
    flexibleLines {
      publicCode,
      network { id },
      operatorRef,
      journeyPatterns {
        pointsInSequence {
          flexibleStopPlace { id },
          destinationDisplay { frontText }
        },
        serviceJourneys {
          passingTimes {
            latestArrivalTime,
            earliestDepartureTime
          },
          dayTypes {
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

export const getFlexibleStopPlaces = `
  query GetFlexibleStopPlaces {
    flexibleStopPlaces {
      name,
      description,
      flexibleArea {
        polygon {
          type,
          coordinates
        }
      }
    }
  }
`;
