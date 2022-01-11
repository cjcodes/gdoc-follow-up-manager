import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { ReactComponent as DeletedIcon } from 'bootstrap-icons/icons/trash-fill.svg';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

type Props = {
  commentId: string;
  fileId: string;
  removeComment: Function;
};

const DeleteButton: React.FC<Props & React.HTMLAttributes<HTMLDivElement>> =
  function ({ commentId, fileId, removeComment, className }) {
    const [loading, setLoading] = useState(false);
    const [confirming, setConfirming] = useState(false);

    const handleClick = async function () {
      if (!confirming) {
        setConfirming(true);
      } else {
        setConfirming(false);
        setLoading(true);

        await gapi.client.drive.comments.delete({
          fileId,
          commentId,
        });
        setLoading(false);
        removeComment(commentId);
      }
    };

    const cancelDelete = function () {
      setConfirming(false);
    };

    return (
      <>
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip>Delete Comment</Tooltip>}
        >
          <Button
            variant="outline-danger"
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
            ) : (
              <>
                <DeletedIcon height="1.5em" width="1em" />{' '}
                {confirming ? 'Confirm?' : ''}
              </>
            )}
          </Button>
        </OverlayTrigger>
        {confirming ? (
          <Button variant="outline-secondary" onClick={cancelDelete}>
            Cancel
          </Button>
        ) : (
          ''
        )}
      </>
    );
  };

export default DeleteButton;
