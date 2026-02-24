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

export default function UpdateDialog({ quote, onClose, onSuccess }) {
  const [subject, setSubject] = useState(quote.Subject);

  const handleUpdate = async () => {
    await ZOHO.CRM.API.updateRecord({
      Entity: "Quotes",
      APIData: {
        id: quote.id,
        Subject: subject,
      },
    });

    onClose();
    onSuccess();
  };

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
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleUpdate}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}