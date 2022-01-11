import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Button from 'react-bootstrap/Button';
import { ReactComponent as ExternalIcon } from 'bootstrap-icons/icons/box-arrow-up-right.svg';

type Props = {
  docLink: string;
  commentId: string;
};

const ViewButton: React.FC<Props> = function ({ docLink, commentId }) {
  return (
    <OverlayTrigger
      placement="top"
      overlay={<Tooltip>Open in Google Docs</Tooltip>}
    >
      <Button
        variant="outline-secondary"
        as="a"
        href={`${docLink}&disco=${commentId}`}
        target="_blank"
        rel="noreferrer"
      >
        <ExternalIcon height="1.5em" width="1em" />
      </Button>
    </OverlayTrigger>
  );
};

export default ViewButton;
