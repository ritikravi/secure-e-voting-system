import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import { Lock, User, Vote as VoteIcon, LayoutDashboard, LogIn, ChevronRight } from 'lucide-react';
import './index.css';

const API_BASE_URL = 'http://localhost:5001/api';

const App = () => {
  const [view, setView] = useState('login'); // login, vote, dashboard
  const [voterId, setVoterId] = useState('');
  const [otp, setOtp] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [candidates, setCandidates] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (token) fetchElectionData();
  }, [token]);

  const fetchElectionData = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/election/info`);
      setCandidates(res.data.candidates);
    } catch (err) {
      console.error('Error fetching election data', err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, { voterId, otp });
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      setView('vote');
      setMessage('Log in successful!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const castVote = async (candidateId) => {
    if (!window.ethereum) return alert('MetaMask not found!');
    
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Smart contract info (placeholder address - update after deployment)
      const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 
      const abi = [
        "function vote(uint256 _candidateId) public",
        "function getCandidates() public view returns (tuple(uint256 id, string name, uint256 voteCount)[])"
      ];
      
      const contract = new ethers.Contract(contractAddress, abi, signer);
      const tx = await contract.vote(candidateId);
      setMessage('Transaction sent! Waiting for confirmation...');
      await tx.wait();
      
      setMessage('Vote successfully cast on blockchain!');
      setView('dashboard');
      fetchResults(contract);
    } catch (err) {
      setMessage(err.reason || 'Voting failed. Check if you already voted.');
    } finally {
      setLoading(false);
    }
  };

  const fetchResults = async (contract) => {
    try {
      const data = await contract.getCandidates();
      setResults(data);
    } catch (err) {
      console.error('Failed to fetch results', err);
    }
  };

  return (
    <div className="container">
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', background: 'linear-gradient(to right, #6366f1, #10b981)', color: 'transparent', WebkitBackgroundClip: 'text' }}>
          Secure Blockchain Voting
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Hackathon Prototype 2026</p>
      </header>

      {view === 'login' && (
        <div className="glass-card" style={{ maxWidth: '400px', margin: '0 auto' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <Lock size={24} color="var(--primary)" /> Voter Login
          </h2>
          <form onSubmit={handleLogin}>
            <label>Voter ID</label>
            <input type="text" placeholder="Enter Voter ID" value={voterId} onChange={(e) => setVoterId(e.target.value)} required />
            <label>OTP (Simulation: 123456)</label>
            <input type="password" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
            <button className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Authenticating...' : 'Login'}
            </button>
          </form>
          {message && <p style={{ marginTop: '1rem', color: '#fb7185', fontSize: '0.9rem' }}>{message}</p>}
        </div>
      )}

      {view === 'vote' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Welcome, {voterId}</h2>
            <button className="btn" style={{ background: 'rgba(255,255,255,0.1)' }} onClick={() => setView('dashboard')}>
              View Live Results
            </button>
          </div>
          <div className="candidate-grid">
            {candidates.map(candidate => (
              <div key={candidate.id} className="glass-card candidate-card">
                <div style={{ background: 'var(--primary)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                   {candidate.id}
                </div>
                <h3>{candidate.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Candidate for the local district representative.</p>
                <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => castVote(candidate.id)}>
                   Cast Vote
                </button>
              </div>
            ))}
          </div>
          {message && <p style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--accent)' }}>{message}</p>}
        </div>
      )}

      {view === 'dashboard' && (
        <div className="glass-card">
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2>Election Dashboard</h2>
            <button className="btn btn-primary" onClick={() => setView('vote')}>Back to Voting</button>
          </div>
          <p>Real-time data fetched from Ethereum Blockchain</p>
          <div style={{ marginTop: '2rem' }}>
             {results.length > 0 ? results.map(r => (
               <div key={Number(r.id)} style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>{r.name}</span>
                    <span style={{ fontWeight: '800' }}>{Number(r.voteCount)} Votes</span>
                  </div>
                  <div style={{ width: '100%', background: 'rgba(255,255,255,0.1)', height: '10px', borderRadius: '5px' }}>
                    <div style={{ width: `${(Number(r.voteCount) / results.reduce((a, b) => a + Number(b.voteCount), 0) * 100) || 0}%`, background: 'var(--primary)', height: '100%', borderRadius: '5px', transition: 'width 0.5s' }}></div>
                  </div>
               </div>
             )) : (
               <p style={{ textAlign: 'center', padding: '2rem' }}>No votes recorded yet or blockchain not connected.</p>
             )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
