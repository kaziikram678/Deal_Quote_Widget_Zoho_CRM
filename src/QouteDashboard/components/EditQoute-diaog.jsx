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

export default function UpdateDialog({ quote, onClose, onSuccess, quote_stage_list }) {
  //console.log(quote.Valid_Till)
  const [subject, setSubject] = useState(quote.Subject);
  const [quoteStage, setQuoteStage] = useState(quote.Quote_Stage);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [products, setProducts] = useState([]);

  const [open, setOpen] = React.useState(false);
  const [saving, setSaving] = useState(false);
  const [validTill, setValidTill] = useState(quote.Valid_Till);
  const [isChange, setIsChange] = useState(false);

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
        id: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        list_price: item.list_price,
      }
    })

    //console.log(selected);

    setSelectedProducts(selected)
  }

  useEffect(() => {
    getProductDetails();
  }, [onSuccess]);

  const handleUpdate = async () => {
    await ZOHO.CRM.API.updateRecord({
      Entity: "Quotes",
      APIData: {
        id: quote.id,
        Subject: subject,
        Quote_Stage: quoteStage,
        Valid_Till: validTill,
        Product_Details: selectedProducts.map((product) => ({
          product: {
            id: product.id,
          },
          quantity: product.quantity,
          list_price: product.list_price,
        }))
      },
    }).catch(() => {
      setSaving(false);
    });;

    onClose();
    onSuccess();
    setValidTill("");
  };

  const grandTotal = selectedProducts.reduce(
    (sum, p) => sum + p.quantity * p.list_price,
    0
  );

  const removeSelectedItem = (index) => {
    const updatedSelectedItem = selectedProducts.filter((item) => item.id != index)

    setSelectedProducts(updatedSelectedItem);
  }

  const increaseProductQuantity = (index) => {
    const increase = selectedProducts.filter((item) =>
      item.id == index ? item.quantity += 1 : item.quantity
    )

    setSelectedProducts(increase)
  }

  const decreaseProductQuantity = (index) => {
    const decrease = selectedProducts.filter((item) =>
      item.id == index ? item.quantity -= 1 : item.quantity
    )

    setSelectedProducts(decrease)
  }



  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>Edit Quote</DialogTitle>

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

        <FormControl sx={{ my: 1, width: 500 }}>
          <InputLabel>
            Select Products
          </InputLabel>
          <Select
            label="Products"
            multiple
            value={selectedProducts.map((product) => product.id)}
            onChange={(e) => {
              const ids = e.target.value;
              const selected = ids.map((id) => {
                const product = products.find((p) => p.id === id)

                return {
                  id: product.id,
                  name: product.Product_Name,
                  quantity: 1,
                  list_price: product.Unit_Price
                };
              });

              setSelectedProducts(selected);
              setIsChange(true)
            }}
            input={<OutlinedInput label="Select Products" />}
            MenuProps={MenuProps}
          >
            {products.map((product) => (
              <MenuItem key={product.id} value={product.id}>
                {product.Product_Name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedProducts.map((p, index) => (
          <Paper key={p.id} sx={{ p: 2, mb: 1 }}>
            <Typography fontWeight={"bold"}>{p.name}</Typography>

            <Box sx={{ display: "flex", gap: 2, mt: 1 }}>

              <TextField
                type="number"
                fullWidth
                label="Quantity"
                variant="standard"
                value={p.quantity}
                onChange={(e) => {
                  const selected = [...selectedProducts];
                  selected[index].quantity = Number(e.target.value);
                  setSelectedProducts(selected);
                }}
              >
              </TextField>

              <IconButton onClick={() => increaseProductQuantity(selectedProducts[index].id)}>
                <AddIcon />
              </IconButton>

              <IconButton onClick={() => decreaseProductQuantity(selectedProducts[index].id)}>
                <RemoveIcon />
              </IconButton>



              <IconButton onClick={() => removeSelectedItem(selectedProducts[index].id)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </Paper>
        ))}

        <TextField
          fullWidth
          label="Grand_Total"
          variant="standard"
          value={grandTotal}
          sx={{ mt: 2 }}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        {isChange || (subject !== quote.Subject && quoteStage !== quote.Quote_Stage && validTill !== quote.Valid_Till) ? <Button onClick={handleUpdate}>Save</Button> : <Button disabled onClick={handleUpdate}>Save</Button>}

      </DialogActions>
    </Dialog>
  );
}