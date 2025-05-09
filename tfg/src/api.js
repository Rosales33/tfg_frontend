import axios from 'axios';

export const getDiseases = async () => {
  return axios.get('http://localhost:8080/diseases');
};

export const getPrecautions = () => {
  const token = localStorage.getItem('token');
  return axios.get('http://localhost:8080/precautions', {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export const getSymptoms = async () => {
  return axios.get('http://localhost:8080/symptoms');
};

export const getDiseaseExtended = (id) => {
  return axios.get(`http://localhost:8080/diseases/${id}/extended`);
};

export const getUserInfo = () => {
  const token = localStorage.getItem('token');
  return axios.get('http://localhost:8080/auth/userinfo', {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export const getPatientDiagnoses = (patientId) => {
  const token = localStorage.getItem('token');
  return axios.get(
    `http://localhost:8080/patients/${patientId}/diagnoses`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const createDisease = (form) => {
  const token = localStorage.getItem('token');
  return axios.post(
    'http://localhost:8080/diseases',
    form,
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const deleteDisease = (id) => {
  const token = localStorage.getItem('token');
  return axios.delete(
    `http://localhost:8080/diseases/${id}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const updateDisease = (id, payload) => {
  const token = localStorage.getItem('token');
  return axios.put(
    `http://localhost:8080/diseases/${id}`,
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const createPrecaution = (form) => {
  const token = localStorage.getItem('token');
  return axios.post(
    'http://localhost:8080/precautions',
    form,
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const deletePrecaution = (id) => {
  const token = localStorage.getItem('token');
  return axios.delete(
    `http://localhost:8080/precautions/${id}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const updatePrecaution = (form) => {
  const token = localStorage.getItem('token');
  return axios.put(
    `http://localhost:8080/precautions/${form.precautionId}`,
    form,
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const createSymptom = (form) => {
  const token = localStorage.getItem('token');
  return axios.post(
    'http://localhost:8080/symptoms',
    form,
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const deleteSymptom = (id) => {
  const token = localStorage.getItem('token');
  return axios.delete(
    `http://localhost:8080/symptoms/${id}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const updateSymptom = (form) => {
  const token = localStorage.getItem('token');
  return axios.put(
    `http://localhost:8080/symptoms/${form.symptomId}`,
    form,
    { headers: { Authorization: `Bearer ${token}` } }
  );
};



