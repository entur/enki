import React from 'react';
import { Tooltip } from '@entur/tooltip';
import { IconButton } from '@entur/button';
import { AddIcon, DeleteIcon } from '@entur/icons';
import {
  DataCell,
  EditableCell,
  Table,
  TableBody,
  TableRow,
} from '@entur/table';
import { TextArea } from '@entur/form';
import { Heading4 } from '@entur/typography';
import Notice from 'model/Notice';
import './styles.scss';
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
    <section className="notices">
      <Heading4>{formatMessage('noticesHeader')}</Heading4>
      <Table fixed>
        <TableBody>
          {notices?.map((notice, i) => (
            <TableRow key={'' + i} hover className="notices-row">
              <EditableCell className="notices-editable-cell">
                <TextArea
                  onBlur={() => notice.text === '' && removeNotice(i)}
                  className="notices-text-area"
                  value={notice.text}
                  onChange={(e: any) => updateNotice(i, e.target.value)}
                />
              </EditableCell>
              <DataCell align="right">
                <Tooltip
                  placement="bottom"
                  content={formatMessage('deleteNoticeTooltip')}
                >
                  <IconButton
                    className="notices-icon-button"
                    onClick={() => removeNotice(i)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </DataCell>
            </TableRow>
          ))}
          <TableRow hover onClick={() => addNotice()}>
            <DataCell></DataCell>
            <DataCell align="right">
              <Tooltip
                placement="bottom"
                content={formatMessage('addNoticeTooltip')}
              >
                <IconButton
                  className="notices-icon-button"
                  onClick={() => addNotice()}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
            </DataCell>
          </TableRow>
        </TableBody>
      </Table>
    </section>
  );
};
