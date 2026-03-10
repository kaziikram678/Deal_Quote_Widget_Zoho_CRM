import './App.css';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { DealDashboard } from './DealDetails';
import { LeadSearch } from './LeadSearch';
import React, { useEffect, useState, useReducer } from "react";
import UpdateLeadData from './UpdateLeadData';
import DealDetails from './DealDetails';
import MenuAppBar from './QouteDashboard/components/Dashboard-header';
import QuoteTable from './QouteDashboard/components/Qoute-table';
import { reducer, initialState } from './QouteDashboard/components/QouteReducer_new';
import AddQuote from './QouteDashboard/components/AddQoute_Dialouge';
const darkTheme = createTheme({
  palette: { mode: "dark" },
});

const ZOHO = window.ZOHO;

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const [zohoLoaded, setZohoLoaded] = useState(false);
  const [moduleName, setModuleName] = useState("");
  const [entityId, setEntityId] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    ZOHO.embeddedApp.on("PageLoad", function (data) {

      ZOHO.CRM.UI.Resize({ height: "1500", width: "1050" }).then(function (data) {
        console.log(data);
      });
      setModuleName(data.Entity);
      setEntityId(data.EntityId[0]);
     // console.log(data);
      setZohoLoaded(true);
    });

    ZOHO.embeddedApp.init()
  }, []);

  /////////////////////DealForm////////////////////////

  const [formDataList, setformDataList] = useState({
    Deal_Name: "",
    Amount: "",
    Account_Name: "",
    Account_Id: "",
    Contact_Phone: 0,
    Contact_Id: "",
    Stage: [],
  });

  useEffect(() => {
    if (moduleName && entityId) {
      ZOHO.CRM.API.getRecord({
        Entity: moduleName,
        RecordID: entityId,
      })
        .then(function (response) {
          const deal = response.data[0];
          //console.log(deal.Contact_Name.id);
          setformDataList({
            Deal_Name: deal.Deal_Name,
            Amount: deal.Amount,
            Account_Name: deal.Account_Name.name,
            Account_Id: deal.Account_Name.id,
            Contact_Name: deal.Contact_Name.name,
            Contact_Id: deal.Contact_Name.id,
            Contact_Phone: deal.Contact_Phone,
            Stage: deal.Stage,
          });

          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [moduleName, entityId]);

  if (!zohoLoaded || !moduleName || !formDataList) {
    return <>Fetching Data. Please wait...</>
  }
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <DealDetails DealId={entityId} moduleName={moduleName} formDataList = {formDataList} loading={loading}  Account_Id={formDataList.Account_Id} Contact_Id={formDataList.Contact_Id}/>
      <MenuAppBar>
        <AddQuote DealId={entityId} onSuccess={() => { }} />
      </MenuAppBar>
    </ThemeProvider>
  );
}

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
  IconButton
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";

import { useEffect, useState } from "react";

const ZOHO = window.ZOHO;

const QUOTE_STAGES = [
  "Draft",
  "Negotiation",
  "Delivered",
  "On Hold",
  "Confirmed",
  "Closed Won",
  "Closed Lost"
];

export default function AddQuote({ DealId, onSuccess }) {

  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [stage, setStage] = useState("");

  const [products, setProducts] = useState([]);

  const [lineItems, setLineItems] = useState([
    { productId: "", name: "", quantity: 1, price: 0 }
  ]);

  /* ---------------- Fetch Products ---------------- */

  const getProducts = async () => {
    const res = await ZOHO.CRM.API.getAllRecords({
      Entity: "Products",
      per_page: 200,
      page: 1
    });

    setProducts(res.data || []);
  };

  useEffect(() => {
    if (open) getProducts();
  }, [open]);

  /* ---------------- Add Line Item ---------------- */

  const addProductRow = () => {
    setLineItems([
      ...lineItems,
      { productId: "", name: "", quantity: 1, price: 0 }
    ]);
  };

  /* ---------------- Remove Line Item ---------------- */

  const removeProductRow = (index) => {
    const updated = [...lineItems];
    updated.splice(index, 1);
    setLineItems(updated);
  };

  /* ---------------- Change Product ---------------- */

  const handleProductChange = (index, productId) => {

    const product = products.find((p) => p.id === productId);

    const updated = [...lineItems];

    updated[index] = {
      ...updated[index],
      productId,
      name: product.Product_Name,
      price: product.Unit_Price || 0
    };

    setLineItems(updated);
  };

  /* ---------------- Quantity Controls ---------------- */

  const increaseQty = (index) => {
    const updated = [...lineItems];
    updated[index].quantity += 1;
    setLineItems(updated);
  };

  const decreaseQty = (index) => {
    const updated = [...lineItems];
    if (updated[index].quantity > 1) {
      updated[index].quantity -= 1;
    }
    setLineItems(updated);
  };

  /* ---------------- Grand Total ---------------- */

  const grandTotal = lineItems.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  /* ---------------- Create Quote ---------------- */

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

          {/* Subject */}

          <TextField
            fullWidth
            label="Subject"
            variant="standard"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            sx={{ mb: 3 }}
          />

          {/* Stage */}

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Stage</InputLabel>

            <Select
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              input={<OutlinedInput label="Stage" />}
            >
              {QUOTE_STAGES.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>

          </FormControl>

          {/* Product Rows */}

          {lineItems.map((item, index) => (

            <Paper key={index} sx={{ p: 2, mb: 2 }}>

              <Box display="flex" gap={2} alignItems="center">

                {/* Product Select */}

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

                {/* Quantity */}

                <Box display="flex" alignItems="center">

                  <IconButton onClick={() => decreaseQty(index)}>
                    <RemoveIcon />
                  </IconButton>

                  <Typography>{item.quantity}</Typography>

                  <IconButton onClick={() => increaseQty(index)}>
                    <AddIcon />
                  </IconButton>

                </Box>

                {/* Unit Price */}

                <Typography>
                  Unit Price: {item.price}
                </Typography>

                {/* Line Total */}

                <Typography>
                  Total: {item.quantity * item.price}
                </Typography>

                {/* Delete Row */}

                <IconButton onClick={() => removeProductRow(index)}>
                  <DeleteIcon />
                </IconButton>

              </Box>

            </Paper>

          ))}

          {/* Add Product Button */}

          <Button
            startIcon={<AddIcon />}
            onClick={addProductRow}
          >
            Add Product
          </Button>

          {/* Grand Total */}

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

          <Button
            variant="contained"
            onClick={handleCreate}
          >
            Create Quote
          </Button>

        </DialogActions>

      </Dialog>
    </>
  );
        }
