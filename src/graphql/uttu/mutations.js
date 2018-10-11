export const mutateNetwork = `
  mutation MutateNetwork($input: NetworkInput!) {
    mutateNetwork(input: $input) { id }
  }
`;

export const deleteNetwork = `
  mutation DeleteNetwork($id: ID!) {
    deleteNetwork(id: $id)
  }
`;

export const mutateFlexibleLine = `
  mutation MutateFlexibleLine($input: FlexibleLineInput!) {
    mutateFlexibleLine(input: $input) { id }
  }
`;

export const deleteFlexibleLine = `
  mutation DeleteFlexibleLine($id: ID!) {
    deleteFlexibleLine(id: $id)
  }
`;

export const mutateFlexibleStopPlace = `
  mutation MutateFlexibleStopPlace($input: FlexibleStopPlaceInput!) {
    mutateFlexibleStopPlace(input: $input) { id }
  }
`;

export const deleteFlexibleStopPlace = `
  mutation DeleteFlexibleLine($id: ID!) {
    deleteFlexibleLine(id: $id)
  }
`;
