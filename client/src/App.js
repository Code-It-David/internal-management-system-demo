import { useEffect, useState } from "react";
import axios from 'axios';
import './App.css'
import Navbar from "./Navbar";
import EmployeesPage from "./EmployeesPage";
import ProfilePage from "./ProfilePage";
import MessageModal from "./MessageModal";

function App() {
  const [loginData, setLoginData] = useState({username: '', password: ''});
  const [user,setUser] = useState(null);
  const [error, setError] = useState('');
  const [tasks, setTasks] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [newTask, setNewTask] = useState({title: '', description: '', deadline: ''});
  const [view, setView] = useState('home');
  const [selectedUser, setSelectedUser] = useState(null);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');




const addNewTask = async () => {
  if (!newTask.title.trim() || !newTask.description.trim()) {
    alert('Please fill the required places');
    return;
  }

  try {
    await axios.post('/add-task', newTask);
    setNewTask({ title: '', description: '' });
    const res = await axios.get('/tasks');
    setTasks(res.data);
  } catch (err) {
    alert('Error at adding new task');
    console.error(err);
  }
}


  useEffect(() => {
    if (user?.role === 'worker') {
      axios.get('/tasks')
        .then(res => {
          setTasks(res.data);

          const now = new Date();
          const urgentTask = res.data.filter(task => task.assignedTo === user.username && task.status === 'assigned' && new Date(task.deadline) - now < 24 * 60 * 60 * 1000);

          if (urgentTask.length > 0) {
            alert("You have an undone assigned job.");
          }
        })
        .catch(err => console.error('Failed getting the jobs', err))
    }
  }, [user]);

  useEffect(() => {
  if (user) {
    axios.get(`/messages/${user.username}`)
      .then(res => setReceivedMessages(res.data.received))
      .catch(err => console.error('Failed loading messages.', err));
  }
}, [user]);


  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/login', loginData);
      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);
      setError('');
      setView('home');
    } catch (err) {
      setUser(null);
      setError('Incorrect username or password.');
    }
  };

  useEffect(() => {
    if (user?.role === 'boss') {
      axios.get('/tasks')
        .then(res => setTasks(res.data))
        .catch(err => console.error('Error getting tasks.', err));
    }
  }, [user]);

  useEffect(() => {
    if (user?.role === 'boss') {
      axios.get('/users')
        .then(res => setWorkers(res.data))
        .catch(err => console.error('Error loading users.', err));
    }
  }, [user]);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
  if (user?.role === 'boss') {
    axios.get('/users')
      .then(res => {
        console.log('Employees loaded:', res.data);
        setWorkers(res.data);
      })
      .catch(err => console.error('Error loading employees.', err));
  }
}, [user]);



return (
  <>
  {selectedUser && (
    <MessageModal toUser={selectedUser} onClose={() => setSelectedUser(null)} />
  )}
    {user && (
      <Navbar
        hasUnreadMessages={receivedMessages.some(msg => !msg.read)}
        onLogout={() => {
          localStorage.removeItem('user');
          setUser(null);
          setLoginData({ username: '', password: '' });
        }}
        onGoHome={() => setView('home')}
        onGoEmployees={() => setView('employees')}
        onGoProfile={() => setView('profile')}
      />
    )}
    <form onSubmit={(e) => {e.preventDefault();handleLogin();}}></form>
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      {!user && <h1>Login</h1>}

      {!user ? (
  <>
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleLogin();
      }}
    >
      <input
        placeholder="Username"
        value={loginData.username}
        onChange={e => setLoginData({ ...loginData, username: e.target.value })}
      /><br /><br />
      <input
        type="password"
        placeholder="Password"
        value={loginData.password}
        onChange={e => setLoginData({ ...loginData, password: e.target.value })}
      /><br /><br />
      <button type="submit">Login</button>
    </form>

    {error && <p style={{ color: 'red' }}>{error}</p>}
  </>


      ) : view === 'employees' ? (
        <EmployeesPage user={user} tasks={tasks} workers={workers} />
      ) : view === 'profile' ? (
        <ProfilePage user={user} tasks={tasks} receivedMessages={receivedMessages} setReceivedMessages={setReceivedMessages}/>
      ) : (
        <>
          <p
          style={{fontSize: '1.8rem', color:'#003366', textShadow: '1px 1px 2px rgba(0,0,0,0.2)', marginBottom:'1rem', fontWeight: 'bold'}}>Welcome back, {user.username}! </p>
          <button onClick={() => {
            setUser(null);
            localStorage.removeItem('user');
            setLoginData({ username: '', password: '' });
          }}>Logout</button>

          
{user?.role === 'worker' && (
  <div style={{ marginTop: '2rem' }}>
    <h2>Assigned tasks</h2>
    <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "flex-start" }}>
      {tasks
        .filter(task => task.assignedTo === user.username && task.status === 'assigned')
        .map(task => {
          const isUrgent = task.deadline && (new Date(task.deadline) - new Date() < 24 * 60 * 60 * 1000);
          return (
            <div key={task.id} style={{
              borderRadius: '12px',
              width: "222px",
              padding: '1.5rem',
              marginBottom: '1rem',
              backgroundColor: isUrgent ? '#ffe5e5' : '#f9f9f9',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              transition: 'transform 0.2s',
              borderLeft: isUrgent ? '5px solid #d33' : '5px solid #1e90ff',
              position: 'relative'
            }}>
              <h3 style={{ margin: '0 0 0.5rem 0' }}>{task.title}</h3>
              <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem', color: '#333' }}>{task.description}</p>
              {task.deadline && (
                <p style={{ fontSize: '0.85rem', color: '#666' }}>
                  ⏰ Deadline: {new Date(task.deadline).toLocaleString()}
                </p>
              )}

              <button
                onClick={async () => {
                  await axios.post('/complete-task', { taskId: task.id });
                  axios.get('/tasks').then(res => setTasks(res.data));
                }}
                style={{
                  marginTop: '1rem',
                  background: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#45a049'}
                onMouseLeave={e => e.currentTarget.style.background = '#4CAF50'}
              >
                ✅ Done
              </button>
            </div>
          );
        })}
    </div>
  </div>
)}

      




          
          {user?.role === 'boss' && (
            <>
              
              <div style={{ marginBottom: '2rem' }}>
                <h2>Add new task</h2>
                <input
                  placeholder="Task name"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                /><br /><br />
                <textarea
                  placeholder="Description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  rows={4}
                  style={{ width: '300px' }}
                /><br /><br />

                <label htmlFor="deadline">Deadline:</label><br />
                <input
                  id="deadline"
                  type="date"
                  value={newTask.deadline}
                  onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                /><br /><br />

                <button onClick={addNewTask}>Add task</button>
              </div>

             
              <h2>Tasks</h2>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {tasks.map(task => {
                  const isUrgent = task.deadline && (new Date(task.deadline) - new Date() < 24 * 60 * 60 * 1000);
                  return (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData('taskId', task.id)}
                      style={{
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        padding: '1rem',
                        width: '200px',
                        backgroundColor: task.status === 'done' ? '#c8e6c9'
                          : isUrgent ? '#ffdddd'
                          : task.assignedTo ? '#555' : '#f9f9f9',
                        color: task.assignedTo && !isUrgent ? 'white' : 'black'
                      }}
                    >
                      <h3>{task.title}</h3>
                      <p>{task.description}</p>
                      {task.deadline && (
                        <p style={{ fontSize: '0.9rem' }}>
                          Deadline: {new Date(task.deadline).toLocaleString()}
                        </p>
                      )}
                      <small>
                        {task.assignedTo
                          ? `Assigned to: ${task.assignedTo}`
                          : 'Not assigned yet'}
                      </small><br />
                      {task.status === 'done' && (
                        <button onClick={async () => {
                          await axios.delete(`/task/${task.id}`);
                          axios.get('/tasks').then(res => setTasks(res.data));
                        }}>✔ Approve (delete)</button>
                      )}
                    </div>
                  );
                })}
              </div>

             
              <div style={{ marginTop: '2rem', marginBottom: '1rem' }}>
  <h2>Employees</h2>
  <input
    type="text"
    placeholder="Search by name..."
    value={searchTerm}
    onChange={e => setSearchTerm(e.target.value)}
    style={{
      padding: '0.5rem',
      width: '250px',
      fontSize: '1rem',
      borderRadius: '8px',
      border: '1px solid #ccc',
      marginTop: '0.5rem'
    }}
  />
</div>

              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                {workers
                      .filter(worker => worker.role !== 'boss' && worker.username.toLowerCase().startsWith(searchTerm.toLowerCase()))
                      .map(worker => (
                  <div
                    key={worker.username}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      const taskId = e.dataTransfer.getData('taskId');
                      axios.post('/assign-task', {
                        taskId: parseInt(taskId),
                        assignedTo: worker.username
                      }).then(() => {
                        axios.get('/tasks').then(res => setTasks(res.data));
                      });
                    }}
                    style={{
                      background: 'rgba(0, 123, 255, 0.1)',
                      borderRadius: '16px',
                      border: '2px solid rgba(0, 123, 255, 0.4)',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                      padding: '1.5rem',
                      width: '200px',
                      minHeight: '400px',
                      textAlign: 'center',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-6px)';
                      e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
                    }}
                    onMouseLeave={e => {
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
                      {worker.job || 'Employee'}
                    </span>

                    <ul style={{ marginTop: '2rem', paddingLeft: '1rem', textAlign: 'left' }}>
                      {tasks
                        .filter(t => t.assignedTo === worker.username)
                        .map(t => (
                          <li key={t.id} style={{ marginBottom: '6px' }}>{t.title}</li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  </>
);








}

export default App;
