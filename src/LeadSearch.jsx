import React, { useEffect, useState } from "react";
import { TextField, Button } from "@mui/material";
const ZOHO = window.ZOHO;
export const LeadSearch = ({moduleName}) => {
  console.log(moduleName);

  const [email, setEmail] = useState("");
  const [record, setRecord] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleSubmit = async () => {
    if (!email) return;

    setLoading(true);
    
    const resp = await ZOHO.CRM.API.searchRecord({
      Entity: moduleName,
      Type: "criteria",
      Query: `(Email:equals:${email})`,
    })
    setRecord(resp?.data || [])
    setLoading(false);
      
  };

  return (
    <div style={{ padding: "16px" }}>
      <h2>Search Leads by Email</h2>

      <div style={{ border: "1px solid #ddd", padding: "12px", borderRadius: "8px" }}>
        <TextField
          fullWidth
          label="Email"
          variant="standard"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginBottom: "16px" }}
        />

        <Button variant="contained" onClick={handleSubmit}>
          Search
        </Button>

        <p style={{ marginTop: "12px" }}>
          <b>Current Module:</b> {moduleName}
        </p>

        {!loading && record.length > 0 && (
          <div style={{ marginTop: "12px" }}>
            {record.map((item) => (
              <div key={item.id}>
                <b>Full Name:</b> {item.Full_Name} <br />
                <b>Company Name:</b> {item.Company} <br />
                <b>Created Time:</b> {item.Created_Time}
                <hr />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
