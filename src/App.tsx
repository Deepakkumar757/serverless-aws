// App.js

import { useAuth } from "react-oidc-context";
import "./App.css"
import axios from "axios";
import { useState } from "react";
import ContactForm from "./components/form/form";
function App() {
  const apiurl = "https://8rbyg17rdd.execute-api.eu-north-1.amazonaws.com/dev";
  const auth = useAuth();
  const [data, setData] = useState(null);

  const signOutRedirect = () => {
    const clientId = "51r28giceg8gdp1qrtp2ios8vn";
    const logoutUri = "<logout uri>";
    const cognitoDomain =
      "https://eu-north-1y11wlz3md.auth.eu-north-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
      logoutUri
    )}`;
  };
  const checkApi = async () => {
    const response = await axios.get(apiurl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${auth.user?.id_token}`,
      },
    });
    setData(response.data);
  };

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  // if (auth.isAuthenticated) {
  //   return (
  //     <div>
  //       <pre> Hello: {auth.user?.profile.email} </pre>
  //       <button onClick={() => checkApi()}>Check API</button>
  //       <pre>{JSON.stringify(data, null, 2)}</pre>
  //       <button onClick={() => auth.removeUser()}>Sign out</button>
  //     </div>
  //   );
  // }

  return (

     <ContactForm />
  );
}

export default App;
