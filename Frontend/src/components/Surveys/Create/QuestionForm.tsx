import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { useNotify } from 'react-admin';

const QuestionForm = ({ open, onClose, onQuestionCreated }) => {
  const [question, setQuestion] = useState('');
  const [type, setType] = useState('');
  const notify = useNotify();

  const handleSubmit = async () => {
    const payload = {
      text: question,
      type: type,
    };

    try {
      const response = await fetch('https://staff-score.vercel.app/api/questions', {
        //'http://localhost:3000/api/questions'
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const newQuestion = await response.json();
        notify('Question created successfully!');
        onQuestionCreated(newQuestion);
        onClose();
      } else {
        notify('Failed to create question',);
      }
    } catch (error) {
      notify(`Error: ${error.message}`)
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle id="form-dialog-title">Create Question</DialogTitle>
      <DialogContent>
        <form>
          <TextField
            label="Question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            fullWidth
            required
          />
          <RadioGroup
            value={type}
            onChange={(e) => setType(e.target.value)}
            row
          >
            <FormControlLabel value="scale_1_5" control={<Radio />} label="Scale 1-5" />
            <FormControlLabel value="yes_no" control={<Radio />} label="Yes/No" />
          </RadioGroup>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Save
          </Button>
          <Button onClick={onClose} color="secondary" variant="contained">
            Cancel
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionForm;
