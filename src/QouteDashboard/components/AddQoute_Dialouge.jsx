import { DataGrid } from "@mui/x-data-grid";
import {
  Paper,
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
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Box

} from "@mui/material";
import { useState, useEffect } from "react";

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

export default function AddQuote({ DealId, onSuccess, quote_stage_list }) {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [stage, setStage] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);



  const getProducts = async () => {
    const product = await ZOHO.CRM.API.getAllRecords({ Entity: "Products", sort_order: "asc", per_page: 200, page: 1 })
      .then(function (data) {
        //console.log(data)
        setProducts(data.data);
      })
  };

  useEffect(() => {
    getProducts();
  }, [DealId]);


  const handleCreate = async () => {
    var recordData = {
      "Subject": subject,
      "Quote_Stage": stage,
      "Deal_Name": {
        "id": DealId,
      },
      "Product_Details": selectedProducts.map((product) => ({
        "product": {
          "id": product.id,
        },
        "quantity": product.quantity,
        "list_price": product.list_price,
      }))
    }

    await ZOHO.CRM.API.insertRecord({ Entity: "Quotes", APIData: recordData }).then(function (data) {
      console.log(data);
    });

    setOpen(false);
    setSubject("");
    setStage("");
    onSuccess();
    setSelectedProducts([]);
  };


  const grandTotal = selectedProducts.reduce(
    (sum, p) => sum + p.quantity * p.list_price,
    0
  );

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Create Quote
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create Quote</DialogTitle>

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
              value={stage}
              onChange={(e) => setStage(e.target.value)}
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

          <TextField
            fullWidth
            label="Grand_Total"
            variant="standard"
            value={grandTotal}
            sx={{ mt: 2 }}
          />
        </DialogContent >

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleCreate}>Create</Button>
        </DialogActions>
      </Dialog >
    </>
  );
}