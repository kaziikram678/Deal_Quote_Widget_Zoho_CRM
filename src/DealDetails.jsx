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
  Stack
} from "@mui/material";

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

const Stage = [
  'Qualification',
  'Needs Analysis',
  'Value Proposition',
  'Identify Decision Makers',
  'Proposal/Price Quote',
  'Negotiation/Review',
  'Closed Won',
  'Closed Lost',
  'Closed Lost to Competition'
];

const ZOHO = window.ZOHO;
export default function DealDetails({ DealId, moduleName }) {

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);


  const [open, setOpen] = React.useState(false);

  ///////////////////////////Snakebar//////////////////////////

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  /////////////////////DealForm////////////////////////

  const [formData, setformData] = useState({
    Deal_Name: "",
    Amount: "",
    Account_Name: "",
    Contact_Phone: 0,
    Stage: [],
  });

  useEffect(() => {
    if (moduleName && DealId) {
      ZOHO.CRM.API.getRecord({
        Entity: moduleName,
        RecordID: DealId,
      })
        .then(function (response) {
          const deal = response.data[0];
          console.log(deal.Contact_Phone);
          setformData({
            Deal_Name: deal.Deal_Name,
            Amount: deal.Amount,
            Account_Name: deal.Account_Name.name,
            Contact_Name: deal.Contact_Name.name,
            Contact_Phone: deal.Contact_Phone,
            Stage: deal.Stage,
          });

          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [moduleName, DealId]);

  const handleChange = (e) => {
    setformData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = () => {
    setSaving(true);
    setOpen(true);
    console.log(formData.Contact_Name);
    const config = {
      Entity: moduleName,
      APIData: {
        id: DealId,
        Deal_Name: formData.Deal_Name,
        Amount: formData.Amount,
        Contact_Phone: formData.Contact_Phone,
        Stage: formData.Stage,
      },
    };

    ZOHO.CRM.API.updateRecord(config)
      .then(function () {
        setSaving(false);
      })
      .catch(() => {
        setSaving(false);
      });

    ZOHO.CRM.API.getRelatedRecords({ Entity: "Deals", RecordID: DealId, RelatedList: "Quotes", page: 1, per_page: 200 })
      .then(function (data) {
        console.log(data)
      })

  };

  return (
    <Box
      sx={{
        minHeight: "50vh",
        //display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f4f6f8",
        p: 2,
      }}
    >
      <Card
        elevation={4}
        sx={{
          width: 1000,
          borderRadius: 3,

        }}
      >
        <CardContent>
          <Typography align="center" variant="h6" fontWeight="600" gutterBottom>
            Deal Widget
          </Typography>

          <Typography variant="h7" fontWeight="300" gutterBottom>
            Deal Detail Section
          </Typography>

          <Divider sx={{ mb: 2 }} />

          {loading ? (
            <Box display="flex" justifyContent="center" py={1}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Stack direction="row" spacing={2}>
                <TextField
                  fullWidth
                  label="Deal_Name"
                  name="Deal_Name"
                  value={formData.Deal_Name}
                  onChange={handleChange}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  type="number"
                  label="Amount"
                  name="Amount"
                  value={formData.Amount}
                  onChange={handleChange}
                  margin="normal"
                />
              </Stack>

              <Divider sx={{ mb: 2 }} />

              <Stack direction="row" spacing={2}>
                <TextField
                fullWidth
                label="Account_Name"
                name="Account_Name"
                value={formData.Account_Name}
                //onChange={handleChange}
                margin="normal"
              />

              <TextField
                fullWidth
                label="Contact_Name"
                name="Contact_Name"
                value={formData.Contact_Name}
                //onChange={handleChange}
                margin="normal"
              />
              </Stack>
              
              <Divider sx={{ mb: 2 }} />

              <Stack direction="row" spacing={2}>
                <TextField
                type="mobile"
                fullWidth
                label="Contact_Phone"
                name="Contact_Phone"
                value={formData.Contact_Phone}
                onChange={handleChange}
                margin="normal"
              />

              <FormControl sx={{ my: 1, width: 925 }}>
                <InputLabel id="demo-multiple-name-label">
                  Stage
                </InputLabel>
                <Select
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  name="Stage"
                  value={formData.Stage}
                  onChange={handleChange}
                  input={<OutlinedInput label="Name" />}
                  MenuProps={MenuProps}
                >
                  {Stage.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              </Stack>
              
              <Divider sx={{ mb: 2 }} />

              <Box mt={1}>
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
                    message="Deal Updated Successfully"
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
