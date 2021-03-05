import React, { useRef, useState } from 'react';
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
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
type Props = {
  notices?: Notice[];
  setNotices: (notices: Notice[]) => void;
};

export default ({ notices = [], setNotices }: Props) => {
  const [newNotice, setNewNotice] = useState<Notice>({ text: '' });
  const newNoticeInputEl = useRef<HTMLTextAreaElement>(null);
  const { formatMessage } = useSelector(selectIntl);

  const addNotice = () => {
    if (newNotice.text !== '') {
      setNotices([...notices, newNotice]);
      setNewNotice({ text: '' });
    }
  };

  const updateNotice = (index: number, text: string) => {
    if (text === '') {
      removeNotice(index);
      newNoticeInputEl?.current?.focus();
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
          <TableRow hover>
            <EditableCell className="notices-editable-cell">
              <TextArea
                className="notices-text-area"
                ref={newNoticeInputEl}
                label={formatMessage('newNoticeLabel')}
                value={newNotice.text}
                onChange={(e: any) => setNewNotice({ text: e.target.value })}
              />
            </EditableCell>
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
