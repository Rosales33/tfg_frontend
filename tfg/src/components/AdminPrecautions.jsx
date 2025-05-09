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
import { createPrecaution, updatePrecaution, deletePrecaution, getPrecautions } from '../api';

const AdminPrecautions = () => {
  const [precautions, setPrecautions] = useState([]);
  const [form, setForm] = useState({ precautionId: null, precautionText: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchPrecautions = async () => {
    try {
      const res = await getPrecautions();
      setPrecautions(res.data);
    } catch (err) {
      console.error('Error fetching precautions:', err);
    }
  };

  useEffect(() => {
    fetchPrecautions();
  }, []);

  const showMessage = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSave = async () => {
    try {
      if (form.precautionId) {
        await updatePrecaution(form);
      } else {
        await createPrecaution(form);
      }
      setForm({ precautionId: null, precautionText: '' });
      fetchPrecautions();
      showMessage('Precaution saved successfully!', 'success');
    } catch (err) {
      console.error('Error saving precaution:', err);
      showMessage('Error saving precaution. Please try again.', 'error');
    }
  };

  const handleEdit = (p) => {
    setForm({ precautionId: p.precautionId, precautionText: p.precautionText });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this precaution?')) return;
    try {
      await deletePrecaution(id);
      fetchPrecautions();
      showMessage('Precaution deleted successfully!', 'success');
    } catch (err) {
      console.error('Error deleting precaution:', err);
      showMessage('Error deleting precaution. Please try again.', 'error');
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
        Manage Precautions
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="Precaution Text"
          value={form.precautionText}
          onChange={(e) =>
            setForm((f) => ({ ...f, precautionText: e.target.value }))
          }
          sx={{ flex: 1, ...textFieldStyle }}
        />
        <Button variant="contained" onClick={handleSave}>
          {form.precautionId ? 'Update' : 'Create'}
        </Button>
      </Box>

      <List>
        {precautions.map((p) => (
          <ListItem
            key={p.precautionId}
            secondaryAction={
              <>
                <Button
                  size="small"
                  onClick={() => handleEdit(p)}
                  sx={{ mr: 1 }}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleDelete(p.precautionId)}
                >
                  Delete
                </Button>
              </>
            }
            sx={{ mb: 1 }}
          >
            <ListItemText primary={p.precautionText} sx={{ color: 'white' }} />
          </ListItem>
        ))}
      </List>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AdminPrecautions;





