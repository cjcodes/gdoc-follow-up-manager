import React from 'react';
import './App.css';
import GoogleAuthenticated from './GoogleAuthenticated';
import DocList from './Doc/DocList';
import SettingsProvider from './SettingsProvider';
import Settings from './Settings';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Navbar from 'react-bootstrap/Navbar';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { SignOutButton } from './Buttons';

dayjs.extend(localizedFormat);

function App() {
  return (
    <GoogleAuthenticated
      apiKey={process.env.REACT_APP_GAPI_KEY || ''}
      clientId={process.env.REACT_APP_GAPI_CLIENT_ID || ''}
      discoveryDocs={[
        'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
      ]}
      scopes={['https://www.googleapis.com/auth/drive']}
    >
      <SettingsProvider>
        {/* expanded prevents navbar from collapsing with settings menu */}
        <Navbar expanded={true}>
          <Container>
            <Navbar.Brand>Follow-up Manager for Google Drive</Navbar.Brand>
            <Navbar.Collapse className="justify-content-end">
              <Navbar.Text>
                <span className="me-2">
                  <Settings />
                </span>
                <SignOutButton />
              </Navbar.Text>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Container>
          <Row>
            <DocList />
          </Row>
        </Container>
      </SettingsProvider>
    </GoogleAuthenticated>
  );
}

export default App;
