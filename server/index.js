const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = 5000;
const path = require('path');

app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'public')));

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = JSON.parse(fs.readFileSync('users.json', 'utf-8'));
  const foundUser = users.find(u => u.username === username && u.password === password);

  if (foundUser) {
    res.json(foundUser);
  } else {
    res.status(401).json({ message: 'Hibás bejelentkezési adatok' });
  }
});


app.get('/tasks', (req, res) => {
    fs.readFile('./tasks.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Nem sikerült beolvasni a tasks.json file tartalmát.', err);
            return res. status(500).json({message: 'Szerverhiba'});
        }
        const tasks = JSON.parse(data);
        res.json(tasks);
    });
});

app.get('/users', (req, res) => {
  fs.readFile(path.join(__dirname, 'users.json'), 'utf8', (err, data) => {
    if (err) {
      console.error('Nem sikerült beolvasni a users.json-t:', err);
      return res.status(500).json({ message: 'Szerverhiba' });
    }

    const users = JSON.parse(data);
    
    res.json(users);
  });
});




app.post('/complete-task', (req, res) => {
    const { taskId } = req.body;
    const tasksPath = path.join(__dirname, 'tasks.json');

    fs.readFile(tasksPath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({message: 'Hiba a fájl olvasásakor.'});
        let tasks = JSON.parse(data);
        const index = tasks.findIndex(t => t.id === taskId);
        if (index === -1) return res.status(404).json({message: 'Feladat nem található.'});

        tasks[index].status = 'done';

        fs.writeFile(tasksPath, JSON.stringify(tasks, null, 2), err => {
            if (err) return res.status(500).json({message: 'Mentési hiba'});
            res.json({message: 'Feladat készre jelölve.'});
        });
    });
});

app.post('/assign-task', (req, res) => {
    const {taskId, assignedTo} = req.body;
    const tasksPath = path.join(__dirname, 'tasks.json');

    fs.readFile(tasksPath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({message: 'Hiba olvasás közben'});

        let tasks = JSON.parse(data);
        const index = tasks.findIndex(t => t.id === taskId);
        if (index === -1) return res.status(404).json({message: 'Feladat nem található.'});
        tasks[index].assignedTo = assignedTo;
        tasks[index].status = 'assigned';

        fs.writeFile(tasksPath, JSON.stringify(tasks, null, 2), (err) => {
            if (err) return res.status(500).json({message: 'Hiba írás közben'});
            res.json({message: 'Feladat frissítve'});
        });
    });
});

app.delete('/task/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    fs.readFile('./tasks.json', 'utf8', (err,data) => {
        if (err) return res.status(500).json({message: 'Hiba a fájl olvasásakor.'});
        let tasks = JSON.parse(data);
        tasks = tasks.filter(t => t.id !== taskId);

        fs.writeFile('./tasks.json', JSON.stringify(tasks, null, 2), err => {
            if (err) return res.status(500).json({message: 'Mentési hiba'});
            res.json({message: 'Feladat törölve'});
        });
    });
});


app.post('/add-task', (req, res) => {
    const {title, description, deadline} = req.body;
    const tasksPath = path.join(__dirname, 'tasks.json');

    fs.readFile(tasksPath, 'utf8', (err,data) => {
        if (err) return res.status(500).json({message: 'Hiba olvasáskor'});

        let tasks = JSON.parse(data);
        const newId = tasks.length > 0 ? Math.max(...tasks.map(t =>t.id)) + 1 : 1;
        const newTask = {
            id: newId,
            title,
            description,
            assignedTo: null,
            status: 'unassigned',
            deadline
        };
        tasks.push(newTask);
        fs.writeFile(tasksPath, JSON.stringify(tasks, null, 2), (err) => {
            if (err) return res.status(500).json({message: 'Hiba írás közben'});
            res.json({message: 'Feladat hozzáadva', task: newTask});
        });
    });
});

app.post('/send-message', (req,res) => {
    const {from, to, subject, content} = req.body;
    if (!from || !to || !subject || !content) {
        return res.status(400).json({message: 'Hiányzó adatok az üzenethez'});
    }

    const messagesPath = path.join(__dirname, 'messages.json');
    fs.readFile(messagesPath, 'utf8', (err,data) => {
        if (err) return res.status(500).json({message: 'Hiba az üzenetfájl olvasásakor'});

        let messages = [];
        try {
            messages = JSON.parse(data);
        } catch (e) {
            return res.status(500).json({message: 'Hibás JSON fomrátum'});
        }

        const newMessage = {
            id: messages.length > 0 ? Math.max(...messages.map(m => m.id)) + 1 : 1,
            from,
            to,
            subject,
            content,
            timestamp: new Date().toISOString(),
            read: false,
            replied: false
        };
        messages.push(newMessage);

        fs.writeFile(messagesPath, JSON.stringify(messages, null, 2), err => {
            if (err) return res.status(500).json({message: 'Mentési hiba'});
            res.json({message: 'Üzenet elküldve'});
        });
    });
});

app.get('/messages/:username', (req, res) => {
    const username = req.params.username;
    const messagesPath = path.join(__dirname,'messages.json');

    fs.readFile(messagesPath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({message: 'Nem sikerült beolvasni az üzenetet'});

        let messages = [];
        try {
            messages = JSON.parse(data);
        } catch (e) {
            return res.status(500).json({message: 'Hibás JSON formátum'});
        }

        const received = messages.filter(m => m.to === username);
        res.json({received});
    });
});

app.patch('/messages/:id/read', (req, res) => {
    const messageId = parseInt(req.params.id);
    const messagesPath = path.join(__dirname, 'messages.json');
    fs.readFile(messagesPath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({message: 'Nem sikerült beolvasni az üzeneteket.'});

        let messages = [];
        try {
            messages = JSON.parse(data);

        } catch (e) {
            return res.status(500).json({message: 'Hibás JSON formátum'});
        }

        const index = messages.findIndex(m => m.id === messageId);
        if (index === -1) return res.status(404).json({message: 'Üzenet nem található'});
        messages[index].read = true;

        fs.writeFile(messagesPath, JSON.stringify(messages, null, 2), err => {
            if (err) return res.status(500).json({message: 'Nem sikerült menteni az üzenetet.'});
            res.json({message: 'Üzenet olvasottra állítva'});
        });
    });
});

app.post('/messages/reply', (req, res) => {
    const reply = req.body;
    const messagesPath = path.join(__dirname, 'messages.json');

    fs.readFile(messagesPath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ message: 'Nem sikerült beolvasni az üzeneteket.' });

        let messages = [];
        try {
            messages = JSON.parse(data);
        } catch (e) {
            return res.status(500).json({ message: 'Hibás JSON formátum.' });
        }

        const newId = messages.length > 0 ? Math.max(...messages.map(m => m.id)) + 1 : 1;

        const newMessage = {
            id: newId,
            from: reply.from,
            to: reply.to,
            subject: reply.subject,
            body: reply.body,
            timestamp: new Date().toISOString(),
            read: false,
            replied: false
        };

        const original = messages.find(m =>
      m.from === reply.to &&
      m.to === reply.from &&
      m.subject === reply.subject.replace(/^Re:\s*/, '')
    );
    if (original) original.replied = true;

        messages.push(newMessage);

        fs.writeFile(messagesPath, JSON.stringify(messages, null, 2), err => {
            if (err) return res.status(500).json({ message: 'Nem sikerült menteni az üzenetet.' });
            res.json({ message: 'Válasz elküldve.', newMessage });
        });
    });
});

app.delete('/messages/:id', (req, res) => {
  const messageId = parseInt(req.params.id);
  const messagesPath = path.join(__dirname, 'messages.json');

  fs.readFile(messagesPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ message: 'Nem sikerült beolvasni az üzeneteket.' });

    let messages = [];
    try {
      messages = JSON.parse(data);
    } catch (e) {
      return res.status(500).json({ message: 'Hibás JSON formátum.' });
    }

    const updatedMessages = messages.filter(m => m.id !== messageId);

    if (updatedMessages.length === messages.length)
      return res.status(404).json({ message: 'Üzenet nem található.' });

    fs.writeFile(messagesPath, JSON.stringify(updatedMessages, null, 2), err => {
      if (err) return res.status(500).json({ message: 'Nem sikerült menteni az üzenetet.' });
      res.json({ message: 'Üzenet törölve.' });
    });
  });
});




app.listen(PORT, () => {
    console.log(`Backend fut: http://localhost:${PORT}`);
})