const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Atlas connection
const dbURI = 'mongodb+srv://oshan:oshan%40work1234@cluster0.2txxi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';  // Replace with your MongoDB connection string
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1); // Exit the process if DB connection fails
  });

// Task Schema (Updated with new fields)
// const taskSchema = new mongoose.Schema({
//   complaintNumber: String,
//   name: String,
//   email: String,
//   phone: String,
//   additionalStatus: String,
//   complaintNotes: String,
//   status: String,
//   altPhone: String,  // New field: Alternative Phone
//   state: String,
//   city: String,
//   pincode: String,
//   location: String,
//   landmark: String,
//   product: String,
//   selectedModel: Object,  // Store model details
//   serialNumber: String,
//   warrantyStatus: String, // Warranty status with expiry date
//   purchaseDate: String,
//   installationDate: String,
//   callType: String,           // New field: Call Type
//   condition: String,           // New field: Call Type
//   callSource: String,         // New field: Call Source
//   taskStatus: String,         // New field: Task Status
//   assignEngineer: String,     // New field: Assign Engineer
//   contactNo: String,        // New field: Engineer Contact No.
//   dealer: String,        // New field: Engineer Contact No.
//   date: String,        // New field: Engineer Contact No.
//   asp: String,        // New field: Engineer Contact No.
//   aspName: String,        // New field: Engineer Contact No.
//   actionTaken: String,        // New field: Engineer Contact No.
//   customerFeedback: String,        // New field: Engineer Contact No.
//   enginnerNotes: String,        // New field: Engineer Contact No.
//   images: [String],           // New field: Images (for storing image URLs or file names)
// });

const taskSchema = new mongoose.Schema({
  complaintNumber: String,
  name: String,
  email: String,
  phone: String,
  altPhone: String,
  state: String,
  city: String,
  pincode: String,
  location: String,
  landmark: String,
  product: String,
  selectedModel: {
    model: String,
    capacity: String,
    warranty: Number
  },
  serialNumber: String,
  warrantyStatus: {
    status: String,
    expiryDate: String
  },
  purchaseDate: String,
  installationDate: String,
  callType: String,
  condition: String,
  callSource: String,
  taskStatus: String,
  assignEngineer: String,
  contactNo: String,
  dealer: String,
  date: String,
  asp: String,
  aspName: String,
  actionTaken: String,
  customerFeedback: String,
  enginnerNotes: String,
  images: [String],
  status: String,
  complaintNotes: String,
  additionalStatus: String,
}, { timestamps: true }); // ✅ Adds createdAt and updatedAt fields

// Create Task model
const Task = mongoose.model('Task', taskSchema);

// Routes

// Add new task
app.post('/tasks', async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error("Error saving task:", err);
    res.status(500).json({ error: "Failed to save task. Please try again." });
  }
});

// Get all tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ error: "Failed to fetch tasks. Please try again." });
  }
});

// Update task
app.put('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(200).json(task);
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ error: "Failed to update task. Please try again." });
  }
});

// Delete task
app.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(200).json({ message: 'Task deleted' });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ error: "Failed to delete task. Please try again." });
  }
});

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
