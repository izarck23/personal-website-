const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-Memory Database for Bookings & Stylist Schedules
let appointments = [
  {
    id: 'apt-101',
    customerName: 'Sophia Miller',
    customerEmail: 'sophia@example.com',
    customerPhone: '+1 (555) 234-5678',
    service: 'Signature Balayage & Gloss',
    stylist: 'Elena Vance — Master Colorist',
    date: '2026-09-02',
    time: '11:00 AM',
    notes: 'Looking for a warm honey undertone blend',
    status: 'confirmed',
    createdAt: new Date().toISOString()
  }
];

const stylists = [
  { id: 'elena', name: 'Elena Vance', title: 'Master Colorist', experience: '12 Years', specialties: ['Balayage', 'Color Correction', 'Glossing'] },
  { id: 'marcus', name: 'Marcus Thorne', title: 'Creative Cut Specialist', experience: '9 Years', specialties: ['Precision Bob', 'Editorial Layers', 'Texturizing'] },
  { id: 'chloe', name: 'Chloe Dubois', title: 'Texture & Treatment Director', experience: '11 Years', specialties: ['Keratin Infusion', 'Deep Scalp Therapy', 'Silk Press'] }
];

const services = [
  { id: 'srv-1', category: 'Hair Artistry & Color', name: 'Signature Balayage & Gloss', price: '$220+', duration: '150 min' },
  { id: 'srv-2', category: 'Hair Artistry & Color', name: 'Precision Sculpting Cut & Blowout', price: '$95+', duration: '60 min' },
  { id: 'srv-3', category: 'Hair Artistry & Color', name: 'Platinum Blonde Reformation', price: '$280+', duration: '210 min' },
  { id: 'srv-4', category: 'Luxe Treatments', name: 'Caviar Scalp Rejuvenation Ritual', price: '$135', duration: '50 min' },
  { id: 'srv-5', category: 'Luxe Treatments', name: 'Molecular Keratin Smoothing Infusion', price: '$260', duration: '180 min' },
  { id: 'srv-6', category: 'Nails & Spa Esthetics', name: '24K Gold Luxury Manicure & Pedicure', price: '$120', duration: '75 min' }
];

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Luxe Salon Booking Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// GET /api/services - Retrieve all available salon services
app.get('/api/services', (req, res) => {
  res.json({ success: true, count: services.length, data: services });
});

// GET /api/stylists - Retrieve all master stylists
app.get('/api/stylists', (req, res) => {
  res.json({ success: true, count: stylists.length, data: stylists });
});

// GET /api/appointments - Retrieve all appointments (Admin/Staff)
app.get('/api/appointments', (req, res) => {
  res.json({ success: true, count: appointments.length, data: appointments });
});

// POST /api/appointments - Book a new salon appointment
app.post('/api/appointments', (req, res) => {
  const { customerName, customerEmail, customerPhone, service, stylist, date, time, notes } = req.body;

  if (!customerName || !customerEmail || !customerPhone || !service || !date || !time) {
    return res.status(400).json({
      success: false,
      error: 'Missing required booking fields (customerName, customerEmail, customerPhone, service, date, time).'
    });
  }

  const newAppointment = {
    id: 'apt-' + Math.floor(1000 + Math.random() * 9000),
    customerName,
    customerEmail,
    customerPhone,
    service,
    stylist: stylist || 'Any Available Master Stylist',
    date,
    time,
    notes: notes || '',
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };

  appointments.unshift(newAppointment);

  return res.status(201).json({
    success: true,
    message: `Appointment confirmed for ${customerName} on ${date} at ${time}.`,
    appointment: newAppointment
  });
});

// GET /api/appointments/:id - Retrieve appointment by ID
app.get('/api/appointments/:id', (req, res) => {
  const apt = appointments.find(a => a.id === req.params.id);
  if (!apt) {
    return res.status(404).json({ success: false, error: 'Appointment not found.' });
  }
  res.json({ success: true, appointment: apt });
});

// DELETE /api/appointments/:id - Cancel appointment
app.delete('/api/appointments/:id', (req, res) => {
  const index = appointments.findIndex(a => a.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Appointment not found.' });
  }
  const removed = appointments.splice(index, 1);
  res.json({ success: true, message: 'Appointment cancelled successfully.', appointment: removed[0] });
});

app.listen(PORT, () => {
  console.log(`[Luxe Salon Backend] Server running on http://localhost:${PORT}`);
});
