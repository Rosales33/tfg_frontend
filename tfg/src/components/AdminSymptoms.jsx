import React, { useState, useEffect } from 'react';
import {
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Box,
  Snackbar,
  Alert
} from '@mui/material';
import { createSymptom, updateSymptom, deleteSymptom, getSymptoms } from '../api';

const AdminSymptoms = () => {
  const [symptoms, setSymptoms] = useState([]);
  const [form, setForm] = useState({ symptomId: null, name: '', severity: '' });
  const [message, setMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarType, setSnackbarType] = useState('success'); // 'success' | 'error'

  const fetchSymptoms = async () => {
    try {
      const res = await getSymptoms();
      setSymptoms(res.data);
    } catch (err) {
      console.error('Error fetching symptoms:', err);
    }
  };

  useEffect(() => {
    fetchSymptoms();
  }, []);

  const showMessage = (msg, type = 'success') => {
    setMessage(msg);
    setSnackbarType(type);
    setSnackbarOpen(true);
  };

  const handleSave = async () => {
    const severityNum = Number(form.severity);
    if (!form.name || isNaN(severityNum) || severityNum < 1 || severityNum > 9) {
      showMessage('Severity must be a number between 1 and 9', 'error');
      return;
    }

    try {
      if (form.symptomId) {
        await updateSymptom({ ...form, severity: severityNum });
      } else {
        await createSymptom({ ...form, severity: severityNum });
      }
      setForm({ symptomId: null, name: '', severity: '' });
      fetchSymptoms();
      showMessage('Symptom saved successfully!', 'success');
    } catch (err) {
      console.error('Error saving symptom:', err);
      showMessage('Error saving symptom. Please try again.', 'error');
    }
  };

  const handleEdit = (s) => {
    setForm({ symptomId: s.symptomId, name: s.name, severity: s.severity });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this precaution?')) return;
    try {
      await deleteSymptom(id);
      fetchSymptoms();
      showMessage('Symptom deleted successfully!', 'success');
    } catch (err) {
      console.error('Error deleting symptom:', err);
      showMessage('Error deleting symptom. Please try again.', 'error');
    }
  };

  const textFieldStyle = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: 'white' },
      '&:hover fieldset': { borderColor: 'lightgray' },
      '&.Mui-focused fieldset': { borderColor: '#90caf9' },
    },
    '& .MuiInputLabel-root': { color: 'white' },
    '& .MuiInputBase-input': { color: 'white' },
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom sx={{ color: 'white' }}>
        Manage Symptoms
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="Symptom Name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          sx={{ flex: 1, ...textFieldStyle }}
        />
        <TextField
          label="Severity"
          value={form.severity}
          onChange={(e) => setForm((f) => ({ ...f, severity: e.target.value }))}
          sx={{ flex: 1, ...textFieldStyle }}
          type="number"
          inputProps={{ min: 1, max: 9 }}
        />
        <Button variant="contained" onClick={handleSave}>
          {form.symptomId ? 'Update' : 'Create'}
        </Button>
      </Box>

      <List>
        {symptoms.map((s) => (
          <ListItem
            key={s.symptomId}
            secondaryAction={
              <>
                <Button size="small" onClick={() => handleEdit(s)} sx={{ mr: 1 }}>
                  Edit
                </Button>
                <Button size="small" color="error" onClick={() => handleDelete(s.symptomId)}>
                  Delete
                </Button>
              </>
            }
            sx={{ mb: 1 }}
          >
            <ListItemText
              primary={
                <span style={{ color: 'white' }}>
                  {s.name} - <span style={{ color: 'red' }}>Severity: {s.severity}</span>
                </span>
              }
            />
          </ListItem>
        ))}
      </List>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarType} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AdminSymptoms;


