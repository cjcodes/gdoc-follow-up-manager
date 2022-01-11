import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import Reply from './Reply';
import { ActiveCommentType } from './DocList';
import { ResolveButton } from '../Buttons';
import Form from 'react-bootstrap/Form';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

const API_FIELDS = [
  'id',
  'htmlContent',
  'author',
  'action',
  'createdTime',
].join(',');

type Props = ActiveCommentType & {
  setActiveComment: React.Dispatch<
    React.SetStateAction<ActiveCommentType | undefined>
  >;
};

const CommentDetail: React.FC<Props> = function ({
  doc,
  comment,
  setActiveComment,
}) {
  const [loading, setLoading] = useState(false);
  const [replies, setReplies] = useState<gapi.client.drive.Reply[]>([]);
  const [replyText, setReplyText] = useState('');
  const modalBodyRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (modalBodyRef.current) {
      modalBodyRef.current.scrollTop = modalBodyRef.current?.scrollHeight || 0;
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);

      if (comment && doc) {
        const response = await gapi.client.drive.replies.list({
          commentId: comment.id!,
          fileId: doc.id!,
          fields: `nextPageToken, replies(${API_FIELDS})`,
          pageSize: 100,
        });

        setReplies(response.result.replies || []);
      } else {
        setReplies([]);
      }

      setLoading(false);
    })();
  }, [comment, doc]);

  const addComment = async (
    fileId: string | undefined,
    commentId: string | undefined
  ) => {
    if (fileId && commentId) {
      setLoading(true);

      const response = await gapi.client.drive.replies.create({
        fileId,
        commentId,
        fields: API_FIELDS,
        resource: {
          content: replyText,
        },
      });

      setReplies([...replies, response.result]);
      setLoading(false);
      scrollToBottom();
      setReplyText('');
    }
  };

  return (
    <Modal
      show={!!(comment && doc)}
      onHide={() => setActiveComment({})}
      animation={false}
      scrollable={true}
    >
      <Modal.Header closeButton>
        <Modal.Title>Comment Detail</Modal.Title>
      </Modal.Header>
      <Modal.Body ref={modalBodyRef} className="pt-0">
        <ListGroup variant="flush">
          <ListGroup.Item>
            <Reply
              author={comment?.author!}
              htmlContent={comment?.htmlContent}
              timestamp={dayjs(comment?.createdTime)}
            />
          </ListGroup.Item>
          {replies.map((reply) => {
            if (reply.action) {
              return (
                <ListGroup.Item key={reply.id}>
                  <Reply
                    author={reply?.author!}
                    timestamp={dayjs(reply?.createdTime)}
                  >
                    <span className="fw-light fst-italic">
                      {reply.action === 'resolve'
                        ? 'Marked as done'
                        : 'Re-opened'}
                    </span>
                  </Reply>
                </ListGroup.Item>
              );
            } else {
              return (
                <ListGroup.Item key={reply.id}>
                  <Reply
                    author={reply?.author!}
                    timestamp={dayjs(reply?.createdTime)}
                    htmlContent={reply.htmlContent}
                  />
                </ListGroup.Item>
              );
            }
          })}

          {loading && <ProgressBar animated now={100} />}
          <ListGroup.Item className="py-3">
            <Form.Group>
              <Form.Control
                as="textarea"
                placeholder="Reply (adding others with @ is coming soon)"
                rows={2}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                disabled={loading}
              />
            </Form.Group>
            {replyText !== '' && (
              <ButtonGroup size="sm" className="mt-2">
                <Button
                  variant="primary"
                  onClick={(e) => addComment(doc?.id, comment?.id)}
                >
                  Reply
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={() => setReplyText('')}
                >
                  Cancel
                </Button>
              </ButtonGroup>
            )}
          </ListGroup.Item>
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <ResolveButton
          commentId={comment?.id!}
          fileId={doc?.id!}
          includeLabel={true}
        />
        <Button variant="secondary" onClick={() => setActiveComment({})}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CommentDetail;
