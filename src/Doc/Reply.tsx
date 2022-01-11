import React from 'react';
import { Dayjs } from 'dayjs';
import { LOCALIZED_DATE_FORMAT } from '../constants';

type Props = {
  htmlContent?: string;
  author: gapi.client.drive.User;
  timestamp: Dayjs;
};

const Reply: React.FC<Props> = function ({
  htmlContent,
  author,
  timestamp,
  children,
}) {
  return (
    <div className="py-3">
      <div className="d-flex align-items-center mb-3">
        <div>
          <img
            referrerPolicy="no-referrer"
            src={`https:${author.photoLink}`}
            alt={author.displayName}
            width={32}
            height={32}
            className="rounded-circle"
          />
        </div>
        <div className="ms-2 me-auto lh-1">
          <div className="fw-bold">{author.displayName}</div>
          <small className="text-muted">
            {timestamp.format(LOCALIZED_DATE_FORMAT)}
          </small>
        </div>
      </div>
      {htmlContent ? (
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      ) : (
        <div>{children}</div>
      )}
    </div>
  );
};

export default Reply;
