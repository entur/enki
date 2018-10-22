import { UttuQuery } from '../graphql';
import { getFlexibleLinesQuery } from '../graphql/uttu/queries';
import { FlexibleLine } from '../model';
import { showErrorNotification } from '../components/Notification/actions';

export const REQUEST_LINES = 'REQUEST_LINES';
export const RECEIVE_LINES = 'RECEIVE_LINES';

const requestLines = () => ({
  type: REQUEST_LINES
});

const receiveLines = lines => ({
  type: RECEIVE_LINES,
  lines
});

export const CREATE_FLEXIBLE_LINE = 'CREATE_FLEXIBLE_LINE';

export const createFlexibleLine = fl => ({
  type: CREATE_FLEXIBLE_LINE,
  fl
});

export const loadFlexibleLines = () => (dispatch, getState) => {
  dispatch(requestLines());

  const activeProvider = getState().providers.active;
  return UttuQuery(activeProvider, getFlexibleLinesQuery, {})
    .then(data => {
      const flexibleLines = data.flexibleLines.map(fl => new FlexibleLine(fl));
      dispatch(receiveLines(flexibleLines));
      return Promise.resolve(flexibleLines);
    })
    .catch(() => {
      dispatch(
        showErrorNotification(
          'Hente linjer',
          'En feil oppstod under hentingen av linjene.'
        )
      );
      return Promise.reject();
    });
};
