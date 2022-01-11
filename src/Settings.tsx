import React, { useContext, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { SettingsContext, SettingsObject } from './SettingsProvider';
import { ReactComponent as GearIcon } from 'bootstrap-icons/icons/gear.svg';

function Settings({ useNavbar = false }) {
  const { settings, updateSettings } = useContext(SettingsContext);
  const [stagedSettings, updateStagedSettings] =
    useState<SettingsObject>(settings);
  const [visible, setVisible] = useState(false);

  const changeHandler = function (parameter: string) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      updateStagedSettings({
        ...stagedSettings,
        [parameter]:
          e.target.type === 'checkbox' ? e.target.checked : e.target.value,
      });
    };
  };

  const save = function (e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    updateSettings(stagedSettings);
    setVisible(false);
  };

  return (
    <>
      <Button variant="secondary" onClick={() => setVisible(true)}>
        <GearIcon /> Settings
      </Button>

      <Offcanvas
        show={visible}
        onHide={() => setVisible(false)}
        placement="end"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Settings</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form>
            <Form.Group className="mb-5">
              <Form.Label>Docs midified since</Form.Label>
              <Form.Control
                type="date"
                name="test"
                value={stagedSettings.startDate}
                onChange={changeHandler('startDate')}
              />
            </Form.Group>
            <Form.Check
              type="switch"
              label="Exclude recently replied"
              checked={stagedSettings.excludeRepliedComments}
              onChange={changeHandler('excludeRepliedComments')}
              className="mb-5"
            />
            <Button variant="primary" type="submit" onClick={save}>
              Save Settings
            </Button>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default Settings;
