import { createContext, useEffect } from 'react';
import { useState } from 'react';
import WelcomePage from './WelcomePage';

type Props = {
  apiKey: string;
  clientId: string;
  discoveryDocs: string[];
  scopes: string[];
};

export type GAPIError = {
  status: number;
};

async function initializeClient(
  apiKey: string,
  clientId: string,
  discoveryDocs: string[],
  scopes: string[]
) {
  return gapi.client.init({
    apiKey,
    discoveryDocs,
    clientId,
    scope: scopes.join(','),
  });
}

export const logOut = function () {
  gapi.auth2.getAuthInstance().signOut();
};

export const handleError = function (e: GAPIError) {
  if (e.status && [403, 401].includes(e.status)) {
    logOut();
  }
};

export const AuthenticatedUserContext = createContext<gapi.auth2.BasicProfile>(
  undefined!
);

const GoogleAuthenticated: React.FC<Props> = function ({
  apiKey,
  clientId,
  discoveryDocs,
  scopes,
  children,
}) {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    gapi.load('client', async function () {
      await initializeClient(apiKey, clientId, discoveryDocs, scopes);
      gapi.auth2
        .getAuthInstance()
        .isSignedIn.listen((signedIn: boolean) => setLoading(!signedIn));

      if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
        setLoading(false);
      }
    });
  }, [apiKey, clientId, discoveryDocs, scopes]);

  return isLoading ? (
    <WelcomePage />
  ) : (
    <AuthenticatedUserContext.Provider
      value={gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile()}
    >
      {children}
    </AuthenticatedUserContext.Provider>
  );
};

export default GoogleAuthenticated;
