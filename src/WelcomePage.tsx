import React from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ReactComponent as TaskListIcon } from 'bootstrap-icons/icons/list-task.svg';
import { ReactComponent as CheckIcon } from 'bootstrap-icons/icons/check-all.svg';
import { ReactComponent as QuoteIcon } from 'bootstrap-icons/icons/chat-right-quote-fill.svg';
import { ReactComponent as PersonIcon } from 'bootstrap-icons/icons/person-plus-fill.svg';
import { ReactComponent as CalendarIcon } from 'bootstrap-icons/icons/calendar-check.svg';
import Feature from './Feature';

const WelcomePage: React.FC = function () {
  const features = [
    {
      logoComponent: TaskListIcon,
      text: 'List all comments in all Google Docs that you have access to that are assigned to you.',
    },
    {
      logoComponent: CheckIcon,
      text: 'Resolve comments from the interface without having to open up the Google Doc.',
    },
    {
      logoComponent: QuoteIcon,
      text: 'Reply to comments directly.',
    },
  ];

  const comingSoon = [
    {
      logoComponent: PersonIcon,
      text: 'Autocomplete users to tag in your comments.',
    },
    {
      logoComponent: CalendarIcon,
      text: 'Sort by comments that have due dates like "by tomorrow" and "by EOM."',
    },
  ];

  return (
    <>
      <Container className="mt-5">
        <Row>
          <Col md={{ span: 6, offset: 3 }}>
            <h1>Follow-up Manager</h1>
            <h2 className="fw-light">for Google Drive</h2>
            <p className="mt-5 fs-4">
              Browser-based tool for managing comments assigned to you in Google
              Drive.
            </p>
            <p>
              This application runs completely in your browser. Your Google
              authorization will only be stored in this browser session and the
              data is retrieved directly from Google's servers.
            </p>
            <p>
              This application does not perform any actions on your Google Drive
              files unless you initiate it. There are no bulk actions.
            </p>
            <p></p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => gapi.auth2.getAuthInstance().signIn()}
            >
              Authorize with Google
            </Button>

            <h2 className="mt-5">Features</h2>
            <Row>
              {features.map((feature, i) => (
                <Feature
                  logoComponent={feature.logoComponent}
                  text={feature.text}
                  key={`feature-${i}`}
                />
              ))}
            </Row>

            <h2 className="mt-5">Features in Development</h2>
            <Row>
              {comingSoon.map((feature, i) => (
                <Feature
                  logoComponent={feature.logoComponent}
                  text={feature.text}
                  key={`feature-${i}`}
                />
              ))}
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default WelcomePage;
