import {
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Notice from 'model/Notice';
import { FormatMessage } from 'i18n';
type Props = {
  notices?: Notice[];
  setNotices: (notices: Notice[]) => void;
  formatMessage: FormatMessage;
};

export default ({ notices = [], setNotices, formatMessage }: Props) => {
  const addNotice = () => {
    setNotices([...notices, { text: '' }]);
  };

  const updateNotice = (index: number, text: string) => {
    if (text === '') {
      removeNotice(index);
    } else {
      const copy = notices.slice();
      copy[index] = { text };
      setNotices(copy);
    }
  };

  const removeNotice = (index: number) => {
    const copy = notices.slice();
    copy.splice(index, 1);
    setNotices([...copy]);
  };

  return (
    <Box component="section" sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 1 }}>
        {formatMessage({ id: 'noticesHeader' })}
      </Typography>
      <Stack spacing={2}>
        {notices?.map((notice, i) => (
          <Box
            key={'' + i}
            sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}
          >
            <TextField
              multiline
              rows={2}
              label=""
              onBlur={() => notice.text === '' && removeNotice(i)}
              value={notice.text}
              onChange={(e: any) => updateNotice(i, e.target.value)}
              fullWidth
            />
            <Tooltip
              placement="bottom"
              title={formatMessage({ id: 'deleteNoticeTooltip' })}
            >
              <IconButton onClick={() => removeNotice(i)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        ))}
        <Button
          variant="text"
          startIcon={<AddIcon />}
          onClick={() => addNotice()}
          sx={{ alignSelf: 'flex-start' }}
        >
          {formatMessage({ id: 'addNoticeTooltip' })}
        </Button>
      </Stack>
    </Box>
  );
};
