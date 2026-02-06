import Add from '@mui/icons-material/Add';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { deleteBrandingById, loadBrandings } from 'actions/brandings';
import Loading from 'components/Loading';
import { Branding } from 'model/Branding';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import ConfirmDialog from '../../components/ConfirmDialog';
import DeleteButton from '../../components/DeleteButton/DeleteButton';
import './styles.scss';

const Brandings = () => {
  const navigate = useNavigate();
  const [showDeleteDialogue, setShowDeleteDialogue] = useState<boolean>(false);
  const [selectedBranding, setSelectedBranding] = useState<
    Branding | undefined
  >(undefined);
  const intl = useIntl();
  const { formatMessage } = intl;
  const activeProviderCode = useAppSelector(
    (state) => state.userContext.activeProviderCode,
  );
  const organisations = useAppSelector((state) => state.organisations);
  const brandings = useAppSelector((state) => state.brandings);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadBrandings(intl));
  }, [dispatch, activeProviderCode, intl]);

  const handleOnRowClick = useCallback(
    (id: string) => {
      navigate(`/brandings/edit/${id}`);
    },
    [navigate],
  );

  const RenderTableRows = ({ brandingList }: { brandingList: Branding[] }) => (
    <>
      {brandingList.map((b) => (
        <TableRow
          key={b.id}
          onClick={() => handleOnRowClick(b.id!)}
          title={b.description}
        >
          <TableCell>{b.name}</TableCell>
          <TableCell>{b.shortName}</TableCell>
          <TableCell>{b.description}</TableCell>
          <TableCell>{b.url}</TableCell>
          <TableCell>{b.imageUrl}</TableCell>
          <TableCell className="delete-row-cell">
            <DeleteButton
              onClick={() => {
                setSelectedBranding(b);
                setShowDeleteDialogue(true);
              }}
              title=""
              thin
            />
          </TableCell>
        </TableRow>
      ))}
      {brandingList.length === 0 && (
        <TableRow className="row-no-brandings disabled">
          <TableCell colSpan={3}>
            {formatMessage({ id: 'brandingsNoBrandingsFoundText' })}
          </TableCell>
        </TableRow>
      )}
    </>
  );

  return (
    <div className="brandings">
      <Typography variant="h1">
        {formatMessage({ id: 'brandingsHeaderText' })}
      </Typography>

      <Button
        variant="outlined"
        className="create"
        component={Link}
        to="/brandings/create"
      >
        <Add />
        {formatMessage({ id: 'editorCreateBrandingHeaderText' })}
      </Button>

      <Loading
        text={formatMessage({ id: 'brandingsLoadingBrandingsText' })}
        isLoading={!brandings || !organisations}
      >
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  {formatMessage({ id: 'brandingsNameTableHeaderLabel' })}
                </TableCell>
                <TableCell>
                  {formatMessage({ id: 'brandingsShortNameTableHeaderLabel' })}
                </TableCell>
                <TableCell>
                  {formatMessage({
                    id: 'brandingsDescriptionTableHeaderLabel',
                  })}
                </TableCell>
                <TableCell>
                  {formatMessage({ id: 'brandingsUrlTableHeaderLabel' })}
                </TableCell>
                <TableCell>
                  {formatMessage({ id: 'brandingsImageUrlTableHeaderLabel' })}
                </TableCell>
                <TableCell>{''}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <RenderTableRows brandingList={brandings!} />
            </TableBody>
          </Table>
          {showDeleteDialogue && selectedBranding && (
            <ConfirmDialog
              isOpen
              onDismiss={() => {
                setSelectedBranding(undefined);
                setShowDeleteDialogue(false);
              }}
              title={formatMessage({
                id: 'editorDeleteBrandingConfirmationDialogTitle',
              })}
              message={formatMessage({
                id: 'editorDeleteBrandingConfirmationDialogMessage',
              })}
              buttons={[
                <Button
                  variant="outlined"
                  key="no"
                  onClick={() => {
                    setSelectedBranding(undefined);
                    setShowDeleteDialogue(false);
                  }}
                >
                  {formatMessage({ id: 'no' })}
                </Button>,
                <Button
                  variant="contained"
                  color="success"
                  key="yes"
                  onClick={() => {
                    dispatch(deleteBrandingById(selectedBranding?.id, intl))
                      .then(() => {
                        setSelectedBranding(undefined);
                        setShowDeleteDialogue(false);
                      })
                      .then(() => dispatch(loadBrandings(intl)));
                  }}
                >
                  {formatMessage({ id: 'yes' })}
                </Button>,
              ]}
            />
          )}
        </>
      </Loading>
    </div>
  );
};

export default Brandings;
