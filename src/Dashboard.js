import React, { useState } from 'react';

const BACKEND_URL = 'https://sf-backend-7163.onrender.com';

function Dashboard() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);

  const accessToken = sessionStorage.getItem('sf_access_token');
  const instanceUrl = sessionStorage.getItem('sf_instance_url');

  const fetchRules = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/rules?instanceUrl=${instanceUrl}&accessToken=${accessToken}`
      );
      const data = await response.json();
      console.log('Records:', data.records);
      setRules(data.records || []);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const toggleRule = async (rule) => {
    try {
      const getResponse = await fetch(
        `${BACKEND_URL}/api/rules/${rule.Id}?instanceUrl=${instanceUrl}&accessToken=${accessToken}`
      );
      const existingRule = await getResponse.json();

      await fetch(
        `${BACKEND_URL}/api/rules/${rule.Id}?instanceUrl=${instanceUrl}&accessToken=${accessToken}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            metadata: { ...existingRule.Metadata, active: !rule.Active }
          }),
        }
      );
      fetchRules();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="App">
      <h1>Validation Rule Manager</h1>

      <button onClick={fetchRules}>
        {loading ? 'Loading...' : 'Get Validation Rules'}
      </button>

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={() => rules.forEach(rule => !rule.Active && toggleRule(rule))}>
          Enable All
        </button>
        <button onClick={() => rules.forEach(rule => rule.Active && toggleRule(rule))}>
          Disable All
        </button>
        <button onClick={() => {
          sessionStorage.clear();
          window.location.href = '/';
        }}>
          Logout
        </button>
      </div>

      <div style={{ marginTop: '30px', width: '80%' }}>
        {rules.length === 0 ? (
          <p>No rules loaded yet. Click button above!</p>
        ) : (
          rules.map(rule => (
            <div key={rule.Id} style={{
              background: 'white',
              padding: '15px',
              margin: '10px',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <span style={{ fontWeight: 'bold' }}>{rule.ValidationName}</span>
              <span style={{ color: rule.Active ? 'green' : 'red' }}>
                {rule.Active ? '✅ Active' : '❌ Inactive'}
              </span>
              <button onClick={() => toggleRule(rule)}>
                {rule.Active ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;