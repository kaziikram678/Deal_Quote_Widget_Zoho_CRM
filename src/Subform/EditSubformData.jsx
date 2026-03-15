import {
    Paper,
    Typography,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    FormControl,
    InputLabel,
    Select,
    OutlinedInput,
    MenuItem,
    Divider,
    Snackbar,
    CircularProgress,
    IconButton,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 100,
        },
    },
};

const ZOHO = window.ZOHO;

export default function EditSubformData({ DealId, subform, onClose, onSuccess, dealTransactions }) {
    const [open, setOpen] = useState(false);
    const [dealTransactionsId, setDealTransactionsId] = useState(subform.id)
    const [transactionName, setTransactionName] = useState(subform.Transaction_Name);
    const [email, setEmail] = useState(subform.Email);
    const [transactionAmount, setTransactionAmount] = useState(subform.Transaction_Amount);
    const [transactionDate, setTransactionDate] = useState(subform.Transaction_Date);
    const [error, iserror] = useState(false);
    const [openOnSuccess, setOpenOnSuccess] = React.useState(false);
    const [openOnError, setOpenOnError] = React.useState(false);
    const [loading, setLoading] = useState(true);
    const [isChange, setIsChange] = useState(false);


    const handleCloseOnSuccess = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    };


    const handleUpdate = async () => {
        //console.log(dealTransactionsId)
        const UpdatedRow = {
            "id": dealTransactionsId,
            "Transaction_Name": transactionName,
            "Email": email,
            "Transaction_Amount": transactionAmount,
            "Transaction_Date": transactionDate
        }

        const config = {
            Entity: "Deals",
            APIData: {
                id: DealId,
                Deal_Transactions: [...dealTransactions, UpdatedRow]
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
        onSuccess()
        onClose()
    };


    return (
        <Dialog open onClose={onClose}>
            <DialogTitle>Update Row</DialogTitle>

            <DialogContent>
                <TextField
                    required
                    fullWidth
                    label="Transaction_Name"
                    variant="standard"
                    value={transactionName}
                    onChange={(e) => {setTransactionName(e.target.value), setIsChange(true)}}
                    sx={{ mb: 3 }}
                />

                <TextField
                    required
                    fullWidth
                    label="Email"
                    variant="standard"
                    value={email}
                    onChange={(e) => {setEmail(e.target.value), setIsChange(true)}}
                    sx={{ mb: 3 }}
                />


                <TextField
                    required
                    fullWidth
                    type="number"
                    label="Transaction_Amount"
                    variant="standard"
                    value={transactionAmount}
                    onChange={(e) => {setTransactionAmount(e.target.value), setIsChange(true)}}
                    sx={{ mb: 3 }}
                />

                <TextField
                    required
                    fullWidth
                    type="date"
                    label="Transaction_Date"
                    variant="standard"
                    value={transactionDate}
                    onChange={(e) => {setTransactionDate(e.target.value), setIsChange(true)}}
                    sx={{ mb: 3 }}
                />
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                {isChange || (transactionName !== subform.Transaction_Name && email !== subform.Email && transactionAmount != subform.Transaction_Amount && transactionDate != subform.Transaction_Date) ? <Button onClick={handleUpdate}>Save</Button> : <Button disabled onClick={handleUpdate}>Save</Button>}

            </DialogActions>
        </Dialog>
    );
}