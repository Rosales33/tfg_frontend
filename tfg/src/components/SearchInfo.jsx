import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Autocomplete,
  CircularProgress,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  Divider,
  Paper,
  ListItemIcon
} from '@mui/material';
import axios from 'axios';
import { getDiseases } from '../api';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const SearchInfo = () => {
  const [diseases, setDiseases] = useState([]);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const fetchDiseases = async () => {
      setLoadingList(true);
      try {
        const response = await getDiseases();
        setDiseases(response.data);
      } catch (err) {
        console.error('Error loading diseases list:', err);
      }
      setLoadingList(false);
    };
    fetchDiseases();
  }, []);

  const handleSearch = async () => {
    if (!selectedDisease) return;
    setLoadingDetail(true);
    try {
      const res = await axios.get(
        `http://localhost:8080/diseases/${selectedDisease.diseaseId}/extended`
      );
      setDetails(res.data);
    } catch (err) {
      console.error('Error fetching disease detail:', err);
      setDetails(null);
    }
    setLoadingDetail(false);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'white' }}>
        Search Information
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
        <Autocomplete
          disablePortal
          fullWidth
          options={diseases}
          getOptionLabel={(opt) => opt.name}
          onChange={(e, v) => setSelectedDisease(v)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Insert the name of a disease of interest"
              InputLabelProps={{ style: { color: 'white' } }}
              InputProps={{
                ...params.InputProps,
                style: { color: 'white' },
                endAdornment: loadingList ? (
                  <CircularProgress size={20} />
                ) : (
                  params.InputProps.endAdornment
                ),
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

        <Button
          variant="contained"
          onClick={handleSearch}
          disabled={!selectedDisease || loadingDetail}
        >
          {loadingDetail ? <CircularProgress size={24} /> : 'Search'}
        </Button>
      </Box>

      {details && (
        <Box>
          <Divider sx={{ my: 2, borderColor: 'grey.700' }} />

          <Typography variant="h5" gutterBottom sx={{ color: 'white', fontWeight: 600 }}>
            {details.name}
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ color: 'white', mt: 3 }}>
            Description
          </Typography>
          <Typography paragraph sx={{ color: 'white', fontSize: '1rem', lineHeight: 1.6 }}>
            {details.description}
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ color: 'white', mt: 4 }}>
            Precautions
          </Typography>
          <List dense>
            {details.precautions.map((p) => (
              <ListItem key={p.precautionId}>
                <ListItemIcon>
                  <CheckCircleIcon sx={{ color: 'lightgreen' }} />
                </ListItemIcon>
                <ListItemText
                  primary={p.precautionText}
                  primaryTypographyProps={{ sx: { color: 'white' } }}
                />
              </ListItem>
            ))}
          </List>

          <Typography variant="h6" gutterBottom sx={{ color: 'white', mt: 4 }}>
            Symptoms
          </Typography>
          <Box display="flex" flexDirection="column" gap={2}>
            {details.symptoms.map((s) => (
              <Paper
                key={s.symptomId}
                elevation={3}
                sx={{
                  p: 2,
                  backgroundColor: '#2a2a2a',
                  color: 'white',
                  borderLeft: '5px solid #90caf9',
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  {s.name.replace(/_/g, ' ')}
                </Typography>
                <Typography variant="body2" sx={{ color: 'error.main', mt: 0.5 }}>
                  Severity: {s.severity}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default SearchInfo;









