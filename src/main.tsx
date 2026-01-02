import './index.css'
import App from './App.tsx'
import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "react-oidc-context";
import { env } from "./config/constants";
const cognitoAuthConfig = {
  authority: env.COGNITO_DOMAIN,
  client_id: env.CLIENT_ID,
  redirect_uri: location.origin,
  response_type: "code",
  scope: "phone openid email",
};

const root = ReactDOM.createRoot(document.getElementById("root")!);

// wrap the application with AuthProvider
root.render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);