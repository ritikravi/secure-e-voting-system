import axios from 'axios';

const registerVoter = async () => {
  try {
    const res = await axios.post('http://localhost:5001/api/auth/register', {
      voterId: 'VOTER123',
      name: 'Ritik Raushan'
    });
    console.log('Voter registered:', res.data);
  } catch (err) {
    console.error('Registration failed:', err.response?.data || err.message);
  }
};

registerVoter();
