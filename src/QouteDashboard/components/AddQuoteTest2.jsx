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


export default function AddQuoteTest2({ DealId, onSuccess, quote_stage_list }) {

    const [open, setOpen] = useState(false);
    const [subject, setSubject] = useState("");
    const [stage, setStage] = useState("");

    const [products, setProducts] = useState([]);

    const [iserror, setIsError] = useState(false);

    const [isProductSelected, setIsProductSelected] = useState(false)


    const [lineItems, setLineItems] = useState([
        { productId: "", name: "", quantity: 1, price: 0 }
    ]);

    const [openOnSuccess, setOpenOnSuccess] = React.useState(false);
    const [openOnError, setOpenOnError] = React.useState(false);



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

    const getProducts = async () => {
        const response = await ZOHO.CRM.API.getAllRecords({
            Entity: "Products",
            per_page: 200,
            page: 1
        });

        setProducts(response.data);
    };

    useEffect(() => {
        if (open) getProducts();
    }, [open]);


    const addProduct = () => {
        setLineItems([
            ...lineItems,
            { productId: "", name: "", quantity: 1, price: 0 }
        ]);
    };


    const removeProduct = (index) => {
        const updated = [...lineItems];
        updated.splice(index, 1);
        setLineItems(updated);
    };


    const handleProductChange = (index, productId) => {

        const product = products.find((p) => p.id === productId);

        const updated = [...lineItems];

        updated[index] = {
            ...updated[index],
            productId,
            name: product.Product_Name,
            price: product.Unit_Price
        };

        setLineItems(updated);
        setIsProductSelected(true)
        
    };


    const increaseProduct = (index) => {
        const updated = [...lineItems];
        updated[index].quantity += 1;
        setLineItems(updated);
    };

    const decreaseProduct = (index) => {
        const updated = [...lineItems];
        if (updated[index].quantity > 1) {
            updated[index].quantity -= 1;
        }
        setLineItems(updated);
    };


    const grandTotal = lineItems.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
    );


    const handleCreate = async () => {

        const recordData = {
            Subject: subject,
            Quote_Stage: stage,
            Deal_Name: { id: DealId },

            Product_Details: lineItems
                .filter((i) => i.productId)
                .map((item) => ({
                    product: { id: item.productId },
                    quantity: item.quantity,
                    list_price: item.price
                }))
        };

        await ZOHO.CRM.API.insertRecord({
            Entity: "Quotes",
            APIData: recordData
        });

        setOpen(false);
        setLineItems([{ productId: "", name: "", quantity: 1, price: 0 }]);
        setSubject("");
        setStage("");

        onSuccess();
    };

    return (
        <>
            <Button variant="contained" onClick={() => setOpen(true)}>
                + Create Quote
            </Button>

            <Dialog open={open} maxWidth="md" fullWidth>

                <DialogTitle>Create Quote</DialogTitle>

                <DialogContent>


                    <TextField
                        required
                        fullWidth
                        label="Subject"
                        variant="standard"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        sx={{ mb: 3 }}
                    />


                    <FormControl required fullWidth sx={{ mb: 3 }}>
                        <InputLabel>Stage</InputLabel>

                        <Select
                            required
                            value={stage}
                            onChange={(e) => setStage(e.target.value)}
                            input={<OutlinedInput label="Stage" />}
                        >
                            {quote_stage_list.map((s) => (
                                <MenuItem key={s} value={s}>
                                    {s}
                                </MenuItem>
                            ))}
                        </Select>

                    </FormControl>


                    {lineItems.map((item, index) => (

                        <Paper key={index} sx={{ p: 2, mb: 2 }}>

                            <Box display="flex" gap={2} alignItems="center">


                                <FormControl required sx={{ minWidth: 220 }}>
                                    <InputLabel>Product</InputLabel>

                                    <Select
                                        value={item.productId}
                                        onChange={(e) =>
                                            handleProductChange(index, e.target.value)
                                        }
                                        input={<OutlinedInput label="Product" />}
                                    >
                                        {products.map((p) => (
                                            <MenuItem key={p.id} value={p.id}>
                                                {p.Product_Name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>


                                <Box display="flex" alignItems="center">

                                    <IconButton onClick={() => decreaseProduct(index)}>
                                        <RemoveIcon />
                                    </IconButton>

                                    <Typography>{item.quantity}</Typography>

                                    <IconButton onClick={() => increaseProduct(index)}>
                                        <AddIcon />
                                    </IconButton>

                                </Box>

                                <Typography>
                                    Unit Price: {item.price}
                                </Typography>

                                <Typography>
                                    Total: {item.quantity * item.price}
                                </Typography>

                                <IconButton disabled={index === 0} onClick={() => removeProduct(index)}>
                                    <DeleteIcon />
                                </IconButton>

                            </Box>

                        </Paper>

                    ))}

                    <Button
                        startIcon={<AddIcon />}
                        onClick={addProduct}
                    >
                        Add Product
                    </Button>

                    <Typography
                        variant="h6"
                        sx={{ mt: 3 }}
                    >
                        Grand Total: {grandTotal}
                    </Typography>

                </DialogContent>

                <DialogActions>

                    <Button onClick={() => setOpen(false)}>
                        Cancel
                    </Button>

                    {/* <Button
                        variant="contained"
                        onClick={handleCreate}
                    >
                        Create Quote
                    </Button> */}


                    {(subject && stage &&  isProductSelected ) ? (
                        <Button
                        variant="contained"
                        size="large"
                        onClick={handleCreate}
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
                            message="Quote Created Successfully"
                        /> : <Snackbar
                            open={openOnError}
                            autoHideDuration={3000}
                            onClose={handleCloseOnError}
                            message="Invalid Data"
                        />
                        }
                        Create Quote
                    </Button>
                    ) :  <Button
                    disabled
                        variant="contained"
                        size="large"
                        onClick={handleCreate}
                        //disabled={quoteSaving}
                        sx={{
                            textTransform: "none",
                            borderRadius: 2,
                            py: 1.2,
                        }}
                    >
                        Create Quote
                    </Button>}

                   

                </DialogActions>

            </Dialog>
        </>
    );
}