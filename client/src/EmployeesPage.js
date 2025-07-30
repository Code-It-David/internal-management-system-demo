
import React, {useState} from 'react';
import MessageModal from './MessageModal';





const EmployeesPage = ({ user, tasks, workers }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');


  if (!user) return null;

  const sortedUsers = [...workers]
  .filter(w => w.username !== user.username && w.username.toLowerCase().startsWith(searchTerm.toLowerCase()))
  .sort((a, b) => {
    if (a.role === 'boss' && b.role !== 'boss') return -1;
    if (a.role !== 'boss' && b.role === 'boss') return 1;
    return 0;
  });


  return (
    <>
      
      <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
        <h1>Dolgozók</h1>
        <input
  type="text"
  placeholder="Search by name..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  style={{
    padding: '0.5rem',
    margin: '1rem 0',
    fontSize: '1rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    width: '250px'
  }}
/>


        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          {sortedUsers.map((worker) => (
            <div
              key={worker.username}
              style={{
                background: worker.role === 'boss' ? 'rgba(120, 200, 160, 0.1)' : 'rgba(0, 123, 255, 0.1)',
                border: `2px solid ${worker.role === 'boss' ? 'rgba(100, 160, 130, 0.4)' : 'rgba(0, 123, 255, 0.4)'}`,
                boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                padding: '1.5rem',
                width: '200px',
                minHeight: '400px',
                textAlign: 'center',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
              }}
            >
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  margin: '0 auto 1rem',
                  backgroundImage: `url("http://localhost:5000/images/${worker.image || 'default.jpg'}")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <strong style={{ fontSize: '1.4rem' }}>{worker.username}</strong><br />
              <span style={{ fontSize: '1.1rem', color: '#555' }}>
                {worker.job || (worker.role === 'boss' ? 'Manager' : 'Employee')}
              </span>

              <ul style={{ marginTop: '2rem', paddingLeft: '1rem', textAlign: 'left' }}>
                {tasks
                  .filter((t) => t.assignedTo === worker.username)
                  .map((t) => (
                    <li key={t.id} style={{ marginBottom: '6px' }}>
                      {t.title}
                    </li>
                  ))}
              </ul>

              <button style={{ marginTop: '1rem', background: 'none', border: 'none', cursor: 'pointer' }}
              onClick={() => setSelectedUser(worker)}>
                <img src="http://localhost:5000/images/message_icon.jpg" alt="Üzenet" width="48" height="48" />
              </button>
            </div>
          ))}
        </div>
      </div>
      {selectedUser && (
  <MessageModal toUser={selectedUser} onClose={() => setSelectedUser(null)} />
)}

    </>
  );
};

export default EmployeesPage;
