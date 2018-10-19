export const getProvidersQuery = `
  query GetProviders {
    providers {
      name,
      code
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

export const getFlexibleLinesQuery = `
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

export const getFlexibleStopPlacesQuery = `
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
