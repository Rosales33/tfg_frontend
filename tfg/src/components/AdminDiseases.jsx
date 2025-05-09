import React, { useState, useEffect } from 'react';
import {
  Typography, TextField, Button, List, ListItem, ListItemText, Box, Snackbar, Alert
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import {getDiseases, createDisease, updateDisease, deleteDisease, getDiseaseExtended, getSymptoms, getPrecautions
} from '../api';

const AdminDiseases = () => {
  const [diseases, setDiseases] = useState([]);
  const [allSymptoms, setAllSymptoms] = useState([]);
  const [allPrecautions, setAllPrecautions] = useState([]);
  const [form, setForm] = useState({
    diseaseId: null,
    name: '',
    description: '',
    symptoms: [],
    precautions: []
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchDiseases();
    fetchSymptoms();
    fetchPrecautions();
  }, []);

  const fetchDiseases = async () => {
    try {
      const res = await getDiseases();
      setDiseases(res.data);
    } catch (err) {
      console.error('Error fetching diseases:', err);
    }
  };

  const fetchSymptoms = async () => {
    try {
      const res = await getSymptoms();
      setAllSymptoms(res.data);
    } catch (err) {
      console.error('Error fetching symptoms:', err);
    }
  };

  const fetchPrecautions = async () => {
    try {
      const res = await getPrecautions();
      setAllPrecautions(res.data);
    } catch (err) {
      console.error('Error fetching precautions:', err);
    }
  };

  const showMessage = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSave = async () => {
    try {
      if (form.diseaseId) {
        const payload = {
          name: form.name,
          description: form.description
        };
        await updateDisease(form.diseaseId, payload);
        showMessage('Disease updated successfully!');
      } else {
        const payload = {
          name: form.name,
          description: form.description,
          symptomIds: form.symptoms.map(s => s.symptomId || s.id),
          precautionIds: form.precautions.map(p => p.precautionId || p.id)
        };
        await createDisease(payload);
        showMessage('Disease created successfully!');
      }
      setForm({ diseaseId: null, name: '', description: '', symptoms: [], precautions: [] });
      fetchDiseases();
    } catch (err) {
      console.error('Error saving disease:', err);
      showMessage('Error saving disease. Please try again.', 'error');
    }
  };

  const handleEdit = async (disease) => {
    try {
      const res = await getDiseaseExtended(disease.diseaseId);
      const ext = res.data;
      setForm({
        diseaseId: ext.diseaseId,
        name: ext.name,
        description: ext.description,
        symptoms: ext.symptoms,
        precautions: ext.precautions
      });
    } catch (err) {
      console.error('Error fetching disease details:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this disease?')) return;
    try {
      await deleteDisease(id);
      showMessage('Disease deleted successfully!');
      fetchDiseases();
    } catch (err) {
      console.error('Error deleting disease:', err);
      showMessage('Error deleting disease. Please try again.', 'error');
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

  const chipProps = {
    sx: {
      backgroundColor: '#1976d2',
      color: 'white',
      '& .MuiChip-deleteIcon': {
        color: '#bbdefb',
        '&:hover': {
          color: '#fff',
        }
      }
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom sx={{ color: 'white' }}>
        Manage Diseases
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
        <TextField
          label="Disease Name"
          value={form.name}
          onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
          sx={textFieldStyle}
        />
        <TextField
          label="Description"
          multiline
          rows={4}
          value={form.description}
          onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
          sx={textFieldStyle}
        />
        {!form.diseaseId && (
          <>
            <Autocomplete
              multiple
              options={allSymptoms}
              getOptionLabel={(option) => option.name}
              value={form.symptoms}
              onChange={(e, value) => setForm(f => ({ ...f, symptoms: value }))}
              renderInput={(params) => (
                <TextField {...params} label="Symptoms" sx={textFieldStyle} />
              )}
              ChipProps={chipProps}
            />

            <Autocomplete
              multiple
              options={allPrecautions}
              getOptionLabel={(option) => option.precautionText}
              value={form.precautions}
              onChange={(e, value) => setForm(f => ({ ...f, precautions: value }))}
              renderInput={(params) => (
                <TextField {...params} label="Precautions" sx={textFieldStyle} />
              )}
              ChipProps={chipProps}
            />
          </>
        )}
        <Button variant="contained" onClick={handleSave}>
          {form.diseaseId ? 'Update Disease' : 'Create Disease'}
        </Button>
      </Box>

      <List>
        {diseases.map((d) => (
          <ListItem
            key={d.diseaseId}
            secondaryAction={
              <>
                <Button size="small" onClick={() => handleEdit(d)} sx={{ mr: 1 }}>
                  Edit
                </Button>
                <Button size="small" color="error" onClick={() => handleDelete(d.diseaseId)}>
                  Delete
                </Button>
              </>
            }
            sx={{ mb: 1 }}
          >
            <ListItemText primary={d.name} sx={{ color: 'white' }} />
          </ListItem>
        ))}
      </List>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
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

export default AdminDiseases;










