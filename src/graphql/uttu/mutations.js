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
