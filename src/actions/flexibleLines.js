import { UttuQuery } from '../graphql';
import { getFlexibleLinesQuery } from '../graphql/uttu/queries';
import { FlexibleLine } from '../model';
import { showErrorNotification } from '../components/Notification/actions';

export const REQUEST_FLEXIBLE_LINES = 'REQUEST_FLEXIBLE_LINES';
export const RECEIVE_FLEXIBLE_LINES = 'RECEIVE_FLEXIBLE_LINES';

const requestFlexibleLines = () => ({
  type: REQUEST_FLEXIBLE_LINES
});

const receiveFlexibleLines = lines => ({
  type: RECEIVE_FLEXIBLE_LINES,
  lines
});

export const CREATE_FLEXIBLE_LINE = 'CREATE_FLEXIBLE_LINE';

export const createFlexibleLine = fl => ({
  type: CREATE_FLEXIBLE_LINE,
  fl
});

export const loadFlexibleLines = () => (dispatch, getState) => {
  dispatch(requestFlexibleLines());

  const activeProvider = getState().providers.active;
  return UttuQuery(activeProvider, getFlexibleLinesQuery, {})
    .then(data => {
      const flexibleLines = data.flexibleLines.map(fl => new FlexibleLine(fl));
      dispatch(receiveFlexibleLines(flexibleLines));
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
