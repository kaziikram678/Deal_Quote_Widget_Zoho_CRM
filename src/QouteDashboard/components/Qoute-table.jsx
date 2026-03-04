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
import React, { useEffect, useState } from "react";
import UpdateDialog from "./EditQoute-diaog"
import AddQuote from "./AddQoute_Dialouge";
import {
  Card,
  CardContent,
} from "@mui/material";

const ZOHO = window.ZOHO;

export default function QuoteTable({ DealId, moduleName, formDataList, loading}) {
  const [quotes, setQuotes] = useState([]);
  const [editQuote, setEditQuote] = useState(null);
  const [saving, setSaving] = useState(false);
  const [quoteSaving, setQuoteSaving] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [quoteStageList, setQuoteStageList] = useState([])
  const [formData, setformData] = useState({});

  const quote_stage_list = quoteStageList.toString().split(",");

  // console.log(formDataList)

  // console.log(formData);
  useEffect(() => {
    setformData(formDataList)
  }, [formDataList])

  ///////////////////////////Snakebar//////////////////////////

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  /////////////////////GetQuoteStage/////////////////////////////

  useEffect(() => {
      var func_name = "qoute_stage_for_widget";
      var req_data = {
        "arguments": JSON.stringify({
        })
      };
      ZOHO.CRM.FUNCTIONS.execute(func_name, req_data)
        .then(function (data) {
          //console.log(data);
          setQuoteStageList(data.details.output);
        })
    }, [quoteStageList])

    ///console.log(quoteStageList);
  

  ////////////////////////////Quote Update////////////////////////
  // console.log(formData.Contact_Name);


  const handleQuoteUpdate = async () => {
    setQuoteSaving(true);
    setOpen(true);
    console.log(formData.Contact_Name);
    const config = {
      Entity: moduleName,
      APIData: {
        id: DealId,
        Deal_Name: formData.Deal_Name,
        Account_Name: formData.Account_Name,
        Valid_Till: formData.Valid_Till,
        Amount: formData.Amount,
        Contact_Phone: formData.Contact_Phone,
        Stage: formData.Stage,
      },
    };

    await ZOHO.CRM.API.updateRecord(config)
      .then(function () {
        setQuoteSaving(false);
      })
      .catch(() => {
        setQuoteSaving(false);
      });

    await ZOHO.CRM.UI.Popup.closeReload()
      .then(function (data) {
        console.log(data)
      })

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
    });

    //console.log(quote);

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
    { field: "Subject", headerName: "Subject", width: 200 },
    { field: "Quote_Stage", headerName: "Stage", width: 150 },
    { field: "Grand_Total", headerName: "Total", width: 100 },
    { field: "Valid_Till", headerName: "Valid_Till", width: 100 },
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
              <AddQuote DealId={DealId} onSuccess={getQuotes} quote_stage_list={quote_stage_list} />
            </Box>

            <Paper sx={{ height: 420 }}>
              <DataGrid
                rows={quotes}
                columns={columns}
                disableRowSelectionOnClick
                pageSizeOptions={[5, 100, { value: 1000, label: '1,000' }, { value: -1, label: 'All' }]}
              />
            </Paper>

            <Box mt={1}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleQuoteUpdate}
                disabled={quoteSaving}
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
                {quoteSaving ? (
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
                quote_stage_list={quote_stage_list}
              />
            )}
          </CardContent>
        </Card>
      </Box>
    </>
  );
}

