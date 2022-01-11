import React from 'react';
import Button from 'react-bootstrap/Button';

const SignOutButton: React.FC = function () {
  const signOut = function () {
    gapi.auth2.getAuthInstance().signOut();
  };

  return (
    <Button variant="outline-primary" onClick={signOut}>
      Sign Out
    </Button>
  );
};

export default SignOutButton;
