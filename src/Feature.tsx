import React from 'react';
import Col from 'react-bootstrap/Col';

type Props = {
  logoComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  text: string;
};

const Feature: React.FC<Props> = function ({ logoComponent, text }) {
  const LogoComponent = logoComponent;

  return (
    <Col
      xl={6}
      className="d-flex justify-content-between align-items-start my-3"
    >
      <div className="bg-secondary p-2 rounded me-3 mt-1">
        <LogoComponent width="24" height="24" fill="white" />
      </div>
      <p className="flex-grow-1">{text}</p>
    </Col>
  );
};

export default Feature;
