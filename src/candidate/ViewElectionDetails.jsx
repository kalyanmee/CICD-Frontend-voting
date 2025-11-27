import React, { useState, useMemo } from 'react';

export default function DummyElectionPage() {
  const [form, setForm] = useState({
    name: '',
    electionType: '',
    city: '',
    station: '',
    startDate: '',
    endDate: '',
  });

  // Dummy initial data
  const [elections, setElections] = useState([
    {
      id: 1,
      name: 'City Council Election',
      electionType: 'Local',
      city: 'Vijayawada',
      station: 'Station 1',
      startDate: '2025-11-20',
      endDate: '2025-11-28',
    },
    {
      id: 2,
      name: 'State Assembly Election',
      electionType: 'State',
      city: 'Guntur',
      station: 'Station 4',
      startDate: '2025-12-05',
      endDate: '2025-12-10',
    },
  ]);

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  // which elections the candidate has chosen to participate in
  const [participating, setParticipating] = useState({}); // { [electionId]: true }

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    setSuccess('');
    setError('');

    if (
      !form.name ||
      !form.electionType ||
      !form.city ||
      !form.station ||
      !form.startDate ||
      !form.endDate
    ) {
      setError('Please fill all the fields.');
      return;
    }

    const newElection = {
      id: Date.now(),
      ...form,
    };

    setElections(prev => [...prev, newElection]);
    setSuccess('Election added successfully!');
    setForm({
      name: '',
      electionType: '',
      city: '',
      station: '',
      startDate: '',
      endDate: '',
    });
  };

  // candidate chooses to participate in a specific election
  const handleParticipate = election => {
    setParticipating(prev => ({
      ...prev,
      [election.id]: true,
    }));
    setSuccess(`You are participating in "${election.name}" election.`);
    setError('');
  };

  const getStatusLabel = (start, end) => {
    const today = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (today < startDate) return 'Upcoming';
    if (today >= startDate && today <= endDate) return 'Ongoing';
    return 'Completed';
  };

  const formatDate = dateStr => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
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
        statusLabel: getStatusLabel(e.startDate, e.endDate),
      })),
    [elections]
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage:
          "url('https://img.freepik.com/free-vector/voting-concept-illustration_114360-5581.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* light overlay */}
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          minHeight: '100vh',
        }}
      >
        <div
          style={{
            padding: '30px 15px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div style={{ maxWidth: '1000px', width: '100%' }}>
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '12px',
                padding: '24px 20px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              }}
            >
              {/* Heading */}
              <h2
                style={{
                  marginBottom: '15px',
                  color: '#333',
                  textAlign: 'center',
                }}
              >
                Add Election Details
              </h2>

              {success && (
                <p style={{ color: 'green', textAlign: 'center', marginBottom: '10px' }}>
                  {success}
                </p>
              )}
              {error && (
                <p style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>
                  {error}
                </p>
              )}

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '15px',
                  marginBottom: '20px',
                }}
              >
                <div>
                  <label style={{ display: 'block', marginBottom: '4px' }}>Election Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '6px',
                      border: '1px solid #ccc',
                    }}
                    placeholder="e.g., City Council Election"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '4px' }}>Election Type</label>
                  <select
                    name="electionType"
                    value={form.electionType}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '6px',
                      border: '1px solid #ccc',
                    }}
                  >
                    <option value="">Select Type</option>
                    <option value="Local">Local</option>
                    <option value="State">State</option>
                    <option value="National">National</option>
                    <option value="Student">Student Election</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '4px' }}>City</label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '6px',
                      border: '1px solid #ccc',
                    }}
                    placeholder="e.g., Vijayawada"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '4px' }}>Station</label>
                  <input
                    type="text"
                    name="station"
                    value={form.station}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '6px',
                      border: '1px solid #ccc',
                    }}
                    placeholder="e.g., Station 12"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '4px' }}>Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '6px',
                      border: '1px solid #ccc',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '4px' }}>End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '6px',
                      border: '1px solid #ccc',
                    }}
                  />
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                  }}
                >
                  <button
                    type="submit"
                    style={{
                      padding: '10px 24px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: '#007bff',
                      color: '#fff',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      marginTop: '8px',
                    }}
                  >
                    Enter
                  </button>
                </div>
              </form>

              {/* Elections list */}
              {electionsWithStatus.length > 0 && (
                <>
                  <h3 style={{ marginBottom: '10px', color: '#333' }}>All Elections</h3>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                      gap: '15px',
                    }}
                  >
                    {electionsWithStatus.map(election => {
                      const isParticipating = !!participating[election.id];
                      return (
                        <div
                          key={election.id}
                          style={{
                            border: '1px solid #ddd',
                            borderRadius: '10px',
                            padding: '14px',
                            backgroundColor: '#fff',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                          }}
                        >
                          <h4 style={{ color: '#007bff', marginBottom: '8px' }}>
                            {election.name}
                          </h4>
                          <p>
                            <strong>Type:</strong> {election.electionType || '-'}
                          </p>
                          <p>
                            <strong>City:</strong> {election.city || '-'}
                          </p>
                          <p>
                            <strong>Station:</strong> {election.station || '-'}
                          </p>
                          <p>
                            <strong>Start Date:</strong> {formatDate(election.startDate)}
                          </p>
                          <p>
                            <strong>End Date:</strong> {formatDate(election.endDate)}
                          </p>
                          <p>
                            <strong>Status:</strong>{' '}
                            <span
                              style={{
                                fontWeight: 'bold',
                                color:
                                  election.statusLabel === 'Ongoing'
                                    ? 'green'
                                    : election.statusLabel === 'Upcoming'
                                    ? 'orange'
                                    : 'red',
                              }}
                            >
                              {election.statusLabel}
                            </span>
                          </p>

                          {/* 🔹 Participate / Add button */}
                          <button
                            onClick={() => handleParticipate(election)}
                            disabled={isParticipating}
                            style={{
                              marginTop: '10px',
                              padding: '8px 18px',
                              borderRadius: '6px',
                              border: 'none',
                              backgroundColor: isParticipating ? '#6c757d' : '#28a745',
                              color: '#fff',
                              fontWeight: 'bold',
                              cursor: isParticipating ? 'not-allowed' : 'pointer',
                            }}
                          >
                            {isParticipating ? 'Added' : 'Add to My Elections'}
                          </button>

                          {isParticipating && (
                            <p style={{ marginTop: '6px', color: 'green', fontSize: '14px' }}>
                              You are participating in this election.
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
