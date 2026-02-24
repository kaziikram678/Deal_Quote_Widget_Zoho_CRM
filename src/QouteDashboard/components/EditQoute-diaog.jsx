import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem
} from "@mui/material";
import { useState } from "react";

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

const Quote_Stage = [
  'Draft',
  'Negotiation',
  'Delivered',
  'On Hold',
  'Confirmed',
  'Closed Won',
  'Closed Lost'
];

const ZOHO = window.ZOHO;

export default function UpdateDialog({ quote, onClose, onSuccess }) {
  const [subject, setSubject] = useState(quote.Subject);
  const [quoteStage, setQuoteStage] = useState(quote.Quote_Stage);

  const handleUpdate = async () => {
    await ZOHO.CRM.API.updateRecord({
      Entity: "Quotes",
      APIData: {
        id: quote.id,
        Subject: subject,
        Quote_Stage: quoteStage
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


        <FormControl sx={{ my: 1, width: 500 }}>
          <InputLabel id="demo-multiple-name-label">
            Stage
          </InputLabel>
          <Select
            labelId="demo-multiple-name-label"
            id="demo-multiple-name"
            label="Quote_Stage"
            name="Stage"
            value={quoteStage}
            onChange={(e) => setQuoteStage(e.target.value)}
            input={<OutlinedInput label="Quote_Stage" />}
            MenuProps={MenuProps}
          >
            {Quote_Stage.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleUpdate}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}