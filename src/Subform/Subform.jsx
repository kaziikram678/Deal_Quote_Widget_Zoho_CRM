import { DataGrid } from "@mui/x-data-grid";
import {
  Paper,
  Box,
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Snackbar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
} from "@mui/material";

const ZOHO = window.ZOHO

export default function Subform({ DealId, Deal_Transactions }) {

  console.log(Deal_Transactions)

  const [quotes, setQuotes] = useState([]);
  const [editDealTran, setEditQuote] = useState(null);

  const [open, setOpen] = useState(false)

  const [dealTransactions, setDealTransactions] = useState([]);

  const [deleteTransaction, setDeleteTransaction] = useState(dealTransactions);

  

  const getDealTransactions = () => {
    const rows = (Deal_Transactions).map((item) => ({
      id: item.id,
      Transaction_Name: item.Transaction_Name,
      Email: item.Email,
      Transaction_Amount: item.Transaction_Amount,
      Transaction_Date: item.Transaction_Date,
    }));

    setDealTransactions(rows);

  }

  useEffect(() => {
    getDealTransactions();
  }, [Deal_Transactions]);

  const addRow = () => {

    return (
      <Dialog maxWidth="md" fullWidth>

        <DialogTitle>Create Quote</DialogTitle>

        <DialogContent>
          <TextField
            required
            fullWidth
            label="Subject"
            variant="standard"
            value={""}
            onChange={(e) => ""}
            sx={{ mb: 3 }}
          />

        </DialogContent>

      </Dialog>
    )

  }





  const handleDelete = async (id) => {
    const deleteItem = dealTransactions.filter((item) => item.id != id);

    // setDealTransactions(deleteItem)

    setDeleteTransaction(deleteItem)

  
    console.log(deleteTransaction)

    updateAfterDeletion();
  };


  const updateAfterDeletion = async () => {
    console.log(deleteTransaction)
    setDealTransactions(deleteTransaction)
    var config = {
      Entity: "Deals",
      APIData: {
        "id": DealId,
        "Deal_Transactions": dealTransactions
      },
    }
    await ZOHO.CRM.API.updateRecord(config)
      .then(function (data) {
        console.log(data)
      })

      console.log(dealTransactions)

      //getDealTransactions()
  }

  console.log(dealTransactions)


  const columns = [
    { field: "Transaction_Name", headerName: "Transaction_Name", width: 200 },
    { field: "Email", headerName: "Email", width: 200 },
    { field: "Transaction_Amount", headerName: "Transaction_Amount", width: 200 },
    { field: "Transaction_Date", headerName: "Transaction_Date", width: 250 },
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
              <Typography variant="h6">Deal Transactions</Typography>
              <Button variant="contained" onClick={addRow}>
                + Add New Row
              </Button>
              {/* <AddQuoteTest2 DealId={DealId} onSuccess={getQuotes} quote_stage_list={quote_stage_list} /> */}
            </Box>

            <Paper sx={{ height: 420 }}>
              <DataGrid
                sx={{
                  boxShadow: 2,
                  border: 2,
                  borderColor: 'primary.light',
                  '& .MuiDataGrid-cell:hover': {
                    color: 'primary.main',
                  },
                }}
                rows={dealTransactions}
                columns={columns}
                editMode="row"
                hideFooterSelectedRowCount
                pageSizeOptions={[5, 100, { value: 1000, label: '1,000' }, { value: -1, label: 'All' }]}
              />
            </Paper>

            {/* <Box mt={1}>
              <Button
                fullWidth
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
                {response == "success" ? <Snackbar
                  open={""}
                  autoHideDuration={3000}
                  onClose={""}
                  message="Deal Updated Successfully"
                /> :
                  <Snackbar
                    open={""}
                    autoHideDuration={3000}
                    onClose={""}
                    message="Invalid Data"
                  /> 
                }

                Save Changes
              </Button>
            </Box> */}

            {/* {editQuote && (
              <EditQuoteTest
                quote={editQuote}
                onClose={() => setEditQuote(null)}
                onSuccess={getQuotes}
                quote_stage_list={quote_stage_list}
              />
            )} */}
          </CardContent>
        </Card>
      </Box>
    </>
  )
}