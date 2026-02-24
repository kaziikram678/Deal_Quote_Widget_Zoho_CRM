import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";

const ZOHO = window.ZOHO;

export default function AddQuote({ DealId, onSuccess }) {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");

  const handleCreate = async () => {
    var recordData = {
      "Subject": subject,
      "Deal_Name": {
        "id": DealId,
      },
      "Product_Details": [{
        "product": {
          "id": "7043653000002686003",
          "name": "Hard Drive"
        },
        "quantity": 1,
        "list_price": 120,
      },],
    }
    await ZOHO.CRM.API.insertRecord({ Entity: "Quotes", APIData: recordData }).then(function (data) {
      console.log(data);
    });

    setOpen(false);
    setSubject("");
    onSuccess();
  };

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
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleCreate}>Create</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}