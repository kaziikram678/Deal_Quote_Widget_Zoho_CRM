import './App.css';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { DealDashboard } from './DealDetails';
import { LeadSearch } from './LeadSearch';
import React, { useEffect, useState, useReducer } from "react";
import UpdateLeadData from './UpdateLeadData';
import DealDetails from './DealDetails';
import MenuAppBar from './QouteDashboard/components/Dashboard-header';
import QuoteTable from './QouteDashboard/components/Qoute-table';
import { reducer, initialState } from './QouteDashboard/components/QouteReducer_new';
import AddQuote from './QouteDashboard/components/AddQoute_Dialouge';
const darkTheme = createTheme({
  palette: { mode: "dark" },
});

const ZOHO = window.ZOHO;

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const [zohoLoaded, setZohoLoaded] = useState(false);
  const [moduleName, setModuleName] = useState("");
  const [entityId, setEntityId] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    ZOHO.embeddedApp.on("PageLoad", function (data) {

      ZOHO.CRM.UI.Resize({ height: "1500", width: "1050" }).then(function (data) {
        console.log(data);
      });
      setModuleName(data.Entity);
      setEntityId(data.EntityId[0]);
     // console.log(data);
      setZohoLoaded(true);
    });

    ZOHO.embeddedApp.init()
  }, []);

  /////////////////////DealForm////////////////////////

  const [formDataList, setformDataList] = useState({
    Deal_Name: "",
    Amount: "",
    Account_Name: "",
    Account_Id: "",
    Contact_Phone: 0,
    Contact_Id: "",
    Stage: [],
  });

  useEffect(() => {
    if (moduleName && entityId) {
      ZOHO.CRM.API.getRecord({
        Entity: moduleName,
        RecordID: entityId,
      })
        .then(function (response) {
          const deal = response.data[0];
          console.log(deal.Account_Name.id);
          setformDataList({
            Deal_Name: deal.Deal_Name,
            Amount: deal.Amount,
            Account_Name: deal.Account_Name.name,
            Account_Id: deal.Account_Name.id,
            Contact_Name: deal.Contact_Name.name,
            Contact_Id: deal.Contact_Name.id,
            Contact_Phone: deal.Contact_Phone,
            Stage: deal.Stage,
          });

          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [moduleName, entityId]);

  if (!zohoLoaded || !moduleName || !formDataList) {
    return <>Fetching Data. Please wait...</>
  }
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <DealDetails DealId={entityId} moduleName={moduleName} formDataList = {formDataList} loading={loading}  Account_Id={formDataList.Account_Id} Contact_Id={formDataList.Contact_Id}/>
      <MenuAppBar>
        <AddQuote DealId={entityId} onSuccess={() => { }} />
      </MenuAppBar>
    </ThemeProvider>
  );
}