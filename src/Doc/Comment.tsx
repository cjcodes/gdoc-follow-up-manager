import dayjs from 'dayjs';
import React, { useState } from 'react';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ResolveButton from '../Buttons/ResolveButton';
import DeleteButton from '../Buttons/DeleteButton';
import { LOCALIZED_DATE_FORMAT } from '../constants';
import { ViewButton } from '../Buttons';

type Props = {
  comment: gapi.client.drive.Comment;
  doc: gapi.client.drive.File;
  removeComment: (commentId: string) => void;
};

const Comment: React.FC<Props> = function ({ comment, doc, removeComment }) {
  const [hovered, setHovered] = useState(false);

  const str = comment?.quotedFileContent?.value || '';
  const ellipsisStart = str.charAt(0) === str.charAt(0).toLowerCase();
  const ellipsisEnd = /\w/.test(str.charAt(str.length - 1));

  return (
    <div
      className="w-100 my-3"
      onMouseEnter={(e) => setHovered(true)}
      onMouseLeave={(e) => setHovered(false)}
      role="button"
    >
      <div className="d-flex align-items-center mb-4">
        <div>
          <img
            referrerPolicy="no-referrer"
            src={`https:${comment.author?.photoLink}`}
            alt={comment.author?.displayName}
            width={32}
            height={32}
            className="rounded-circle"
          />
        </div>
        <div className="ms-2 me-auto lh-1">
          <div className="fw-bold">{comment.author?.displayName}</div>
          <small className="text-muted">
            {dayjs(comment.createdTime).format(LOCALIZED_DATE_FORMAT)}
          </small>
        </div>

        <ButtonGroup
          aria-label="Comment actions"
          size="sm"
          className="ms-auto"
          style={{ visibility: !hovered ? 'hidden' : 'visible' }}
        >
          {comment.author?.me && (
            <DeleteButton
              commentId={comment.id!}
              fileId={doc.id!}
              removeComment={removeComment}
            />
          )}
          <ViewButton docLink={doc.webViewLink!} commentId={comment.id!} />
          <ResolveButton commentId={comment.id!} fileId={doc.id!} />
        </ButtonGroup>
      </div>
      <div
        className="bg-warning p-2 mb-3 position-relative rounded"
        style={{ '--bs-bg-opacity': 0.25 }}
      >
        <div className="position-absolute top-0 start-50 translate-middle bg-light lh-1 pb-1 px-2 rounded-pill shadow">
          <small>Quoted text</small>
        </div>
        {ellipsisStart && '...'}
        {comment?.quotedFileContent?.value}
        {ellipsisEnd && '...'}
      </div>
      <div dangerouslySetInnerHTML={{ __html: comment.htmlContent || '' }} />
    </div>
  );
};

export default Comment;
