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
  query GetFlexibleLines {
    flexibleLines {
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
      flexibleLineType,
      operatorRef,
      bookingArrangement { ...bookingArrangementFields },
      network {
        id
      },
      journeyPatterns {
        name,
        description,
        privateCode,
        pointsInSequence {
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
          name,
          description,
          privateCode,
          publicCode,
          operatorRef,
          bookingArrangement { ...bookingArrangementFields },
          passingTimes {
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
    latestBookingTime,
    minimumBookingPeriod
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
