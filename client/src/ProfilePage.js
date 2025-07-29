import React, {useEffect, useState} from 'react';
import axios from 'axios';

const ProfilePage = ({ user, tasks, receivedMessages, setReceivedMessages }) => {

    const [selectedMessage, setSelectedMessage] = useState(null);

    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyBody, setReplyBody] = useState('');


    const handleSendReply = async () => {
  if (!replyBody.trim()) {
    alert("A válasz nem lehet üres!");
    return;
  }

  

  const replyMessage = {
    from: user.username,
    to: selectedMessage.from,
    subject: `Re: ${selectedMessage.subject}`,
    body: replyBody
  };

  try {
    await axios.post('/messages/reply', replyMessage);
    alert('Válasz elküldve!');
    setReceivedMessages(prev =>
  prev.map(m =>
    m.id === selectedMessage.id ? { ...m, replied: true } : m
  )
);
    setShowReplyForm(false);
    setReplyBody('');
    setSelectedMessage(null); 
 
  } catch (error) {
    console.error('Hiba a válasz küldésénél:', error);
  }
};


    const getBackgroundColor = (msg) => {
      if (msg.replied) return '#e6ffed';
      if (msg.read) return '#cecacaa1';
      return '#ffecec';
    };

    const handleViewMessage = async (msg) => {
      setSelectedMessage(msg);

      if (!msg.read) {
        try {
          await axios.patch(`/messages/${msg.id}/read`);

          setReceivedMessages(prevMessages => 
            prevMessages.map(m => 
              m.id === msg.id ? {...m, read: true} : m
            )
          );
        } catch (err) {
          console.error('Hiba az üzenet megtekintésekor', err);
        }
      }
    };

    const handleDeleteMessage = async (id) => {
  if (!window.confirm("Biztosan törölni szeretnéd ezt az üzenetet?")) return;

  try {
    await axios.delete(`/messages/${id}`);
    setReceivedMessages(prev => prev.filter(m => m.id !== id));
    if (selectedMessage?.id === id) {
      setSelectedMessage(null);
      setShowReplyForm(false);
      setReplyBody('');
    }
  } catch (error) {
    console.error('Hiba az üzenet törlésekor:', error);
    alert('Hiba történt az üzenet törlésekor.');
  }
};

  console.log("USER", user)


    useEffect(() => {
        if (user) {
            axios.get(`/messages/${user.username}`)
            .then(res => setReceivedMessages(res.data.received))
            .catch(err => console.error('Nem sikerült betölteni az üzeneteket.', err));
        }
    }, [user]);

  if (!user) return null;

  const myTasks = tasks.filter(t => t.assignedTo === user.username && t.status === 'assigned');

  return (
  <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
    <h1>Profilom</h1>

    <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <div style={{
        background: 'rgba(0,0,0,0.1)',
        borderRadius: '16px',
        padding: '2rem',
        overflow: 'visible',
        boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
        textAlign: 'center',
        width: '260px'
      }}>
        <img
  src={`http://localhost:5000/images/${user.image || 'default.jpg'}`}
  alt="Profilkép"
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = 'http://localhost:5000/images/default.jpg';
  }}
  
  style={{
    display: 'block',
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    margin: '0 auto 1rem',
    objectFit: 'cover',
    border: '4px solid #dfefff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    overflow: 'hidden'
  }}
/>

        
        <h2 style={{ marginBottom: '0.5rem' }}>{user.username}</h2>
        <p style={{ color: '#666', fontSize: '1rem' }}>
          {user.job || (user.role === 'boss' ? 'Adminisztrátor' : 'Dolgozó')}
        </p>
      </div>

      <div style={{ flexGrow: 1 }}>
        <h2>Aktív feladataid</h2>
        {myTasks.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {myTasks.map(task => (
              <div key={task.id} style={{
                border: '1px solid #ccc',
                borderRadius: '10px',
                padding: '1rem',
                width: '250px',
                backgroundColor: '#f9f9f9',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
              }}>
                <h3>{task.title}</h3>
                <p style={{ fontSize: '0.9rem' }}>{task.description}</p>
                {task.deadline && (
                  <p style={{ fontSize: '0.85rem', color: '#888' }}>
                    Határidő: {new Date(task.deadline).toLocaleString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontStyle: 'italic', color: 'green' }}>Minden készen van! 🙂</p>
        )}

        <h2 style={{ marginTop: '3rem' }}>📨 Beérkezett üzenetek</h2>
        {receivedMessages.length === 0 ? (
          <p>Nincsenek üzenetek.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {receivedMessages.map(msg => (
              <li key={msg.id} style={{
                marginBottom: '1rem',
                padding: '1rem',
                borderRadius: '8px',
                background: getBackgroundColor(msg),
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'default'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
              }}>
                <p><strong>Feladó:</strong> {msg.from}</p>
                <p><strong>Tárgy:</strong> {msg.subject}</p>
                <p style={{ fontSize: '0.85rem', color: '#666' }}>
                  {new Date(msg.timestamp).toLocaleString()}
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
  <button
    onClick={() => handleViewMessage(msg)}
    style={{
      background: '#007bff',
      color: 'white',
      border: 'none',
      padding: '0.4rem 1rem',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'background 0.2s'
    }}
    onMouseEnter={e => e.currentTarget.style.background = '#0069d9'}
    onMouseLeave={e => e.currentTarget.style.background = '#007bff'}
  >
    Megtekintés
  </button>
  <button
    onClick={() => handleDeleteMessage(msg.id)}
    style={{
      background: '#dc3545',
      color: 'white',
      border: 'none',
      padding: '0.4rem 1rem',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'background 0.2s'
    }}
    onMouseEnter={e => e.currentTarget.style.background = '#c82333'}
    onMouseLeave={e => e.currentTarget.style.background = '#dc3545'}
  >
    Törlés
  </button>
</div>

              </li>
            ))}
          </ul>
        )}

        {selectedMessage && (
          <div
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              zIndex: 9999
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedMessage(null);
                setShowReplyForm(false);
                setReplyBody('');
              }
            }}
          >
            <div
              style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '12px',
                width: '400px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
              }}
              onClick={e => e.stopPropagation()}
            >
              <h3>Üzenet részletei</h3>
              <p><strong>Feladó:</strong> {selectedMessage.from}</p>
              <p><strong>Tárgy:</strong> {selectedMessage.subject}</p>
              <p><strong>Üzenet:</strong> {selectedMessage.body}</p>
              <p style={{ margin: '1rem 0' }}>{selectedMessage.content}</p>
              <p style={{ fontSize: '0.85rem', color: '#666' }}>
                {new Date(selectedMessage.timestamp).toLocaleString()}
              </p>

              <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                <button
                  onClick={() => {
                    setSelectedMessage(null);
                    setShowReplyForm(false);
                    setReplyBody('');
                  }}
                  style={{ marginRight: '1rem' }}
                >
                  Mégse
                </button>
                <button onClick={() => setShowReplyForm(true)}>
                  Válasz
                </button>
              </div>

              {showReplyForm && (
                <div style={{ marginTop: '1rem' }}>
                  <textarea
                    rows={4}
                    style={{ width: '100%', padding: '0.5rem' }}
                    value={replyBody}
                    onChange={(e) => setReplyBody(e.target.value)}
                    placeholder="Írd ide a válaszod..."
                  />
                  <button
                    onClick={handleSendReply}
                    style={{ marginTop: '0.5rem', padding: '0.4rem 1rem' }}
                  >
                    Küldés
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

};

export default ProfilePage;
