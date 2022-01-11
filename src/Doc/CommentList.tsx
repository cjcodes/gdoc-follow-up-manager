import { useEffect, useState, useContext } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { ActiveCommentType } from './DocList';
import {
  AuthenticatedUserContext,
  GAPIError,
  handleError,
} from '../GoogleAuthenticated';
import { SettingsContext } from '../SettingsProvider';
import Comment from './Comment';

type Props = {
  doc: gapi.client.drive.File;
  setActiveComment: React.Dispatch<
    React.SetStateAction<ActiveCommentType | undefined>
  >;
};

const API_FIELDS = [
  'id',
  'author',
  'htmlContent',
  'content',
  'resolved',
  'quotedFileContent(value)',
  'createdTime',
  'replies(author(me), action)',
].join(',');

const filterComments = (
  commentList: gapi.client.drive.Comment[],
  me: gapi.auth2.BasicProfile,
  excludeRepliedComments: boolean
) => {
  return commentList.filter((comment) => {
    const unresolved = !comment.resolved;
    const assignedToMe = comment.content?.includes(`@${me.getEmail()}`);
    let replied = false;

    if (excludeRepliedComments) {
      if (comment?.replies && comment.replies.length) {
        const reply = comment.replies[comment.replies.length - 1];

        if (reply) {
          replied = (reply.author?.me || true) && !reply.action;
        }
      }
    }

    return unresolved && assignedToMe && !replied;
  });
};

const CommentList: React.FC<Props> = function ({ doc, setActiveComment }) {
  const [comments, setComments] = useState<gapi.client.drive.Comment[]>([]);
  const profile = useContext(AuthenticatedUserContext);
  const { settings } = useContext(SettingsContext);

  useEffect(() => {
    let mounted = true;

    (async () => {
      if (doc.id) {
        try {
          const response = await gapi.client.drive.comments.list({
            fileId: doc.id,
            includeDeleted: false,
            fields: `nextPageToken, comments(${API_FIELDS})`,
          });

          if (!mounted) {
            return;
          }

          setComments((comments) => {
            return filterComments(
              response.result.comments || [],
              profile,
              settings.excludeRepliedComments
            );
          });
        } catch (e) {
          handleError(e as GAPIError);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [doc, profile, settings]);

  const removeComment = function (commentId: string) {
    setComments(comments.filter((comment) => comment.id !== commentId));
  };

  const getRowClickHandler = function (comment: gapi.client.drive.Comment) {
    return function (e: React.MouseEvent<HTMLElement>) {
      const clicked = e.target as HTMLElement;

      /**
       * Traverse the DOM to see if the clicked element is an anchor or
       * a button, stopping once we hit the wrapping TD.
       */
      let target = clicked;
      while (
        !target.classList.contains('list-group') &&
        target.parentElement !== null
      ) {
        if (['A', 'BUTTON'].includes(target.tagName)) {
          return;
        }

        target = target.parentElement;
      }

      setActiveComment({ comment, doc });
    };
  };

  const commentList = comments.map((comment) => {
    return (
      <ListGroup.Item
        onClick={getRowClickHandler(comment)}
        className="d-flex"
        key={comment.id}
      >
        <Comment comment={comment} removeComment={removeComment} doc={doc} />
      </ListGroup.Item>
    );
  });

  return <ListGroup variant="flush">{commentList}</ListGroup>;
};

export default CommentList;
