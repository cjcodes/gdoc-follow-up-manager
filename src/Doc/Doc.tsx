import React from 'react';
import Card from 'react-bootstrap/Card';
import CommentList from './CommentList';
import Col from 'react-bootstrap/Col';
import { ActiveCommentType } from './DocList';
import { ReactComponent as ExternalIcon } from 'bootstrap-icons/icons/box-arrow-up-right.svg';

type Props = {
  doc: gapi.client.drive.File;
  setActiveComment: React.Dispatch<
    React.SetStateAction<ActiveCommentType | undefined>
  >;
};

const Doc: React.FC<Props> = ({ doc, setActiveComment }) => {
  return (
    <Col lg={4} className="mb-4">
      <Card className="h-100">
        <Card.Header className="bg-primary text-light">
          <a
            href={doc.webViewLink}
            target="_blank"
            rel="noreferrer"
            className="text-light fw-bold text-decoration-none d-flex align-items-center"
          >
            {doc.name}
            <ExternalIcon width="12" height="12" className="ms-2" />
          </a>
        </Card.Header>
        {/* <Card.Body className="flex-grow-0">Doc details</Card.Body> */}
        <CommentList doc={doc} setActiveComment={setActiveComment} />
      </Card>
    </Col>
  );
};

export default Doc;
