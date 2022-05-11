import { gql } from '@apollo/client';

export const networkMutation = `
  mutation MutateNetwork($input: NetworkInput!) {
    mutateNetwork(input: $input) { id }
  }
`;

export const deleteNetwork = `
  mutation DeleteNetwork($id: ID!) {
    deleteNetwork(id: $id) { id }
  }
`;

export const flexibleLineMutation = `
  mutation MutateFlexibleLine($input: FlexibleLineInput!) {
    mutateFlexibleLine(input: $input) { id }
  }
`;

export const deleteFlexibleLine = `
  mutation DeleteFlexibleLine($id: ID!) {
    deleteFlexibleLine(id: $id) { id }
  }
`;

export const flexibleStopPlaceMutation = `
  mutation MutateFlexibleStopPlace($input: FlexibleStopPlaceInput!) {
    mutateFlexibleStopPlace(input: $input) { id }
  }
`;

export const deleteFlexibleStopPlace = `
  mutation DeleteFlexibleStopPlace($id: ID!) {
    deleteFlexibleStopPlace(id: $id) { id }
  }
`;

export const exportMutation = `
  mutation MutateExport($input: ExportInput!) {
    export(input: $input) { id }
  }
`;

export const lineMutation = `
  mutation Mutateline($input: LineInput!) {
    mutateLine(input: $input) { id }
  }
`;

export const deleteline = `
  mutation Deleteline($id: ID!) {
    deleteLine(id: $id) { id }
  }
`;

export const MUTATE_LINE = gql`
  mutation Mutateline($input: LineInput!) {
    mutateLine(input: $input) {
      id
    }
  }
`;

export const DELETE_LINE = gql`
  mutation Deleteline($id: ID!) {
    deleteLine(id: $id) {
      id
    }
  }
`;

export const MUTATE_DAY_TYPE = gql`
  mutation MutateDayType($input: DayTypeInput!) {
    mutateDayType(input: $input) {
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
      name
      changed
    }
  }
`;

export const DELETE_DAY_TYPE = gql`
  mutation DeleteDayType($id: ID!) {
    deleteDayType(id: $id) {
      id
    }
  }
`;
