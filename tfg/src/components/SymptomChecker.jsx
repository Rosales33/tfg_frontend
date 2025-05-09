import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Autocomplete,
  CircularProgress,
  Box,
  Typography,
  Chip,
  Snackbar,
  Alert
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import axios from 'axios';
import { getSymptoms, getUserInfo } from '../api';

const SymptomChecker = ({ isLoggedIn }) => {
  const [symptoms, setSymptoms] = useState([]);
  const [selectedSymptom, setSelectedSymptom] = useState(null);
  const [symptomIds, setSymptomIds] = useState([]);
  const [addedSymptoms, setAddedSymptoms] = useState([]);
  const [loadingSymptoms, setLoadingSymptoms] = useState(false);
  const [loadingDiagnosis, setLoadingDiagnosis] = useState(false);
  const [saving, setSaving] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState([]);
  const [patientId, setPatientId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetch = async () => {
      setLoadingSymptoms(true);
      try {
        const { data } = await getSymptoms();
        setSymptoms(data);
      } catch (err) {
        console.error('Error fetching symptoms:', err);
      }
      setLoadingSymptoms(false);
    };
    fetch();
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    getUserInfo()
      .then(res => setPatientId(res.data.patientId))
      .catch(err => console.error('Error fetching userInfo:', err));
  }, [isLoggedIn]);

  const handleAddSymptom = () => {
    if (!selectedSymptom) return;
    setAddedSymptoms(prev => [...prev, selectedSymptom.name]);
    setSymptomIds(prev => [...prev, selectedSymptom.symptomId]);
    setSelectedSymptom(null);
  };

  const handleRemoveSymptom = (symptomName, symptomId) => {
    setAddedSymptoms(prev => prev.filter(s => s !== symptomName));
    setSymptomIds(prev => prev.filter(id => id !== symptomId));
  };

  const handleDiagnosis = async () => {
    if (!symptomIds.length) return;
    setLoadingDiagnosis(true);
    setDiagnosisResult([]);
    try {
      const { data } = await axios.post(
        'http://localhost:8080/diagnoses',
        { symptomIds }
      );
      const list = Array.isArray(data) ? data : [data];
      setDiagnosisResult(list);
    } catch (err) {
      console.error('Error obtaining diagnosis:', err);
    }
    setLoadingDiagnosis(false);
  };

  const handleSaveDiagnosis = async () => {
    if (!patientId || !diagnosisResult.length) return;
    setSaving(true);
    try {
      const dto = {
        diseaseId: diagnosisResult[0].diseaseId,
        score: diagnosisResult[0].score,
        confidence: diagnosisResult[0].confidence
      };
      await axios.post(
        `http://localhost:8080/diagnoses/save?patientId=${patientId}`,
        dto
      );
      setSnackbar({ open: true, message: 'Diagnosis saved successfully!', severity: 'success' });
    } catch (err) {
      console.error('Error saving diagnosis:', err);
      setSnackbar({ open: true, message: 'Error saving diagnosis', severity: 'error' });
    }
    setSaving(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom sx={{ color: 'white' }}>
        Symptoms Checker
      </Typography>

      <Autocomplete
        disablePortal
        options={symptoms}
        getOptionLabel={opt => opt.name || '–'}
        onChange={(_, v) => setSelectedSymptom(v)}
        renderInput={params => (
          <TextField
            {...params}
            label="Insert your symptoms"
            fullWidth
            InputLabelProps={{ style: { color: 'white' } }}
            InputProps={{
              ...params.InputProps,
              style: { color: 'white' },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'white' },
                '&:hover fieldset': { borderColor: 'lightgray' },
                '&.Mui-focused fieldset': { borderColor: '#90caf9' },
              },
              '& .MuiInputLabel-root': { color: 'white' }
            }}
          />
        )}
      />

      <Box mt={2}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleAddSymptom}
          disabled={loadingSymptoms || !selectedSymptom}
          sx={{ mr: 2 }}
        >
          Add Symptom
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={handleDiagnosis}
          disabled={loadingDiagnosis || !symptomIds.length}
        >
          {loadingDiagnosis ? <CircularProgress size={20} /> : 'Obtain Diagnosis'}
        </Button>
      </Box>

      {addedSymptoms.length > 0 && (
        <Box mt={3}>
          <Typography variant="h6" sx={{ color: 'white' }}>
            Symptoms Added
          </Typography>
          <Box
            sx={{
              backgroundColor: '#333',
              color: '#fff',
              p: 2,
              borderRadius: 1,
              mt: 1,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1
            }}
          >
            {addedSymptoms.map((s, i) => (
              <Chip
                key={i}
                label={s}
                onDelete={() => handleRemoveSymptom(s, symptomIds[i])}
                color="primary"
                sx={{ cursor: 'pointer' }}
              />
            ))}
          </Box>
        </Box>
      )}

      {diagnosisResult.length > 0 && (
        <Box mt={4}>
          <Typography variant="h6" sx={{ color: 'white' }}>
            Diagnosis Result
          </Typography>
          {diagnosisResult.map(d => (
            <Box
              key={d.diseaseId}
              sx={{
                border: '1px solid #555',
                borderRadius: 1,
                p: 2,
                mt: 1,
                color: 'white'
              }}
            >
              <Typography variant="subtitle1"><b>{d.name}</b></Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {d.description}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  color:
                    d.confidence < 50
                      ? '#f44336'
                      : d.confidence < 75
                      ? '#ff9800'
                      : '#4caf50'
                }}
              >
                Confidence: {d.confidence}%
              </Typography>
            </Box>
          ))}

          {isLoggedIn && (
            <Box mt={2}>
              <Button
                variant="outlined"
                onClick={handleSaveDiagnosis}
                disabled={saving}
                sx={{ color: 'white', borderColor: 'white' }}
              >
                {saving ? 'Saving...' : 'Save Diagnosis'}
              </Button>
            </Box>
          )}

          {/* Disclaimer */}
          <Box mt={3} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <WarningAmberIcon fontSize="small" sx={{ color: '#ff9800', mt: '3px' }} />
            <Typography
              variant="body2"
              sx={{ color: 'gray', fontStyle: 'italic' }}
            >
              Disclaimer: This tool is intended for informational purposes only and should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider with any questions you may have regarding a medical condition. The confidence score provided does not reflect a clinical certainty and should not be interpreted as a definitive indicator of the presence or absence of any disease.
            </Typography>
          </Box>
        </Box>
      )}

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
    </Box>
  );
};

export default SymptomChecker;











