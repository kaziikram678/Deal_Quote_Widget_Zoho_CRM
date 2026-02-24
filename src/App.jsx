import './App.css';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { DealDashboard } from './DealDetails';
import { LeadSearch } from './LeadSearch';
import React, { useEffect, useState, useReducer } from "react";
import UpdateLeadData from './UpdateLeadData';
import DealDetails from './DealDetails';
import MenuAppBar from './QouteDashboard/components/Dashboard-header';
import DataTable from './QouteDashboard/components/Qoute-table';
import { reducer, initialState } from './QouteDashboard/components/QouteReducer_new';
import AddQuote from './QouteDashboard/components/AddQoute-dialog';
const darkTheme = createTheme({
  palette: { mode: "dark" },
});

const ZOHO = window.ZOHO;

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const [zohoLoaded, setZohoLoaded] = useState(false);
  const [moduleName, setModuleName] = useState("");
  const [entityId, setEntityId] = useState(null);

  useEffect(() => {
    ZOHO.embeddedApp.on("PageLoad", function (data) {

      ZOHO.CRM.UI.Resize({ height: "1000", width: "1000" }).then(function (data) {
        console.log(data);
      });
      setModuleName(data.Entity);
      setEntityId(data.EntityId[0]);
      console.log(data);
      setZohoLoaded(true);
    });

    ZOHO.embeddedApp.init()
  }, []);



  console.log(moduleName)
  if (!zohoLoaded || !moduleName) {
    return <>Fetching Data. Please wait...</>
  }
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {/* <LeadSearch moduleName={moduleName}/> */}
      {/* <LeadUpdate moduleName={moduleName} entityId={entityId}/> */}
      {/* <UpdateLeadData/> */}
      <DealDetails DealId={entityId} moduleName={moduleName} />

      {/* <MenuAppBar dispatch={dispatch} />

      <DataTable DealId={entityId} moduleName={moduleName} dispatch={dispatch} /> */}

      <MenuAppBar>
        <AddQuote DealId={entityId} onSuccess={() => { }} />
      </MenuAppBar>

      <DataTable DealId={entityId} moduleName={moduleName} />
    </ThemeProvider>
  );
}