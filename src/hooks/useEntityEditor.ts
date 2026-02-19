import { useCallback, useEffect, useState } from 'react';
import { IntlShape, useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import { GlobalState } from 'reducers';
import { useAppDispatch, useAppSelector } from 'store/hooks';

type EntityEditorConfig<T> = {
  entitySelector: (
    params: Record<string, string | undefined>,
  ) => (state: GlobalState) => T | undefined;
  defaultEntity: T;
  loadById: (id: string, intl: IntlShape) => any;
  save: (entity: T, intl: IntlShape) => any;
  loadAll: (intl: IntlShape) => any;
  deleteById: (id: string | undefined, intl: IntlShape) => any;
  navigateTo: string;
};

export const useEntityEditor = <T extends { id?: string; name: string }>({
  entitySelector,
  defaultEntity,
  loadById,
  save,
  loadAll,
  deleteById,
  navigateTo,
}: EntityEditorConfig<T>) => {
  const params = useParams();
  const navigate = useNavigate();
  const intl = useIntl();
  const { formatMessage } = intl;
  const dispatch = useAppDispatch();

  const currentEntity = useAppSelector(entitySelector(params)) ?? defaultEntity;

  const [entity, setEntity] = useState<T>(currentEntity);
  const [isSaving, setSaving] = useState(false);
  const [isDeleting, setDeleting] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [saveClicked, setSaveClicked] = useState(false);

  const dispatchLoad = useCallback(() => {
    if (params.id) {
      dispatch(loadById(params.id, intl)).catch(() => navigate(navigateTo));
    }
  }, [dispatch, params.id, intl, navigate, loadById, navigateTo]);

  useEffect(() => {
    dispatchLoad();
  }, [dispatchLoad]);

  useEffect(() => {
    if (params.id) {
      setEntity(currentEntity);
    }
  }, [currentEntity, params.id]);

  const onFieldChange = (field: keyof T, value: string) => {
    setEntity({ ...entity, [field]: value });
  };

  const handleSave = (isValid: boolean) => {
    if (isValid) {
      setSaving(true);
      dispatch(save(entity, intl))
        .then(() => dispatch(loadAll(intl)))
        .then(() => navigate(navigateTo))
        .finally(() => setSaving(false));
    }
    setSaveClicked(true);
  };

  const handleDelete = () => {
    setDeleteDialogOpen(false);
    setDeleting(true);
    dispatch(deleteById(entity?.id, intl)).then(() => navigate(navigateTo));
  };

  return {
    entity,
    setEntity,
    onFieldChange,
    isSaving,
    isDeleting,
    saveClicked,
    isDeleteDialogOpen,
    setDeleteDialogOpen,
    handleSave,
    handleDelete,
    params,
    dispatch,
    intl,
    formatMessage,
  };
};
