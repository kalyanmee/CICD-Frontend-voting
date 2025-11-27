import React, { useMemo, useState } from 'react';

export default function ViewElections() {
  // 🔹 Dummy elections + your required candidates
  const [elections] = useState([
    {
      id: 1,
      name: 'City Council Election',
      electionType: 'Local',
      city: 'Vijayawada',
      station: 'Station 1',
      startDate: '2025-11-20',
      endDate: '2025-11-28',
      description: 'Election for city council members.',
      candidates: [
        { id: 101, name: 'Karthik' },
        { id: 102, name: 'Dileep' },
        { id: 103, name: 'Sriram' },
      ],
    },
    {
      id: 2,
      name: 'State Assembly Election',
      electionType: 'State',
      city: 'Guntur',
      station: 'Station 4',
      startDate: '2025-12-05',
      endDate: '2025-12-10',
      description: 'State level assembly elections.',
      candidates: [
        { id: 201, name: 'Karthik' },
        { id: 202, name: 'Dileep' },
        { id: 203, name: 'Sriram' },
      ],
    },
    {
      id: 3,
      name: 'Mayor Election',
      electionType: 'Local',
      city: 'Hyderabad',
      station: 'Station 7',
      startDate: '2025-12-08',
      endDate: '2025-12-15',
      description: 'Election for city mayor.',
      candidates: [
        { id: 301, name: 'Karthik' },
        { id: 302, name: 'Dileep' },
        { id: 303, name: 'Sriram' },
      ],
    },
  ]);

  const [info, setInfo] = useState('');
  const [error, setError] = useState('');

  const [activeElectionId, setActiveElectionId] = useState(null);
  const [votes, setVotes] = useState({});

  const getStatus = (start, end) => {
    const today = new Date();
    const startD = new Date(start);
    const endD = new Date(end);

    if (today < startD) return 'Upcoming';
    if (today >= startD && today <= endD) return 'Ongoing';
    return 'Completed';
  };

  const formatDate = d => {
    const date = new Date(d);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const electionsWithStatus = useMemo(
    () =>
      elections.map(e => ({
        ...e,
        statusLabel: getStatus(e.startDate, e.endDate),
      })),
    [elections]
  );

  const handleOpenCandidates = electionId => {
    setInfo('');
    setError('');
    setActiveElectionId(prev => (prev === electionId ? null : electionId));
  };

  const handleVoteCandidate = (election, candidate) => {
    setVotes(prev => ({
      ...prev,
      [election.id]: candidate.id,
    }));

    setInfo(`You voted for "${candidate.name}" in "${election.name}".`);
    setError('');
  };

  return (
    <div
      style={{
        padding: '20px',
        textAlign: 'center',
        minHeight: '100vh',
        backgroundImage:
          "url('https://img.freepik.com/free-vector/voting-concept-illustration_114360-5581.jpg')",
        backgroundSize: 'cover',
      }}
    >
      <div
        style={{
          maxWidth: '960px',
          margin: '0 auto',
          padding: '20px',
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderRadius: '12px',
        }}
      >
        <h2>🗳️ Available Elections</h2>

        {info && <p style={{ color: 'green' }}>{info}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {/* Elections */}
        <div
          style={{
            marginTop: '15px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px',
          }}
        >
          {electionsWithStatus.map(election => {
            const votedCandidate = votes[election.id];
            const canVote = election.statusLabel !== 'Completed';

            return (
              <div
                key={election.id}
                style={{
                  border: '1px solid #ccc',
                  borderRadius: '10px',
                  padding: '15px',
                  backgroundColor: '#fff',
                }}
              >
                <h3 style={{ color: '#007bff' }}>{election.name}</h3>

                <p><strong>Type:</strong> {election.electionType}</p>
                <p><strong>City:</strong> {election.city}</p>
                <p><strong>Station:</strong> {election.station}</p>
                <p><strong>Start Date:</strong> {formatDate(election.startDate)}</p>
                <p><strong>End Date:</strong> {formatDate(election.endDate)}</p>

                <p>
                  <strong>Status:</strong>{' '}
                  <span
                    style={{
                      color:
                        election.statusLabel === 'Ongoing'
                          ? 'green'
                          : election.statusLabel === 'Upcoming'
                          ? 'orange'
                          : 'red',
                      fontWeight: 'bold',
                    }}
                  >
                    {election.statusLabel}
                  </span>
                </p>

                <button
                  onClick={() => handleOpenCandidates(election.id)}
                  disabled={!canVote}
                  style={{
                    padding: '8px 16px',
                    marginTop: '10px',
                    backgroundColor: canVote ? '#007bff' : '#999',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: canVote ? 'pointer' : 'not-allowed',
                  }}
                >
                  {activeElectionId === election.id
                    ? 'Hide Candidates'
                    : 'Show Candidates'}
                </button>

                {/* Candidate List */}
                {activeElectionId === election.id && (
                  <div style={{ marginTop: '10px' }}>
                    <p><strong>Candidates:</strong></p>

                    {election.candidates.map(candidate => {
                      const isVoted = votedCandidate === candidate.id;

                      return (
                        <div
                          key={candidate.id}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '8px',
                          }}
                        >
                          <span>{candidate.name}</span>

                          <button
                            onClick={() => handleVoteCandidate(election, candidate)}
                            disabled={votedCandidate}
                            style={{
                              padding: '4px 10px',
                              backgroundColor: isVoted ? 'green' : '#28a745',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: votedCandidate ? 'not-allowed' : 'pointer',
                            }}
                          >
                            {isVoted ? 'Voted' : 'Vote'}
                          </button>
                        </div>
                      );
                    })}

                    {votedCandidate && (
                      <p style={{ color: 'green', marginTop: '6px' }}>
                        You already voted in this election.
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
