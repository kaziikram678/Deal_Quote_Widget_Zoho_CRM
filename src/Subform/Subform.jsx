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
import AddSubformData from "./AddSubformData";
import EditSubformData from "./EditSubformData";

const ZOHO = window.ZOHO

export default function Subform({ DealId }) {

  // console.log(Deal_Transactions)

  const [quotes, setQuotes] = useState([]);
  const [editDealTran, setEditQuote] = useState(null);

  const [open, setOpen] = useState(false)

  const [dealTransactions, setDealTransactions] = useState([]);

  const [editSubform, setEditSubform] = useState();

  const getDealTransactions = async () => {
    await ZOHO.CRM.API.getRecord({
      Entity: "Deals",
      RecordID: DealId,
    })
      .then(function (response) {
        const deal = response.data[0].Deal_Transactions;
        console.log(deal)
        const rows = (deal || []).map((item) => ({
          id: item.id,
          Transaction_Name: item.Transaction_Name,
          Email: item.Email,
          Transaction_Amount: item.Transaction_Amount,
          Transaction_Date: item.Transaction_Date
        }));

        setDealTransactions(rows);
      })
  };

  useEffect(() => {
    getDealTransactions();
  }, [DealId]);


  const handleDelete = async (id) => {

    const dealTransactionsAfterDelete = dealTransactions.filter((item) => item.id != id)

    console.log(dealTransactionsAfterDelete);
    //setDealTransactions(dealTransactionsAfterDelete);

    const config = {
      Entity: "Deals",
      APIData: {
        id: DealId,
        Deal_Transactions: [dealTransactionsAfterDelete]
      },
    };

    await ZOHO.CRM.API.updateRecord(config)
      .then(function (res) {
        console.log(res.data[0].status);
      })

    //setDealTransactions();
    setOpen(false);
    onSuccess()
    onClose()
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
          <IconButton onClick={() => setEditSubform(params.row)}>
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
              <AddSubformData DealId={DealId} onSuccess={getDealTransactions} dealTransactions={dealTransactions} />
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
            {editSubform && (
              <EditSubformData
                DealId={DealId}
                subform={editSubform}
                onClose={() => setEditSubform(null)}
                onSuccess={getDealTransactions}
                dealTransactions={dealTransactions}
              />
            )}
          </CardContent>
        </Card>
      </Box>
    </>
  )
}