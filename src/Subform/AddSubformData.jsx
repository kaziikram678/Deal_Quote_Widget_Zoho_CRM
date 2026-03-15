import React from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Select,
    OutlinedInput,
    MenuItem,
    FormControl,
    InputLabel,
    Paper,
    Box,
    Typography,
    IconButton,
    Snackbar
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";

import { useEffect, useState } from "react";

const ZOHO = window.ZOHO;


export default function AddSubformData({ DealId, onSuccess, dealTransactions}) {

    //console.log(onSuccess)

    const [open, setOpen] = useState(false);
    const [transactionName, setTransactionName] = useState("");
    const [email, setEmail] = useState("");
    const [transactionAmount, setTransactionAmount] = useState(0);
    const [transactionDate, setTransactionDate] = useState();
    const [error, iserror] = useState(false);
    const [openOnSuccess, setOpenOnSuccess] = React.useState(false);
    const [openOnError, setOpenOnError] = React.useState(false);
    const [loading, setLoading] = useState(true);

    //console.log(transactionList);

    const handleCloseOnSuccess = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpenOnSuccess(false);
    };

    const handleCloseOnError = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpenOnError(false);
    };


    const AddNewRow = async () => {

        const newRow = {
            "Transaction_Name": transactionName,
            "Email": email,
            "Transaction_Amount": transactionAmount,
            "Transaction_Date": transactionDate
        }

        const config = {
            Entity: "Deals",
            APIData: {
                id: DealId,
                Deal_Transactions: [...dealTransactions, newRow]
            },
        };

        await ZOHO.CRM.API.updateRecord(config)
            .then(function (res) {
                console.log(res.data[0].status);
            })

        setTransactionName("");
        setEmail("");
        setTransactionAmount(0);
        setTransactionDate("");
        setOpen(false);
        setOpenOnSuccess(false);
        setOpenOnError(false);
        onSuccess()
    }


    return (
        <>
            <Button variant="contained" onClick={() => setOpen(true)}>
                + Add New Row
            </Button>

            <Dialog open={open} maxWidth="md" fullWidth>

                <DialogTitle>Add New Subform Data</DialogTitle>

                <DialogContent>
                    <TextField
                        required
                        fullWidth
                        label="Transaction_Name"
                        variant="standard"
                        value={transactionName}
                        onChange={(e) => setTransactionName(e.target.value)}
                        sx={{ mb: 3 }}
                    />

                    <TextField
                        required
                        fullWidth
                        label="Email"
                        variant="standard"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{ mb: 3 }}
                    />


                    <TextField
                        required
                        fullWidth
                        type="number"
                        label="Transaction_Amount"
                        variant="standard"
                        value={transactionAmount}
                        onChange={(e) => setTransactionAmount(e.target.value)}
                        sx={{ mb: 3 }}
                    />

                    <TextField
                        required
                        fullWidth
                        type="date"
                        label="Transaction_Date"
                        variant="standard"
                        value={transactionDate}
                        onChange={(e) => setTransactionDate(e.target.value)}
                        sx={{ mb: 3 }}
                    />
                </DialogContent>\


                <DialogActions>

                    <Button onClick={() => setOpen(false)}>
                        Cancel
                    </Button>

                    {(transactionName && email && transactionAmount && transactionDate) ? (
                        <Button
                            variant="contained"
                            size="large"
                            onClick={AddNewRow}
                            //disabled={quoteSaving}
                            sx={{
                                textTransform: "none",
                                borderRadius: 2,
                                py: 1.2,
                            }}
                        >
                            {!iserror ? <Snackbar
                                open={openOnSuccess}
                                autoHideDuration={3000}
                                onClose={handleCloseOnSuccess}
                                message="Row Created Successfully"
                            /> : <Snackbar
                                open={openOnError}
                                autoHideDuration={3000}
                                onClose={handleCloseOnError}
                                message="Invalid Data"
                            />
                            }
                            Create Row
                        </Button>
                    ) : <Button
                        disabled
                        variant="contained"
                        size="large"
                        onClick={""}
                        //disabled={quoteSaving}
                        sx={{
                            textTransform: "none",
                            borderRadius: 2,
                            py: 1.2,
                        }}
                    >
                        Create Row
                    </Button>}



                </DialogActions>
            </Dialog>
        </>
    );
}