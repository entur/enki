import { SecondaryButton, SuccessButton } from '@entur/button';
import { AddIcon } from '@entur/icons';
import {
  DataCell,
  HeaderCell,
  Table,
  TableBody,
  TableHead,
  TableRow,
} from '@entur/table';
import { Heading1 } from '@entur/typography';
import { deleteBrandingById, loadBrandings } from 'actions/brandings';
import Loading from 'components/Loading';
import { Branding } from 'model/Branding';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import ConfirmDialog from '../../components/ConfirmDialog';
import DeleteButton from '../../components/DeleteButton/DeleteButton';
import './styles.scss';

const Brandings = () => {
  const navigate = useNavigate();
  const [showDeleteDialogue, setShowDeleteDialogue] = useState<boolean>(false);
  const [selectedBranding, setSelectedBranding] = useState<
    Branding | undefined
  >(undefined);
  const { formatMessage } = useIntl();
  const activeProviderCode = useAppSelector(
    (state) => state.userContext.activeProviderCode,
  );
  const organisations = useAppSelector((state) => state.organisations);
  const brandings = useAppSelector((state) => state.brandings);
  const dispatch = useDispatch<any>();

  useEffect(() => {
    dispatch(loadBrandings());
  }, [dispatch, activeProviderCode]);

  const handleOnRowClick = useCallback(
    (id: string) => {
      navigate(`/brandings/edit/${id}`);
    },
    [history],
  );

  const RenderTableRows = ({ brandingList }: { brandingList: Branding[] }) => (
    <>
      {brandingList.map((b) => (
        <TableRow
          key={b.id}
          onClick={() => handleOnRowClick(b.id!)}
          title={b.description}
        >
          <DataCell>{b.name}</DataCell>
          <DataCell>{b.shortName}</DataCell>
          <DataCell>{b.description}</DataCell>
          <DataCell>{b.url}</DataCell>
          <DataCell>{b.imageUrl}</DataCell>
          <DataCell className="delete-row-cell">
            <DeleteButton
              onClick={() => {
                setSelectedBranding(b);
                setShowDeleteDialogue(true);
              }}
              title=""
              thin
            />
          </DataCell>
        </TableRow>
      ))}
      {brandingList.length === 0 && (
        <TableRow className="row-no-brandings disabled">
          <DataCell colSpan={3}>
            {formatMessage({ id: 'brandingsNoBrandingsFoundText' })}
          </DataCell>
        </TableRow>
      )}
    </>
  );

  return (
    <div className="brandings">
      <Heading1>{formatMessage({ id: 'brandingsHeaderText' })}</Heading1>

      <SecondaryButton className="create" as={Link} to="/brandings/create">
        <AddIcon />
        {formatMessage({ id: 'editorCreateBrandingHeaderText' })}
      </SecondaryButton>

      <Loading
        text={formatMessage({ id: 'brandingsLoadingBrandingsText' })}
        isLoading={!brandings || !organisations}
      >
        <>
          <Table>
            <TableHead>
              <TableRow>
                <HeaderCell>
                  {formatMessage({ id: 'brandingsNameTableHeaderLabel' })}
                </HeaderCell>
                <HeaderCell>
                  {formatMessage({ id: 'brandingsShortNameTableHeaderLabel' })}
                </HeaderCell>
                <HeaderCell>
                  {formatMessage({
                    id: 'brandingsDescriptionTableHeaderLabel',
                  })}
                </HeaderCell>
                <HeaderCell>
                  {formatMessage({ id: 'brandingsUrlTableHeaderLabel' })}
                </HeaderCell>
                <HeaderCell>
                  {formatMessage({ id: 'brandingsImageUrlTableHeaderLabel' })}
                </HeaderCell>
                <HeaderCell>{''}</HeaderCell>
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
                <SecondaryButton
                  key="no"
                  onClick={() => {
                    setSelectedBranding(undefined);
                    setShowDeleteDialogue(false);
                  }}
                >
                  {formatMessage({ id: 'no' })}
                </SecondaryButton>,
                <SuccessButton
                  key="yes"
                  onClick={() => {
                    dispatch(deleteBrandingById(selectedBranding?.id))
                      .then(() => {
                        setSelectedBranding(undefined);
                        setShowDeleteDialogue(false);
                      })
                      .then(() => dispatch(loadBrandings()));
                  }}
                >
                  {formatMessage({ id: 'yes' })}
                </SuccessButton>,
              ]}
            />
          )}
        </>
      </Loading>
    </div>
  );
};

export default Brandings;
