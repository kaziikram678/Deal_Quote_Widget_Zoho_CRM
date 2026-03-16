import { DataGrid } from "@mui/x-data-grid";
import {
  Paper,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
} from "@mui/material";
import AddQuoteTest2 from "./AddQuoteTest2";
import EditQuoteTest from "./EditQuoteTest";
import QuoteTotalBarChart from "../../BarChart/QuoteTotal";
import { QuoteData } from "../../BarChart/dataset/QuoteDataset";

const ZOHO = window.ZOHO;

export default function QuoteTable({ DealId, moduleName, formDataList, loading }) {
  const [quotes, setQuotes] = useState([]);
  const [editQuote, setEditQuote] = useState(null);
  const [saving, setSaving] = useState(false);
  const [quoteStageList, setQuoteStageList] = useState([])
  const [formData, setformData] = useState({});


  const quote_stage_list = quoteStageList.toString().split(",");

  useEffect(() => {
    setformData(formDataList)
  }, [formDataList])

  useEffect(() => {
    var func_name = "qoute_stage_for_widget";
    var req_data = {
      "arguments": JSON.stringify({
      })
    };
    ZOHO.CRM.FUNCTIONS.execute(func_name, req_data)
      .then(function (data) {
        setQuoteStageList(data.details.output);
      })
  }, [quoteStageList])


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


  const ExternalLink = (quoteId, subject) => (
    <a href={`https://crm.zoho.com/crm/org902039596/tab/Quotes/${quoteId}`} target="_blank" rel="noopener noreferrer">
      {subject}
    </a>

  );

  const columns = [
    {
      field: "Subject", headerName: "Subject", width: 280,
      renderCell: (params) => (
        ExternalLink(params.row.id, params.row.Subject)
      )
    },
    { field: "Quote_Stage", headerName: "Stage", width: 150 },
    { field: "Grand_Total", headerName: "Total", width: 100 },
    { field: "Products", headerName: "Products", width: 300 },
    {
      field: "actions",
      headerName: "Action",
      width: 110,
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
              <AddQuoteTest2 DealId={DealId} onSuccess={getQuotes} quote_stage_list={quote_stage_list} />
            </Box>

            <Paper sx={{ height: 365 }}>
              <DataGrid
                sx={{
                  boxShadow: 2,
                  border: 2,
                  borderColor: 'primary.light',
                  '& .MuiDataGrid-cell:hover': {
                    color: 'primary.main',
                  },
                }}
                rows={quotes}
                columns={columns}
                hideFooterSelectedRowCount
                initialState={{
                  pagination: { paginationModel: { pageSize: 5 } },
                }}
                pageSizeOptions={[5, 10, 100, { value: -1, label: 'All' }]}
              />
            </Paper>

            {editQuote && (
              <EditQuoteTest
                quote={editQuote}
                onClose={() => setEditQuote(null)}
                onSuccess={getQuotes}
                quote_stage_list={quote_stage_list}
              />
            )}

            
            <QuoteData quotes = {quotes}/>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}

