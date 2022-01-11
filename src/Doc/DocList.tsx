import { useContext, useEffect, useState } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import CommentDetail from './CommentDetail';
import { handleError, GAPIError } from '../GoogleAuthenticated';
import { SettingsContext } from '../SettingsProvider';
import Doc from './Doc';

export type ActiveCommentType = {
  comment?: gapi.client.drive.Comment;
  doc?: gapi.client.drive.File;
};

const DocList: React.FC<{}> = function () {
  const [docs, setDocs] = useState<gapi.client.drive.File[] | undefined>([]);
  const [activeComment, setActiveComment] = useState<ActiveCommentType>();
  const [loading, setLoading] = useState(false);
  const { settings } = useContext(SettingsContext);

  useEffect(() => {
    (async () => {
      setDocs([]);
      setLoading(true);
      try {
        const response = await gapi.client.drive.files.list({
          q: `fullText contains 'followup:actionitems' and trashed = false and modifiedTime > '${settings.startDate}'`,
          fields: 'nextPageToken, files(id, name, webViewLink)',
          orderBy: 'modifiedTime desc',
          pageSize: 10,
        });

        setDocs(response.result.files);
        setLoading(false);
      } catch (e) {
        handleError(e as GAPIError);
      }
    })();
  }, [settings]);

  return (
    <>
      {docs?.map((doc) => (
        <Doc doc={doc} setActiveComment={setActiveComment} key={doc.id} />
      ))}
      {loading && <ProgressBar animated now={100} />}
      <CommentDetail
        comment={activeComment?.comment}
        doc={activeComment?.doc}
        setActiveComment={setActiveComment}
      />
    </>
  );
};

export default DocList;
