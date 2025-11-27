import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config';

export default function ViewResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get(`${config.url}/admin/results`)
      .then(res => {
        setResults(res.data || []);
        setError('');
      })
      .catch(err => {
        console.error('Error fetching results:', err);
        setError('Failed to load election results.');
      })
      .finally(() => setLoading(false));
  }, []);

  const formatPercentage = value =>
    typeof value === 'number' ? value.toFixed(2) : '0.00';

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Election Results</h2>
      {loading && <p style={styles.muted}>Loading results...</p>}
      {error && <p style={styles.error}>{error}</p>}
      {!loading && !error && results.length === 0 && (
        <p style={styles.muted}>No votes recorded yet.</p>
      )}

      <div style={styles.resultsWrapper}>
        {results.map(result => {
          const winner = result.winner;
          return (
            <div key={result.electionId} style={styles.electionCard}>
              <div style={styles.electionHeader}>
                <h3>{result.electionName}</h3>
                <span style={styles.voteCount}>
                  Total Votes: {result.totalVotes || 0}
                </span>
              </div>

              <div style={styles.winnerCard}>
                <h4 style={styles.winnerTitle}>🏆 Winner</h4>
                {winner ? (
                  <>
                    <p style={styles.winnerName}>{winner.candidateName}</p>
                    <p style={styles.winnerStats}>
                      {formatPercentage(winner.percentage)}% ({winner.votes}{' '}
                      votes)
                    </p>
                  </>
                ) : (
                  <p style={styles.muted}>No winner yet.</p>
                )}
              </div>

              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Candidate</th>
                      <th style={styles.th}>Votes</th>
                      <th style={styles.th}>Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(result.candidates || []).map(candidate => (
                      <tr
                        key={candidate.candidateId}
                        style={
                          candidate.winner ? styles.winnerRow : styles.row
                        }
                      >
                        <td style={styles.td}>{candidate.candidateName}</td>
                        <td style={styles.td}>{candidate.votes}</td>
                        <td style={styles.td}>
                          {formatPercentage(candidate.percentage)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '40px',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
  },
  heading: {
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: '20px',
  },
  muted: {
    color: '#6c757d',
    textAlign: 'center',
  },
  error: {
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: '10px',
  },
  resultsWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
    maxWidth: '900px',
    margin: '0 auto',
  },
  electionCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '25px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
  },
  electionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    borderBottom: '1px solid #e9ecef',
    paddingBottom: '10px',
  },
  voteCount: {
    fontWeight: '600',
    color: '#495057',
  },
  winnerCard: {
    backgroundColor: '#e7f5ff',
    border: '1px solid #91d5ff',
    borderRadius: '10px',
    padding: '20px',
    marginBottom: '20px',
  },
  winnerTitle: {
    margin: 0,
    color: '#0c5460',
  },
  winnerName: {
    fontSize: '1.4rem',
    fontWeight: '700',
    color: '#0c4a6e',
    margin: '10px 0 0',
  },
  winnerStats: {
    margin: '5px 0 0',
    color: '#0c5460',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '10px',
    backgroundColor: '#212529',
    color: '#fff',
  },
  td: {
    padding: '10px',
    borderBottom: '1px solid #dee2e6',
  },
  row: {
    backgroundColor: '#fff',
  },
  winnerRow: {
    backgroundColor: '#fffbe6',
    fontWeight: '600',
  },
};
