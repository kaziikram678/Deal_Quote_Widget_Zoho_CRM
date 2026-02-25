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
  MenuItem
} from "@mui/material";
import { useState } from "react";

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

const Quote_Stage = [
  'Draft',
  'Negotiation',
  'Delivered',
  'On Hold',
  'Confirmed',
  'Closed Won',
  'Closed Lost'
];

const ZOHO = window.ZOHO;

export default function UpdateDialog({ quote, onClose, onSuccess }) {
  const [subject, setSubject] = useState(quote.Subject);
  const [quoteStage, setQuoteStage] = useState(quote.Quote_Stage);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [products, setProducts] = useState([]);

  setProducts(quote.Product_Details);
  console.log(quote);
  console.log(quote.Product_Details);

  const handleUpdate = async () => {
    await ZOHO.CRM.API.updateRecord({
      Entity: "Quotes",
      APIData: {
        id: quote.id,
        Subject: subject,
        Quote_Stage: quoteStage
      },
    });

    onClose();
    onSuccess();
  };

  const grandTotal = selectedProducts.reduce(
    (sum, p) => sum + p.quantity * p.list_price,
    0
  );


  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>Edit Quote</DialogTitle>

      <DialogContent>
        <TextField
          fullWidth
          label="Subject"
          variant="standard"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />


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
            onChange={(e) => setQuoteStage(e.target.value)}
            input={<OutlinedInput label="Quote_Stage" />}
            MenuProps={MenuProps}
          >
            {Quote_Stage.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>


        <FormControl sx={{ my: 1, width: 500 }}>
          <InputLabel>
            Select Products
          </InputLabel>
          <Select
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
            </Box>
          </Paper>
        ))}

        {/* <TextField
            type="number"
            fullWidth
            label="Quantity"
            variant="standard"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          /> */}

        {/* <TextField
            type="number"
            fullWidth
            label="List Price"
            variant="standard"
            value={listPrice}
            onChange={(e) => setListPrice(e.target.value)}
          /> */}

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
        <Button onClick={handleUpdate}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}