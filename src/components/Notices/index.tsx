import React, { useState } from 'react';
import { Tooltip } from '@entur/tooltip';
import { IconButton, TertiaryButton } from '@entur/button';
import { AddIcon, DeleteIcon, EditIcon } from '@entur/icons';
import { DataCell, Table, TableBody, TableRow } from '@entur/table';
import { TextArea } from '@entur/form';
import { Heading4 } from '@entur/typography';
import Notice from 'model/Notice';

type Props = {
  notices?: Notice[];
  setNotices: (notices: Notice[]) => void;
};

export default ({ notices = [], setNotices }: Props) => {
  const [editNotice, setEditNotice] = useState<Notice | null>(null);
  const [newNotice, setNewNotice] = useState<Notice>({ text: '' });

  const addNotice = () => {
    setNotices([...notices, newNotice]);
    setNewNotice({ text: '' });
  };

  const startEditing = (index: number) => {
    const copy = notices.slice();
    const notice = copy.splice(index, 1);
    if (notice.length) {
      setNotices(copy);
      setEditNotice(notice[0]);
    }
  };

  const finishEditing = () => {
    setNotices([...notices, editNotice!]);
    setEditNotice(null);
  };

  const removeNotice = (index: number) => {
    const copy = notices.slice();
    copy.splice(index, 1);
    setNotices([...copy]);
  };

  return (
    <section className="notices">
      <Heading4>Notices</Heading4>
      <Table spacing="small" fixed>
        <TableBody>
          {notices?.map((notice, i) => (
            <TableRow key={window.btoa(escape(notice.text + i))}>
              <DataCell>{notice.text}</DataCell>
              <DataCell align="right">
                <Tooltip placement="bottom" content="Rediger">
                  <IconButton
                    style={{ display: 'inline-block' }}
                    onClick={() => startEditing(i)}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip placement="bottom" content="Slett">
                  <IconButton
                    style={{ display: 'inline-block' }}
                    onClick={() => removeNotice(i)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </DataCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {editNotice ? (
        <>
          <TextArea
            style={{ marginTop: '1rem' }}
            value={editNotice.text}
            onChange={(e: any) => setEditNotice({ text: e.target.value })}
          />
          <TertiaryButton
            style={{ marginTop: '1rem' }}
            onClick={() => finishEditing()}
          >
            <AddIcon /> Oppdater notice
          </TertiaryButton>
        </>
      ) : (
        <>
          <TextArea
            label="Skriv en ny notice her"
            style={{ marginTop: '1rem' }}
            value={newNotice.text}
            onChange={(e: any) => setNewNotice({ text: e.target.value })}
          />
          <TertiaryButton
            style={{ marginTop: '1rem' }}
            onClick={() => addNotice()}
          >
            <AddIcon /> Legg til notice
          </TertiaryButton>
        </>
      )}
    </section>
  );
};
