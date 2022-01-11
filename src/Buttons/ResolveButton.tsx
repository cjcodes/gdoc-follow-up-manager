import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { ReactComponent as CheckIcon } from 'bootstrap-icons/icons/check-square-fill.svg';
import { ReactComponent as UndoIcon } from 'bootstrap-icons/icons/arrow-counterclockwise.svg';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

type Props = {
  commentId: string;
  fileId: string;
  includeLabel?: boolean;
};

const ResolveButton: React.FC<Props & React.HTMLAttributes<HTMLDivElement>> =
  function ({ commentId, fileId, includeLabel = false, className }) {
    const [loading, setLoading] = useState(false);
    const [resolved, setResolved] = useState(false);

    const handleClick = async function () {
      setLoading(true);

      await gapi.client.drive.replies.create({
        fileId,
        commentId,
        fields: 'id',
        resource: {
          action: resolved ? 'reopen' : 'resolve',
        },
      });

      setResolved(!resolved);
      setLoading(false);
    };

    return (
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip>{resolved ? 'Re-open Comment' : 'Resolve Comment'}</Tooltip>
        }
      >
        <Button
          variant="outline-primary"
          disabled={loading}
          onClick={handleClick}
          className={className}
        >
          {loading ? (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            >
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : resolved ? (
            <>
              <UndoIcon height="1.5em" width="1em" />
              {includeLabel && ' Undo'}
            </>
          ) : (
            <>
              <CheckIcon height="1.5em" width="1em" />
              {includeLabel && ' Resolve Comment'}
            </>
          )}
        </Button>
      </OverlayTrigger>
    );
  };

export default ResolveButton;
