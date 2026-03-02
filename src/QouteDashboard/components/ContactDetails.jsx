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

export default function ContactDetails({ Contact_Id }) {

    //console.log(Contact_Id)

    const [loading, setLoading] = useState(true);

    const [contactSaving, setcontactSaving] = useState(false);
    const [open, setOpen] = React.useState(false);

    const [ContactformDataList, setContactformDataList] = useState({
        First_Name: "",
        Last_Name: "",
        Account_Name: "",
        Email: "",
        Date_of_Birth: "",
        Phone: "",
    });

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    };

    const handleChange = (e) => {
        setContactformDataList({
            ...ContactformDataList,
            [e.target.name]: e.target.value,
        });
    };

    const handleContactUpdate = async () => {
        setcontactSaving(true);
        setOpen(true);
        console.log(ContactformDataList.First_Name);
        const config = {
            Entity: "Contacts",
            APIData: {
                id: Contact_Id,
                First_Name: ContactformDataList.First_Name,
                Last_Name: ContactformDataList.Last_Name,
                Account_Name: ContactformDataList.Account_Name,
                Email: ContactformDataList.Email,
                Date_of_Birth: ContactformDataList.Date_of_Birth,
                Phone: ContactformDataList.Phone,
            },
        };

        await ZOHO.CRM.API.updateRecord(config)
            .then(function () {
                setcontactSaving(false);
            })
            .catch(() => {
                setcontactSaving(false);
            });

        await ZOHO.CRM.UI.Popup.closeReload()
            .then(function (data) {
                console.log(data)
            })

    };

    useEffect(() => {
        if (Contact_Id) {
            ZOHO.CRM.API.getRecord({
                Entity: "Contacts",
                RecordID: Contact_Id,
            })
                .then(function (response) {
                    const contact = response.data[0];
                    console.log(contact)
                    setContactformDataList({
                        First_Name: contact.First_Name,
                        Last_Name: contact.Last_Name,
                        Account_Name: contact.Account_Name.name,
                        Email: contact.Email,
                        Date_of_Birth: contact.Date_of_Birth,
                        Phone: contact.Phone,
                    });

                    setLoading(false);
                })
                .catch(() => {
                    setLoading(false);
                });
        }
    }, [Contact_Id]);
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
                            Contact Information
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
                                        label="First_Name"
                                        name="First_Name"
                                        value={ContactformDataList.First_Name}
                                        onChange={handleChange}
                                        margin="normal"
                                    />
                                    <TextField
                                        fullWidth
                                        label="Last_Name"
                                        name="Last_Name"
                                        value={ContactformDataList.Last_Name}
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
                                        value={ContactformDataList.Account_Name}
                                        onChange={handleChange}
                                        margin="normal"
                                    />

                                    <TextField
                                        fullWidth
                                        type="email"
                                        label="Email"
                                        name="Email"
                                        value={ContactformDataList.Email}
                                        onChange={handleChange}
                                        margin="normal"
                                    />

                                    
                                </Stack>
                                <Divider sx={{ mb: 2 }} />

                                <Stack direction="row" spacing={2}>
                                    <TextField
                                        fullWidth
                                        label="Date_of_Birth"
                                        name="Date_of_Birth"
                                        value={ContactformDataList.Date_of_Birth}
                                        onChange={handleChange}
                                        margin="normal"
                                    />
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="Phone"
                                        name="Phone"
                                        value={ContactformDataList.Phone}
                                        onChange={handleChange}
                                        margin="normal"
                                    />
                                </Stack>

                                <Box mt={1}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        size="large"
                                        onClick={handleContactUpdate}
                                        disabled={contactSaving}
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
                                            message="Contact Updated Successfully"
                                        />
                                        {contactSaving ? (
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

