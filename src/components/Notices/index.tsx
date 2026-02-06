import {
  IconButton,
  TextField,
  Tooltip,
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
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
    <section>
      <Typography variant="h4">
        {formatMessage({ id: 'noticesHeader' })}
      </Typography>
      <Table>
        <TableBody>
          {notices?.map((notice, i) => (
            <TableRow key={'' + i} hover>
              <TableCell sx={{ width: '90%' }}>
                <TextField
                  multiline
                  rows={2}
                  label=""
                  onBlur={() => notice.text === '' && removeNotice(i)}
                  value={notice.text}
                  onChange={(e: any) => updateNotice(i, e.target.value)}
                  fullWidth
                />
              </TableCell>
              <TableCell align="right">
                <Tooltip
                  placement="bottom"
                  title={formatMessage({ id: 'deleteNoticeTooltip' })}
                >
                  <IconButton onClick={() => removeNotice(i)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
          <TableRow hover onClick={() => addNotice()}>
            <TableCell>{''}</TableCell>
            <TableCell align="right">
              <Tooltip
                placement="bottom"
                title={formatMessage({ id: 'addNoticeTooltip' })}
              >
                <IconButton onClick={() => addNotice()}>
                  <AddIcon />
                </IconButton>
              </Tooltip>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </section>
  );
};
