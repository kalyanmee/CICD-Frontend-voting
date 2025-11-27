import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import './Voter.css';
import config from '../config';

const formatDate = dateStr => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const getElectionStatus = (startDate, endDate) => {
  const today = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (today < start) return 'Upcoming';
  if (today >= start && today <= end) return 'Ongoing';
  return 'Completed';
};

export default function VoteNow() {
  const [elections, setElections] = useState([]);
  const [selectedElectionId, setSelectedElectionId] = useState('');
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const voter = useMemo(() => {
    const stored = sessionStorage.getItem('voter');
    return stored ? JSON.parse(stored) : null;
  }, []);

  const voterId = voter?.id;

  useEffect(() => {
    const loadData = async () => {
      if (!voterId) {
        setError('Voter details not found. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`${config.url}/voter/elections/with-candidates`);
        const allElections = response.data || [];
        const electionsWithCandidates = allElections.filter(
          election => election.candidates && election.candidates.length > 0
        );

        setElections(electionsWithCandidates);

        if (electionsWithCandidates.length > 0) {
          setSelectedElectionId(String(electionsWithCandidates[0].electionId));
        }

        setError('');
      } catch (err) {
        console.error(err);
        setError('Failed to load elections. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [voterId]);

  const selectedElection = useMemo(() => {
    const electionId = Number(selectedElectionId);
    return elections.find(election => election.electionId === electionId);
  }, [elections, selectedElectionId]);

  const handleElectionChange = event => {
    setSelectedElectionId(event.target.value);
    setSelectedCandidateId(null);
    setMessage('');
    setError('');
  };

  const handleCandidateSelect = candidateId => {
    setSelectedCandidateId(candidateId);
    setMessage('');
    setError('');
  };

  const handleSubmitVote = async () => {
    if (!voterId) {
      setError('Unable to identify voter. Please log in again.');
      return;
    }

    if (!selectedElection) {
      setError('Please select an election.');
      return;
    }

    if (!selectedCandidateId) {
      setError('Please select a candidate before submitting your vote.');
      return;
    }

    const electionStatus = getElectionStatus(selectedElection.startDate, selectedElection.endDate);
    if (electionStatus !== 'Ongoing') {
      setError(`Voting is not open for ${selectedElection.name}.`);
      return;
    }

    try {
      setSubmitting(true);
      const response = await axios.post(`${config.url}/voter/vote`, {
        voterId,
        electionId: selectedElection.electionId,
        candidateId: selectedCandidateId,
      });

      setMessage(response.data || 'Vote submitted successfully.');
      setError('');
    } catch (err) {
      const message =
        err.response?.data ||
        err.message ||
        'Unable to submit your vote right now.';
      setError(typeof message === 'string' ? message : 'Unable to submit your vote right now.');
      setMessage('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="voter-home-container" style={{ padding: '20px', textAlign: 'center' }}>
      <div className="elections-card" style={{ maxWidth: '960px', margin: '0 auto' }}>
        <h2 style={{ marginBottom: '20px', color: '#333' }}>Vote Now</h2>

        {loading && <p>Loading elections...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {message && <p style={{ color: 'green' }}>{message}</p>}

        {!loading && elections.length === 0 && (
          <p style={{ color: '#666' }}>No elections with registered candidates are available at the moment.</p>
        )}

        {!loading && elections.length > 0 && (
          <>
            <div style={{ marginBottom: '20px', textAlign: 'left' }}>
              <label htmlFor="election-select" style={{ fontWeight: 'bold', marginRight: '10px' }}>
                Select Election:
              </label>
              <select
                id="election-select"
                value={selectedElectionId}
                onChange={handleElectionChange}
                style={{ padding: '8px 12px', borderRadius: '6px' }}
              >
                {elections.map(election => (
                  <option key={election.electionId} value={election.electionId}>
                    {election.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedElection && (
              <div
                className="election-item"
                style={{
                  border: '1px solid #ccc',
                  borderRadius: '10px',
                  padding: '18px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                  backgroundColor: '#fff',
                  textAlign: 'left',
                }}
              >
                <h3 style={{ color: '#007bff', marginBottom: '10px' }}>{selectedElection.name}</h3>
                <p><strong>Type:</strong> {selectedElection.electionType}</p>
                <p><strong>City:</strong> {selectedElection.city}</p>
                <p><strong>Station:</strong> {selectedElection.station}</p>
                <p><strong>Start Date:</strong> {formatDate(selectedElection.startDate)}</p>
                <p><strong>End Date:</strong> {formatDate(selectedElection.endDate)}</p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span
                    style={{
                      color:
                        getElectionStatus(selectedElection.startDate, selectedElection.endDate) === 'Ongoing'
                          ? 'green'
                          : getElectionStatus(selectedElection.startDate, selectedElection.endDate) === 'Upcoming'
                          ? 'orange'
                          : 'red',
                      fontWeight: 'bold',
                    }}
                  >
                    {getElectionStatus(selectedElection.startDate, selectedElection.endDate)}
                  </span>
                </p>
                {selectedElection.description && (
                  <p><strong>Description:</strong> {selectedElection.description}</p>
                )}

                <div style={{ marginTop: '20px' }}>
                  <p style={{ fontWeight: 'bold' }}>Choose a candidate:</p>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {selectedElection.candidates.map(candidate => (
                      <label
                        key={candidate.candidateId}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px',
                          borderRadius: '8px',
                          border: '1px solid #ddd',
                          backgroundColor: selectedCandidateId === candidate.candidateId ? '#e3f2fd' : '#fafafa',
                          cursor: 'pointer',
                        }}
                      >
                        <input
                          type="radio"
                          name="candidateSelection"
                          value={candidate.candidateId}
                          checked={selectedCandidateId === candidate.candidateId}
                          onChange={() => handleCandidateSelect(candidate.candidateId)}
                        />
                        <div>
                          <p style={{ margin: 0, fontWeight: 'bold' }}>{candidate.name}</p>
                          <p style={{ margin: 0 }}><strong>Party:</strong> {candidate.party}</p>
                          <p style={{ margin: 0 }}><strong>Area:</strong> {candidate.area}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  className="vote-btn"
                  style={{ marginTop: '20px' }}
                  onClick={handleSubmitVote}
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit Vote'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
