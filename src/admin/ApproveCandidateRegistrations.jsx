import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import config from '../config';

const STATUS_OPTIONS = ['PENDING', 'APPROVED', 'REJECTED', 'ALL'];

export default function ApproveCandidateRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const loadRegistrations = async (status = statusFilter) => {
    try {
      setLoading(true);
      setError('');
      const param = status !== 'ALL' ? `?status=${status}` : '';
      const response = await axios.get(`${config.url}/admin/candidate-registrations${param}`);
      setRegistrations(response.data || []);
    } catch (err) {
      console.error(err);
      setError('Unable to fetch candidate registrations right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRegistrations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadRegistrations(statusFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleStatusChange = async (id, nextStatus) => {
    try {
      setUpdatingId(id);
      setError('');
      setInfo('');
      await axios.put(`${config.url}/admin/candidate-registrations/${id}/status`, {
        status: nextStatus,
      });
      await loadRegistrations(statusFilter);
      setInfo(`Registration updated to ${nextStatus}.`);
    } catch (err) {
      const message =
        err.response?.data ||
        err.message ||
        'Failed to update registration.';
      setError(typeof message === 'string' ? message : 'Failed to update registration.');
    } finally {
      setUpdatingId(null);
    }
  };

  const tableRows = useMemo(() => {
    if (!registrations.length) return null;
    return registrations.map(reg => (
      <tr key={reg.id}>
        <td>{reg.candidateName}</td>
        <td>{reg.electionName}</td>
        <td>{reg.electionType}</td>
        <td>{reg.status}</td>
        <td>{new Date(reg.createdAt).toLocaleString()}</td>
        <td style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <button
            onClick={() => handleStatusChange(reg.id, 'APPROVED')}
            disabled={updatingId === reg.id || reg.status === 'APPROVED'}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#2e7d32',
              color: '#fff',
              cursor: updatingId === reg.id || reg.status === 'APPROVED' ? 'not-allowed' : 'pointer',
            }}
          >
            {updatingId === reg.id ? 'Updating...' : 'Approve'}
          </button>
          <button
            onClick={() => handleStatusChange(reg.id, 'REJECTED')}
            disabled={updatingId === reg.id || reg.status === 'REJECTED'}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#c62828',
              color: '#fff',
              cursor: updatingId === reg.id || reg.status === 'REJECTED' ? 'not-allowed' : 'pointer',
            }}
          >
            {updatingId === reg.id ? 'Updating...' : 'Reject'}
          </button>
        </td>
      </tr>
    ));
  }, [registrations, updatingId, statusFilter]);

  return (
    <div style={{ padding: '30px' }}>
      <h2 style={{ marginBottom: '20px' }}>Candidate Election Registrations</h2>

      <div style={{ marginBottom: '15px', display: 'flex', gap: '12px', alignItems: 'center' }}>
        <label htmlFor="statusFilter" style={{ fontWeight: 'bold' }}>Status:</label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: '6px 10px', borderRadius: '6px' }}
        >
          {STATUS_OPTIONS.map(status => (
            <option key={status} value={status}>
              {status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
        <button
          onClick={() => loadRegistrations(statusFilter)}
          style={{
            padding: '6px 12px',
            borderRadius: '6px',
            border: '1px solid #1976d2',
            backgroundColor: '#1976d2',
            color: '#fff',
          }}
        >
          Refresh
        </button>
      </div>

      {loading && <p>Loading registrations...</p>}
      {info && <p style={{ color: 'green' }}>{info}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && registrations.length === 0 && (
        <p>No registrations found for the selected status.</p>
      )}

      {!loading && registrations.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Candidate</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Election</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Type</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Status</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Requested On</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Actions</th>
              </tr>
            </thead>
            <tbody>{tableRows}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}

