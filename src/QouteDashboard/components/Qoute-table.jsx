import { DataGrid } from "@mui/x-data-grid";
import {
  Paper,
  Box,
  Typography,
  IconButton,
  Button,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import React ,{ useEffect, useState } from "react";
import UpdateDialog from "./EditQoute-diaog"
import AddQuote from "./AddQoute_Dialouge";
import {
  Card,
  CardContent,
} from "@mui/material";

const ZOHO = window.ZOHO;

export default function QuoteTable({ DealId }) {
  const [quotes, setQuotes] = useState([]);
  const [editQuote, setEditQuote] = useState(null);
  const [products, setProducts] = useState([]);


  const [saving, setSaving] = useState(false);


  const [open, setOpen] = React.useState(false);

  ///////////////////////////Snakebar//////////////////////////

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };


  const getQuotes = async () => {
    const quote = await ZOHO.CRM.API.getRelatedRecords({
      Entity: "Deals",
      RecordID: DealId,
      RelatedList: "Quotes",
      page: 1,
      per_page: 200,
    }).catch(() => {
      setSaving(false);
    });;

    console.log(quote);

    const rows = (quote.data || []).map((item) => ({
      id: item.id,
      Subject: item.Subject,
      Quote_Stage: item.Quote_Stage,
      Grand_Total: item.Grand_Total,
      Valid_Till: item.Valid_Till,
      Products: item.Product_Details.map((item) => item.product.name),
      Products_details: item.Product_Details.map((item) => item),
    }));

    setQuotes(rows);
    {
      rows.map((item) => {
        console.log(item.Products_details);
      })
    }
  };

  useEffect(() => {
    getQuotes();
  }, [DealId]);

  const handleDelete = async (id) => {
    await ZOHO.CRM.API.deleteRecord({
      Entity: "Quotes",
      RecordID: id,
    });
    getQuotes();
  };

  const columns = [
    { field: "Subject", headerName: "Subject", width: 250 },
    { field: "Quote_Stage", headerName: "Stage", width: 150 },
    { field: "Grand_Total", headerName: "Total", width: 150 },
    { field: "Products", headerName: "Products", width: 300 },
    {
      field: "actions",
      headerName: "Action",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => setEditQuote(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <>
      <Box
        sx={{
          minHeight: "50vh",
          // display: "flex",
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
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography variant="h6">Related Quotes</Typography>
              <AddQuote DealId={DealId} onSuccess={getQuotes} />
            </Box>

            <Paper sx={{ height: 420 }}>
              <DataGrid
                rows={quotes}
                columns={columns}
                disableRowSelectionOnClick
                pageSizeOptions={[5, 10]}
              />
            </Paper>

            <Box mt={1}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleQuoteUpdate}
                disabled={saving}
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
                  message="Deal Updated Successfully"
                />
                {saving ? (
                  <CircularProgress size={22} color="inherit" />
                ) : (
                  "Save Changes"
                )}
              </Button>
            </Box>

            {editQuote && (
              <UpdateDialog
                quote={editQuote}
                onClose={() => setEditQuote(null)}
                onSuccess={getQuotes}
              />
            )}
          </CardContent>
        </Card>
      </Box>
    </>
  );
}