import { DataGrid } from "@mui/x-data-grid";
import {
  Paper,
  Box,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import UpdateDialog from "./EditQoute-diaog"
import AddQuote from "./AddQoute-dialog";
import {
  Card,
  CardContent,
} from "@mui/material";
const ZOHO = window.ZOHO;

export default function QuoteTable({ DealId }) {
  const [quotes, setQuotes] = useState([]);
  const [editQuote, setEditQuote] = useState(null);

  const getQuotes = async () => {
    const quote = await ZOHO.CRM.API.getRelatedRecords({
      Entity: "Deals",
      RecordID: DealId,
      RelatedList: "Quotes",
      page: 1,
      per_page: 200,
    });

    console.log(quote);

    const rows = (quote.data || []).map((item) => ({
      id: item.id,
      Subject: item.Subject,
      Quote_Stage: item.Quote_Stage,
      Grand_Total: item.Grand_Total,
      Valid_Till: item.Valid_Till,
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
    { field: "Subject", headerName: "Subject", flex: 1 },
    { field: "Quote_Stage", headerName: "Stage", width: 150 },
    { field: "Grand_Total", headerName: "Total", width: 150 },
    { field: "Valid_Till", headerName: "Valid Till", width: 150 },
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