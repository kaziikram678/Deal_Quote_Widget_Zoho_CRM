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

export default function EditQuoteTest({ quote, onClose, onSuccess, quote_stage_list }) {
    //console.log(quote.Valid_Till)
    const [subject, setSubject] = useState(quote.Subject);
    const [quoteStage, setQuoteStage] = useState(quote.Quote_Stage);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [products, setProducts] = useState([]);

    const [open, setOpen] = React.useState(false);
    const [saving, setSaving] = useState(false);
    const [validTill, setValidTill] = useState(quote.Valid_Till);
    const [isChange, setIsChange] = useState(false);

    const [lineItems, setLineItems] = useState([]);


    ///////////////////////////Snakebar//////////////////////////

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    };

    const getProducts = async () => {
        const product = await ZOHO.CRM.API.getAllRecords({ Entity: "Products", sort_order: "asc", per_page: 200, page: 1 })
            .then(function (data) {
                //console.log(data)
                setProducts(data.data);
            })
    };

    useEffect(() => {
        getProducts();
    }, [onSuccess]);

    const getProductDetails = () => {
        //console.log(quote.Products_details);

        const selected = quote.Products_details.map((item) => {
            return {
                productId: item.product.id,
                name: item.product.name,
                quantity: item.quantity,
                price: item.list_price,
            }
        })

        //console.log(selected);

        setLineItems(selected)
    }

    //console.log(lineItems)

    useEffect(() => {
        getProductDetails();
    }, [onSuccess]);


    const addProduct = () => {
        setLineItems([
            ...lineItems,
            { productId: "", name: "", quantity: 1, price: 0 }
        ]);
        setIsChange(true);
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

    const handleUpdate = async () => {
        await ZOHO.CRM.API.updateRecord({
            Entity: "Quotes",
            APIData: {
                id: quote.id,
                Subject: subject,
                Quote_Stage: quoteStage,
                // Valid_Till: validTill,
                Product_Details: lineItems.map((product) => ({
                    product: {
                        id: product.productId,
                    },
                    quantity: product.quantity,
                    list_price: product.price,
                }))
            },
        }).catch(() => {
            setSaving(false);
        });;

        onClose();
        onSuccess();
        setValidTill("");
    };

     const grandTotal = lineItems.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
    );


    return (
        <Dialog open onClose={onClose}>
            <DialogTitle>Update Quote</DialogTitle>

            <DialogContent>
                <TextField
                    required
                    fullWidth
                    label="Subject"
                    variant="standard"
                    value={subject}
                    onChange={
                        (e) => {
                            setSubject(e.target.value);
                            setIsChange(true)
                        }
                    }
                />

                <Divider sx={{ mb: 2 }} />

                <FormControl sx={{ my: 1, width: 500 }}>
                    <InputLabel id="demo-multiple-name-label">
                        Stage
                    </InputLabel>
                    <Select
                        labelId="demo-multiple-name-label"
                        id="demo-multiple-name"
                        label="Quote_Stage"
                        name="Stage"
                        value={quoteStage}
                        onChange={(e) => { setQuoteStage(e.target.value); setIsChange(true) }}
                        input={<OutlinedInput label="Quote_Stage" />}
                        MenuProps={MenuProps}
                    >
                        {quote_stage_list.map((item) => (
                            <MenuItem key={item} value={item}>
                                {item}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DatePicker']}>
            <DatePicker
              disablePast
              label="Valid_Till"
              format="DD/MM/YYYY"
              value={validTill}
              onChange={(e) => setValidTill(e)}
            />
          </DemoContainer>
        </LocalizationProvider> */}

                {/* <TextField
          fullWidth
          type="date"
          label="Valid_Till"
          variant="standard"
          value={validTill}
          onChange={(e) => { setValidTill(e.target.value); setIsChange(true) }}
        /> */}


                <Divider sx={{ mb: 2 }} />

                {lineItems.map((item, index) => (

                    <Paper key={index} sx={{ p: 2, mb: 2 }}>

                        <Box display="flex" gap={2} alignItems="center">


                            <FormControl sx={{ minWidth: 220 }}>
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
                <Button onClick={onClose}>Cancel</Button>
                {isChange || (subject !== quote.Subject && quoteStage !== quote.Quote_Stage) ? <Button onClick={handleUpdate}>Save</Button> : <Button disabled onClick={handleUpdate}>Save</Button>}

            </DialogActions>
        </Dialog>
    );
}