
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());  // Allow cross-origin requests
app.use(bodyParser.json());  // Parse incoming JSON bodies

// Mongoose model for Invoice
const invoiceSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  address: { type: String, required: true },
  contactNumber: { type: String, required: true },
  courier: {
    dispatchLocation: { type: String },
    courierName: { type: String },
    status: { type: String, default: 'pending' },
  },
  productDetails: [
    {
      description: { type: String },
      hsnCode: { type: String },
      quantity: { type: Number },
      price: { type: Number },
      igst: { type: Number },
      cgst: { type: Number },
      sgst: { type: Number },
      totalAmount: { type: Number },
    },
  ],
  invoiceType: { type: String, default: 'intra-state' },
});

// Mongoose Model for Invoice
const Invoice = mongoose.model('Invoice', invoiceSchema);

// Connect to MongoDB
mongoose.connect('mongodb+srv://khushsoni839:ks1234@cluster0.u3hib.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// GET route to fetch all invoices
app.get('/api/invoices', async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.status(200).json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'Error fetching invoices' });
  }
});

// POST route to create a new invoice
app.post('/api/invoices', async (req, res) => {
  const { companyName, address, contactNumber, courier, productDetails, invoiceType } = req.body;

  const newInvoice = new Invoice({
    companyName,
    address,
    contactNumber,
    courier,
    productDetails,
    invoiceType,
  });

  try {
    const savedInvoice = await newInvoice.save();
    res.status(201).json(savedInvoice);
  } catch (error) {
    console.error('Error saving invoice:', error);
    res.status(400).json({ error: 'Error saving invoice' });
  }
});

// PUT route to update an existing invoice
app.put('/api/invoices/:id', async (req, res) => {
  const { id } = req.params;
  const { companyName, address, contactNumber, courier, productDetails, invoiceType } = req.body;

  try {
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      id,
      { companyName, address, contactNumber, courier, productDetails, invoiceType },
      { new: true }  // Return the updated invoice
    );
    res.status(200).json(updatedInvoice);
  } catch (error) {
    console.error('Error updating invoice:', error);
    res.status(400).json({ error: 'Error updating invoice' });
  }
});

// DELETE route to delete an invoice
app.delete('/api/invoices/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Invoice.findByIdAndDelete(id);
    res.status(200).json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    res.status(400).json({ error: 'Error deleting invoice' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
