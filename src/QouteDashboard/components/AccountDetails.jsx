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
const ZOHO = window.ZOHO;

export default function AccountDetails({ Account_Id }) {

    const [loading, setLoading] = useState(true);

    const [accountSaving, setAccountSaving] = useState(false);
    const [open, setOpen] = React.useState(false);
    const [accountList, setAccountList] = useState([]);

    const [AccountformDataList, setAccountformDataList] = useState({
        Account_Name: "",
        Email: "",
        Industry: "",
        Phone: "",
        Annual_Revenue: 0,
        Total_Deal_Amount: 0,
    });

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    };

    const handleChange = (e) => {
        setAccountformDataList({
            ...AccountformDataList,
            [e.target.name]: e.target.value,
        });
    };

    const handleAccountUpdate = async () => {
        setAccountSaving(true);
        setOpen(true);
        console.log(AccountformDataList.Account_Name);
        const config = {
            Entity: "Accounts",
            APIData: {
                id: Account_Id,
                Account_Name: AccountformDataList.Account_Name,
                Email: AccountformDataList.Email,
                Industry: AccountformDataList.Industry,
                Phone: AccountformDataList.Phone,
                Annual_Revenue: AccountformDataList.Annual_Revenue,
                Total_Deal_Amount: AccountformDataList.Total_Deal_Amount,
            },
        };

        await ZOHO.CRM.API.updateRecord(config)
            .then(function () {
                setAccountSaving(false);
            })
            .catch(() => {
                setAccountSaving(false);
            });

        await ZOHO.CRM.UI.Popup.closeReload()
            .then(function (data) {
                console.log(data)
            })

    };

    useEffect(() => {
        if (Account_Id) {
            ZOHO.CRM.API.getRecord({
                Entity: "Accounts",
                RecordID: Account_Id,
            })
                .then(function (response) {
                    const account = response.data[0];
                    setAccountformDataList({
                        Account_Name: account.Account_Name,
                        Email: account.Email,
                        Industry: account.Industry,
                        Phone: account.Phone,
                        Annual_Revenue: account.Annual_Revenue,
                        Total_Deal_Amount: account.Total_Deal_Amount,
                    });

                    setLoading(false);
                })
                .catch(() => {
                    setLoading(false);
                });
        }
    }, [Account_Id]);
    //console.log(Account_Id);

    const getAccounts = () => {
        var conn_name = "ikram_connection_crm";
        var req_data = {
            "method": "GET",
            "url": "https://www.zohoapis.com/crm/v8/Accounts?fields=Account_Name",
            "param_type": 1
        };
        ZOHO.CRM.CONNECTION.invoke(conn_name, req_data)
            .then(function (data) {
                console.log(data.details.statusMessage.data);
                setAccountList(data.details.data);
            })
    }



    // return (
    //     <>
    //         <Button onClick={getAccounts}>Get Accounts</Button>
    //     </>
    // )
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
                            Account Information
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
                                        label="Account_Name"
                                        name="Account_Name"
                                        value={AccountformDataList.Account_Name}
                                        onChange={handleChange}
                                        margin="normal"
                                    />
                                    <TextField
                                        fullWidth
                                        type="email"
                                        label="Email"
                                        name="Email"
                                        value={AccountformDataList.Email}
                                        onChange={handleChange}
                                        margin="normal"
                                    />
                                </Stack>



                                <Divider sx={{ mb: 2 }} />

                                <Stack direction="row" spacing={2}>
                                    <TextField
                                        type="mobile"
                                        fullWidth
                                        label="Phone"
                                        name="Phone"
                                        value={AccountformDataList.Phone}
                                        onChange={handleChange}
                                        margin="normal"
                                    />

                                    <FormControl sx={{ my: 1, width: 960 }}>
                                        <InputLabel id="demo-multiple-name-label">
                                            Industry
                                        </InputLabel>
                                        <Select
                                            labelId="demo-multiple-name-label"
                                            id="demo-multiple-name"
                                            name="Stage"
                                            value={AccountformDataList.Industry}
                                            onChange={handleChange}
                                            input={<OutlinedInput label="Name" />}
                                            MenuProps={MenuProps}
                                        >
                                            {/* {stage_list.map((item) => (
                                                <MenuItem key={item} value={item}>
                                                    {item}
                                                </MenuItem>
                                            ))} */}
                                        </Select>
                                    </FormControl>
                                </Stack>
                                <Divider sx={{ mb: 2 }} />

                                <Stack direction="row" spacing={2}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="Annual_Revenue"
                                        name="Annual_Revenue"
                                        value={AccountformDataList.Annual_Revenue}
                                        onChange={handleChange}
                                        margin="normal"
                                    />
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="Total_Deal_Amount"
                                        name="Total_Deal_Amount"
                                        value={AccountformDataList.Total_Deal_Amount}
                                        onChange={handleChange}
                                        margin="normal"
                                    />
                                </Stack>

                                <Box mt={1}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        size="large"
                                        onClick={handleAccountUpdate}
                                        disabled={accountSaving}
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
                                            message="Account Updated Successfully"
                                        />
                                        {accountSaving ? (
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
        </>
    );
}

