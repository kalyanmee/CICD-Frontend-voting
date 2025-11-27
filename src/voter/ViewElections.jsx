import React, { useMemo, useState } from 'react';

export default function ViewElections() {
  // ---- 1. Dummy elections data ----
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
    },
  ]);

  // same 3 candidates for every election
  const candidateNames = ['Karthik', 'Dileep', 'Sriram'];

  const [info, setInfo] = useState('');
  const [activeElectionId, setActiveElectionId] = useState(null); // which election's voters area is open
  const [votes, setVotes] = useState({}); // { [electionId]: candidateName }

  // ---- 2. Helpers ----
  const getStatus = (start, end) => {
    const today = new Date();
    const s = new Date(start);
    const e = new Date(end);

    if (today < s) return 'Upcoming';
    if (today >= s && today <= e) return 'Ongoing';
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

  // ---- 3. When user clicks "Vote" on election card ----
  const handleOpenVotersArea = electionId => {
    setInfo('');
    setActiveElectionId(prev => (prev === electionId ? null : electionId)); // toggle
  };

  // ---- 4. When user clicks "Vote for Candidate" ----
  const handleVoteCandidate = (election, candidateName) => {
    setVotes(prev => ({
      ...prev,
      [election.id]: candidateName,
    }));
    setInfo(`You voted for ${candidateName} in "${election.name}". (Frontend only)`);
  };

  // ---- 5. UI ----
  return (
    <div
      style={{
        padding: '20px',
        textAlign: 'center',
        minHeight: '100vh',
        backgroundImage:
          "url('https://img.freepik.com/free-vector/voting-concept-illustration_114360-5581.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        style={{
          maxWidth: '960px',
          margin: '0 auto',
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        }}
      >
        <h2 style={{ marginBottom: '10px', color: '#333' }}>🗳️ Available Elections</h2>

        {info && <p style={{ color: 'green', marginBottom: '10px' }}>{info}</p>}

        {electionsWithStatus.length === 0 ? (
          <p style={{ color: '#666' }}>No elections found.</p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '20px',
              marginTop: '15px',
            }}
          >
            {electionsWithStatus.map(election => {
              const status = election.statusLabel;
              const votedName = votes[election.id];
              const canVote = status !== 'Completed';

              return (
                <div
                  key={election.id}
                  style={{
                    border: '1px solid #ccc',
                    borderRadius: '10px',
                    padding: '15px',
                    backgroundColor: '#fff',
                    textAlign: 'left',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                  }}
                >
                  <h3 style={{ color: '#007bff', marginBottom: '10px' }}>{election.name}</h3>

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
                          status === 'Ongoing'
                            ? 'green'
                            : status === 'Upcoming'
                            ? 'orange'
                            : 'red',
                        fontWeight: 'bold',
                      }}
                    >
                      {status}
                    </span>
                  </p>
                  <p>
                    <strong>Description:</strong>{' '}
                    {election.description || 'No description available'}
                  </p>

                  {/* Vote button that opens voters list */}
                  <button
                    onClick={() => handleOpenVotersArea(election.id)}
                    disabled={!canVote}
                    style={{
                      marginTop: '10px',
                      padding: '8px 18px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: canVote ? '#007bff' : '#999',
                      color: '#fff',
                      fontWeight: 'bold',
                      cursor: canVote ? 'pointer' : 'not-allowed',
                    }}
                  >
                    {activeElectionId === election.id
                      ? 'Hide Voters'
                      : 'Vote (Show Candidates)'}
                  </button>

                  {/* Voters / candidates area */}
                  {activeElectionId === election.id && (
                    <div
                      style={{
                        marginTop: '12px',
                        paddingTop: '10px',
                        borderTop: '1px solid #eee',
                      }}
                    >
                      <p><strong>Voters (Candidates in this election):</strong></p>

                      {candidateNames.map(name => {
                        const isVotedForThis = votedName === name;
                        const alreadyVoted = !!votedName;

                        return (
                          <div
                            key={name}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginBottom: '6px',
                            }}
                          >
                            <span>{name}</span>
                            <button
                              onClick={() => handleVoteCandidate(election, name)}
                              disabled={alreadyVoted}
                              style={{
                                padding: '4px 10px',
                                borderRadius: '6px',
                                border: 'none',
                                backgroundColor: isVotedForThis ? 'green' : '#28a745',
                                color: '#fff',
                                fontWeight: 'bold',
                                cursor: alreadyVoted ? 'not-allowed' : 'pointer',
                                fontSize: '13px',
                              }}
                            >
                              {isVotedForThis ? 'Voted' : 'Vote for Candidate'}
                            </button>
                          </div>
                        );
                      })}

                      {votedName && (
                        <p style={{ color: 'green', marginTop: '6px', fontSize: '13px' }}>
                          You already voted for <strong>{votedName}</strong> in this election.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
