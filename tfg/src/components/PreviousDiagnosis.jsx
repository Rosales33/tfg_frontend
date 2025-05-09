// src/components/PreviousDiagnosis.jsx
import React, { useState, useEffect } from 'react';
import {
  Typography,
  CircularProgress,
  Box,
  Paper,
  Divider,
  Stack
} from '@mui/material';
import { getUserInfo, getPatientDiagnoses } from '../api';

const PreviousDiagnosis = () => {
  const [diagnoses, setDiagnoses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [patientId, setPatientId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const resp = await getUserInfo();
        setPatientId(resp.data.patientId);
      } catch (err) {
        console.error('Error fetching user info:', err);
        setError('Could not load user info');
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (patientId == null) return;
    const fetchDiagnoses = async () => {
      try {
        const resp = await getPatientDiagnoses(patientId);
        setDiagnoses(resp.data);
      } catch (err) {
        console.error('Error fetching diagnoses:', err);
        setError('Could not load diagnoses');
      } finally {
        setLoading(false);
      }
    };
    fetchDiagnoses();
  }, [patientId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'white' }}>
        Previous Diagnoses
      </Typography>

      {diagnoses.length === 0 ? (
        <Typography sx={{ color: 'white' }}>
          No previous diagnoses found.
        </Typography>
      ) : (
        <Stack spacing={2}>
          {diagnoses.map((diag) => {
            const date = diag.date
              ? new Date(diag.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })
              : 'Unknown date';

            const diseaseName = diag.disease?.name ?? 'Unnamed disease';

            return (
              <Paper
                key={diag.id}
                sx={{
                  p: 2,
                  backgroundColor: '#2a2a2a',
                  color: 'white',
                  borderLeft: '5px solid #90caf9'
                }}
                elevation={2}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {diseaseName}
                </Typography>
                <Typography variant="body2" sx={{ color: 'gray', mt: 0.5 }}>
                  {date}
                </Typography>
              </Paper>
            );
          })}
        </Stack>
      )}
    </Box>
  );
};

export default PreviousDiagnosis;

