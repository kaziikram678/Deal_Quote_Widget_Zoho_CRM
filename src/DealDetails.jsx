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
import QuoteTable from "./QouteDashboard/components/Qoute-table";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import AccountDetails from "./QouteDashboard/components/AccountDetails";
import ContactDetails from "./QouteDashboard/components/ContactDetails";
import Modal from '@mui/material/Modal';

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


const ZOHO = window.ZOHO;
export default function DealDetails({ DealId, moduleName, formDataList, loading, Account_Id, Contact_Id }) {

  //console.log(Contact_Id)

  const [open, setOpen] = React.useState(false);

  const [formData, setformData] = useState({});

  const [stageList, setStageList] = useState([]);

  const [selectedAccount, setSelectedAccount] = useState([]);

  const [accounts, setAccounts] = useState([]);

  const stage_list = stageList.toString().split(",");

  /////////////////////usestates for modal////////////////////

  const [modalOpen, setModalOpen] = React.useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);


  useEffect(() => {
    setformData(formDataList)
  }, [formDataList])

  ///////////////////////////Snakebar//////////////////////////

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    var func_name = "Deal_Quote_For_Widget";
    var req_data = {
      "arguments": JSON.stringify({
      })
    };
    ZOHO.CRM.FUNCTIONS.execute(func_name, req_data)
      .then(function (data) {
        setStageList(data.details.output);
      })
  }, [stageList])


  const handleChange = (e) => {
    setformData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getAccounts = async () => {
    var conn_name = "ikram_connection_crm";
    var req_data = {
      "method": "GET",
      "url": "https://www.zohoapis.com/crm/v8/Accounts?fields=Account_Name",
      "param_type": 1
    };
    await ZOHO.CRM.CONNECTION.invoke(conn_name, req_data)
      .then(function (data) {
        //console.log(data.details.statusMessage.data);
        setAccounts(data.details.data);
      })
  }

  //console.log(Account_Id);

  return (
    <>
      <Box
        sx={{
          minHeight: "50vh",
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
                  {/* <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    color="white"
                    startIcon={<AccountCircleIcon />}
                    onClick={handleModalOpen}
                    sx={{
                      textTransform: "none",
                      textAlign: "left",
                      borderRadius: 0.5,
                      borderColor: "gray",
                      py: 1.2,
                    }}
                  >
                    {formData.Account_Name}
                  </Button>
                  <Modal
                    open={modalOpen}
                    onClose={handleModalClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <AccountDetails Account_Id={Account_Id}/>
                  </Modal> */}

                  <FormControl sx={{ my: 1, width: 960 }}>
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
                      {stage_list.map((item) => (
                        <MenuItem key={item} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    color="white"
                    startIcon={<ContactPhoneIcon />}
                    onClick={handleModalOpen}
                    sx={{
                      textTransform: "none",
                      borderRadius: 0.5,
                      borderColor: "gray",
                      py: 1.2,
                    }}
                  >
                    {formData.Contact_Name}
                  </Button>
                  {/* <Modal
                    open={modalOpen}
                    onClose={handleModalClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <ContactDetails Contact_Id={Contact_Id}/>
                  </Modal> */}
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

                  <FormControl sx={{ my: 1, width: 960 }}>
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
                      {stage_list.map((item) => (
                        <MenuItem key={item} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
                <Divider sx={{ mb: 2 }} />
              </>
            )}
          </CardContent>
        </Card>
      </Box>
      <QuoteTable DealId={DealId} moduleName={moduleName} formDataList={formData} loading={loading} stage_list={stage_list} />
    </>
  );
}

