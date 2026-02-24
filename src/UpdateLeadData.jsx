import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Divider,
  Select,
  MenuItem,
  OutlinedInput,
  FormControl,
  Snackbar,
  InputLabel,
} from "@mui/material";
import { MuiTelInput } from 'mui-tel-input'

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const leadSourceList = [
  "advertisement",
  "Cold Call",
  "Employee Referral",
  "External Referral",
  "Online Store",
  "X (Twitter)",
  "Facebook",
  "Partner",
  "Public Relations",
  "Sales Email Alias",
  "Seminar Partner",
  "Internal Seminar",
  "Trade Show",
  "Web Download",
  "Web Research",
  "Chat",
];

const ZOHO = window.ZOHO;
export default function UpdateLeadData() {
  const [leadId, setLeadId] = useState(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [moduleName, setModuleName] = useState("");

  const [open, setOpen] = React.useState(false);

  ///////////////////////////Snakebar//////////////////////////

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  /////////////////////LeadForm////////////////////////

  const [formData, setformData] = useState({
    Company: "",
    Last_Name: "",
    Email: "",
    Mobile: 0,
    Lead_Source: [],
  });

  useEffect(() => {
    ZOHO.embeddedApp.on("PageLoad", function (data) {
      setModuleName(data.Entity);

      //console.log(data.Entity);

      const id = data.EntityId[0];

      setLeadId(id);

      ZOHO.CRM.API.getRecord({
        Entity: "Leads",
        RecordID: id,
      })
        .then(function (response) {
          const lead = response.data[0];
          //console.log(lead.Lead_Source);
          setformData({
            Company: lead.Company,
            Last_Name: lead.Last_Name,
            Email: lead.Email,
            Mobile: lead.Mobile,
            Lead_Source: lead.Lead_Source,
          });

          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    });

    ZOHO.embeddedApp.init();
  }, []);

  const handleChange = (e) => {
    setformData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleUpdate = () => {
    setSaving(true);
    setOpen(true);

    const config = {
      Entity: moduleName,
      APIData: {
        id: leadId,
        Company: formData.Company,
        Last_Name: formData.Last_Name,
        Email: formData.Email,
        Mobile: formData.Mobile,
        Lead_Source: formData.Lead_Source,
      },
    };

    ZOHO.CRM.API.updateRecord(config)
      .then(function () {
        setSaving(false);
      })
      .catch(() => {
        setSaving(false);
      });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f4f6f8",
        p: 2,
      }}
    >
      <Card
        elevation={4}
        sx={{
          width: 420,
          borderRadius: 3,
        }}
      >
        <CardContent>
          <Typography variant="h6" fontWeight="600" gutterBottom>
            Lead Information
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={2}>
            Update lead details below
          </Typography>

          <Divider sx={{ mb: 3 }} />

          {loading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TextField
                fullWidth
                label="Company"
                name="Company"
                value={formData.Company}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Lead Name"
                name="Last_Name"
                value={formData.Last_Name}
                onChange={handleChange}
                margin="normal"
              />

              <TextField
                fullWidth
                label="Email Address"
                name="Email"
                value={formData.Email}
                onChange={handleChange}
                margin="normal"
              />
{/* 
              <TextField
                type="mobile"
                fullWidth
                label="Mobile"
                name="Mobile"
                value={formData.Mobile}
                onChange={handleChange}
                margin="normal"
              /> */}

              <MuiTelInput name="Mobile" value={formData.Mobile} onChange={handleChange} />

              <FormControl sx={{ my: 2, width: 300 }}>
                <InputLabel id="demo-multiple-name-label">
                  Lead Source
                </InputLabel>
                <Select
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  name="Lead_Source"
                  value={formData.Lead_Source}
                  onChange={handleChange}
                  input={<OutlinedInput label="Name" />}
                  MenuProps={MenuProps}
                >
                  {leadSourceList.map((lead_source) => (
                    <MenuItem key={lead_source} value={lead_source}>
                      {lead_source}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box mt={3}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleUpdate}
                  disabled={saving}
                  sx={{
                    textTransform: "none",
                    borderRadius: 2,
                    py: 1.2,
                  }}
                >
                  <Snackbar
                    open={open}
                    autoHideDuration={6000}
                    onClose={handleClose}
                    message="Lead Updated Successfully"
                  />
                  {saving ? (
                    <CircularProgress size={22} color="inherit" />
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
