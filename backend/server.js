import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.get('/', (req, res) => {
  res.send('API is running...');
});

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://psac:psac2025@cluster0.16lqx5m.mongodb.net/psac_db';
const JWT_SECRET = process.env.JWT_SECRET || 'psac_super_secret_2024_change_in_production';

// MongoDB Connection
mongoose.connect(MONGO_URI).
  then(() => console.log('✅ MongoDB Connected to psac_db')).
  catch(err => console.error('❌ MongoDB Connection Error:', err));

// Schemas/Models
const appointmentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  surname: { type: String, required: true },
  contactNumber: { type: String, required: true },
  email: { type: String, required: true },
  carModel: { type: String, required: true },
  serviceType: { type: String, required: true },
  bookingDate: { type: String, required: true },
  bookingTime: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  imgURL: String,
  category: String,
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
});

const announcementSchema = new mongoose.Schema({
  title: String,
  content: String,
  type: String,
  image: String,
}, { timestamps: true });

const testimonialSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  testimonialText: { type: String, required: true },
  image: String,
  serviceType: String,
}, { timestamps: true });

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  imgURL: String,
}, { timestamps: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);
const Product = mongoose.model('Product', productSchema);
const User = mongoose.model('User', userSchema);
const Announcement = mongoose.model('Announcement', announcementSchema);
const Testimonial = mongoose.model('Testimonial', testimonialSchema);
const Service = mongoose.model('Service', serviceSchema);

const mechanicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  imgURL: String,
}, { timestamps: true });

const Mechanic = mongoose.model('Mechanic', mechanicSchema);

// Helper function to transform appointment data for frontend
const transformAppointment = (apt) => {
  const plainApt = apt.toObject ? apt.toObject() : apt;
  return {
    ...plainApt,
    id: plainApt._id ? plainApt._id.toString() : plainApt.id,
    customerName: plainApt.firstName && plainApt.surname ? `${plainApt.firstName} ${plainApt.surname}`.trim() : plainApt.customerName || 'Unknown',
    formattedCreatedAt: plainApt.createdAt ? new Date(plainApt.createdAt).toLocaleString('en-US', { 
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    }) : null,
    formattedUpdatedAt: plainApt.updatedAt ? new Date(plainApt.updatedAt).toLocaleString('en-US', { 
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    }) : null,
    _id: undefined
  };
};

// Auth Middleware
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password || !role || !['admin','user'].includes(role)) {
      return res.status(400).json({ error: 'Username and password are required, role must be admin or user' });
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    const totalCount = await User.countDocuments({});
    if (totalCount >= 2) {
      return res.status(400).json({ error: 'Account limit reached.' });
    }
    const hashedPass = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPass, role });
    await user.save();
    const token = jwt.sign({ username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { username: user.username, role: user.role } });
    console.log(`✅ New ${role} account created: ${username}`);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// Auth Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
cb(null, 'public/images/products/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const uploadProduct = multer({
  storage: productStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images allowed'), false);
    }
  }
});

// Products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Error' });
  }
});

app.post('/api/products', authMiddleware, uploadProduct.single('image'), async (req, res) => {
  try {
    let productData = { ...req.body };
    if (req.file) {
      productData.imgURL = req.file.path.replace(/\\/g, '/').replace(/^public\//, '');
    }
    const product = new Product(productData);
    await product.save();
    res.json({ message: 'Product added!', id: product._id });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Error' });
  }
});

app.put('/api/products/:id', authMiddleware, uploadProduct.single('image'), async (req, res) => {
  try {
    let updateData = { ...req.body };
    if (req.file) {
      updateData.imgURL = req.file.path.replace(/\\/g, '/').replace(/^public\//, '');
    }
    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product updated!', product });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Error' });
  }
});

app.delete('/api/products/:id', authMiddleware, async (req, res) => {
  try {
    const result = await Product.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted!' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Error' });
  }
});

// Appointments POST (create new booking)
app.post('/api/appointments', async (req, res) => {
  try {
    const appointment = new Appointment({ ...req.body, status: 'pending' });
    await appointment.save();
    res.json({ message: 'Appointment booked!', id: appointment._id });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Error' });
  }
});

// Appointments GET all
app.get('/api/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 }).lean();
    const transformed = appointments.map(transformAppointment);
    res.json(transformed);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Error' });
  }
});

// Pending (no auth)
app.get('/api/appointments/pending', async (req, res) => {
  try {
    const appointments = await Appointment.find({ status: 'pending' }).sort({ createdAt: 1 }).lean();
    const transformed = appointments.map(transformAppointment);
    res.json(transformed);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Error' });
  }
});

// Approved (no auth)
app.get('/api/appointments/approved', async (req, res) => {
  try {
    const appointments = await Appointment.find({ status: 'approved' }).sort({ createdAt: -1 }).lean();
    const transformed = appointments.map(transformAppointment);
    res.json(transformed);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Error' });
  }
});

// Rejected (no auth)
app.get('/api/appointments/rejected', async (req, res) => {
  try {
    const appointments = await Appointment.find({ status: 'rejected' }).sort({ createdAt: -1 }).lean();
    const transformed = appointments.map(transformAppointment);
    res.json(transformed);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Error' });
  }
});

// Update status (auth required)
app.put('/api/appointments/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json({ message: `Appointment updated to ${status}!`, appointment: transformAppointment(appointment) });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Error' });
  }
});

// Stats (no auth, simplified)
app.get('/api/appointments/stats', async (req, res) => {
  try {
    const result = await Appointment.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pendingCount: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          approvedCount: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } },
          rejectedCount: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } }
        }
      }
    ]);
    const statData = result[0] || { total: 0, pendingCount: 0, approvedCount: 0, rejectedCount: 0 };
    res.json({
      total: statData.total || 0,
      pending: statData.pendingCount || 0,
      approved: statData.approvedCount || 0,
      rejected: statData.rejectedCount || 0
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'Error fetching stats' });
  }
});

// History (no auth)
app.get('/api/appointments/history', async (req, res) => {
  try {
    const history = await Appointment.find().sort({ createdAt: -1 }).limit(50).lean();
    const transformed = history.map(transformAppointment);
    res.json(transformed);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Error' });
  }
});

// Helper function to transform announcement data for frontend
const transformAnnouncement = (ann) => {
  const plainAnn = ann.toObject ? ann.toObject() : ann;

  let image = null;
  if (plainAnn.image) {
    const raw = String(plainAnn.image).replace(/\\/g, '/');

    // Backend upload stores `/uploads/<filename>`.
    // Older/alternate records might store `uploads/<filename>` (no leading slash).
    // Ensure frontend always gets a valid path from the SPA.
    if (raw.startsWith('http://') || raw.startsWith('https://')) {
      image = raw;
    } else if (raw.startsWith('/uploads/')) {
      image = raw;
    } else if (raw.startsWith('uploads/')) {
      image = '/' + raw;
    } else if (raw.includes('/uploads/')) {
      // last-resort normalization
      const idx = raw.indexOf('/uploads/');
      image = raw.slice(idx);
    } else {
      // If it's just a filename, assume uploads.
      image = '/uploads/' + raw.split('/').pop();
    }
  }

  // Backward compatibility: if old records stored `/uploads/<filename>` without `announcements/`, fix it.
  if (image) {
    image = String(image);
    if (image.startsWith('/uploads/') && !image.startsWith('/uploads/announcements/')) {
      image = image.replace('/uploads/', '/uploads/announcements/');
    }
    if (image.includes('://') && image.includes('/uploads/') && !image.includes('/uploads/announcements/')) {
      const schemeSplit = image.split('://');
      const rest = schemeSplit.slice(1).join('://');
      image = schemeSplit[0] + '://' + rest.replace('/uploads/', '/uploads/announcements/');
    }
  }

  return {
    ...plainAnn,
    id: plainAnn._id ? plainAnn._id.toString() : plainAnn.id,
    message: plainAnn.content,
    type: plainAnn.type || 'info',
    image,
    _id: undefined,
  };
};

// Announcements (public read, auth protected write)
app.get('/api/announcements', async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 }).lean();
    const transformed = announcements.map(transformAnnouncement);
    res.json(transformed);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Error' });
  }
});

const announcementStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/announcements/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const uploadAnnouncement = multer({ 
  storage: announcementStorage, 
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images allowed'), false);
    }
  }
});

app.post('/api/announcements', authMiddleware, uploadAnnouncement.single('image'), async (req, res) => {
  try {
    let announcementData = {
      ...req.body,
      content: req.body.message || req.body.content,
      type: req.body.type,
      title: req.body.message?.substring(0, 100) || 'Announcement'
    };
    if (req.file) {
      announcementData.image = '/uploads/announcements/' + req.file.filename;
    }
    const announcement = new Announcement(announcementData);
    await announcement.save();
    res.json(transformAnnouncement(announcement));
  } catch (err) {
    res.status(500).json({ error: err.message || 'Error' });
  }
});

app.put('/api/announcements/:id', authMiddleware, uploadAnnouncement.single('image'), async (req, res) => {
  try {
    let updateData = {
      ...req.body,
      content: req.body.message || req.body.content,
      type: req.body.type
    };
    if (req.file) {
      updateData.image = '/uploads/announcements/' + req.file.filename;
    }
    const announcement = await Announcement.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!announcement) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.json(transformAnnouncement(announcement));
  } catch (err) {
    res.status(500).json({ error: err.message || 'Error' });
  }
});

app.delete('/api/announcements/:id', authMiddleware, async (req, res) => {
  try {
    const result = await Announcement.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Error' });
  }
});

// Testimonials
app.get('/api/testimonials', async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 }).lean();
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Error' });
  }
});

app.post('/api/testimonials', authMiddleware, async (req, res) => {
  try {
    const testimonial = new Testimonial(req.body);
    await testimonial.save();
    res.json({ message: 'Testimonial added!', testimonial });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Error' });
  }
});

app.put('/api/testimonials/:id', authMiddleware, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }
    res.json({ message: 'Testimonial updated!', testimonial });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Error' });
  }
});

app.delete('/api/testimonials/:id', authMiddleware, async (req, res) => {
  try {
    const result = await Testimonial.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.json({ message: 'Testimonial deleted!' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Error' });
  }
});

// Services
const serviceStorage = multer.diskStorage({
  destination: (req, file, cb) => {
cb(null, 'public/images/services/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const uploadService = multer({
  storage: serviceStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images allowed'), false);
    }
  }
});

const mechanicStorage = multer.diskStorage({
  destination: (req, file, cb) => {
cb(null, 'public/images/mechanics/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const uploadMechanic = multer({
  storage: mechanicStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images allowed'), false);
    }
  }
});

app.get('/api/services', async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 }).lean();
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Error' });
  }
});

app.post('/api/services', authMiddleware, uploadService.single('image'), async (req, res) => {
  try {
    let serviceData = { ...req.body };
    if (req.file) {
      serviceData.imgURL = req.file.path.replace(/\\/g, '/').replace(/^public\//, '');
    }
    const service = new Service(serviceData);
    await service.save();
    res.json({ message: 'Service added!', id: service._id });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Error' });
  }
});

app.put('/api/services/:id', authMiddleware, uploadService.single('image'), async (req, res) => {
  try {
    let updateData = { ...req.body };
    if (req.file) {
      updateData.imgURL = req.file.path.replace(/\\/g, '/').replace(/^public\//, '');
    }
    const service = await Service.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json({ message: 'Service updated!', service });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Error' });
  }
});

app.delete('/api/services/:id', authMiddleware, async (req, res) => {
  try {
    const result = await Service.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json({ message: 'Service deleted!' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Error' });
  }
});

// Mechanics
app.get('/api/mechanics', async (req, res) => {
  try {
    const mechanics = await Mechanic.find().sort({ createdAt: -1 }).lean();
    res.json(mechanics);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Error' });
  }
});

app.post('/api/mechanics', authMiddleware, uploadMechanic.single('image'), async (req, res) => {
  try {
    let mechanicData = { ...req.body };
    if (req.file) {
      mechanicData.imgURL = req.file.path.replace(/\\/g, '/').replace(/^public\//, '');
    }
    const mechanic = new Mechanic(mechanicData);
    await mechanic.save();
    res.json({ message: 'Mechanic added!', id: mechanic._id });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Error' });
  }
});

app.put('/api/mechanics/:id', authMiddleware, uploadMechanic.single('image'), async (req, res) => {
  try {
    let updateData = { ...req.body };
    if (req.file) {
      updateData.imgURL = req.file.path.replace(/\\/g, '/').replace(/^public\//, '');
    }
    const mechanic = await Mechanic.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!mechanic) {
      return res.status(404).json({ error: 'Mechanic not found' });
    }
    res.json({ message: 'Mechanic updated!', mechanic });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Error' });
  }
});

app.delete('/api/mechanics/:id', authMiddleware, async (req, res) => {
  try {
    const result = await Mechanic.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Mechanic not found' });
    }
    res.json({ message: 'Mechanic deleted!' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Error' });
  }
});

// Reports API Endpoints
app.get('/api/reports/appointments', authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate, status, serviceType } = req.query;
    const query = {};
    if (status && status !== 'all') query.status = status;
    if (serviceType && serviceType !== 'all') query.serviceType = serviceType;
    if (startDate || endDate) {
      query.bookingDate = {};
      if (startDate) query.bookingDate.$gte = startDate;
      if (endDate) query.bookingDate.$lte = endDate;
    }
    const appointments = await Appointment.find(query).sort({ createdAt: -1 }).lean();
    const transformed = appointments.map(transformAppointment);
    res.json(transformed);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Error fetching report appointments' });
  }
});

app.get('/api/reports/summary', authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate, status, serviceType } = req.query;
    const matchStage = {};
    if (status && status !== 'all') matchStage.status = status;
    if (serviceType && serviceType !== 'all') matchStage.serviceType = serviceType;
    if (startDate || endDate) {
      matchStage.bookingDate = {};
      if (startDate) matchStage.bookingDate.$gte = startDate;
      if (endDate) matchStage.bookingDate.$lte = endDate;
    }
    const result = await Appointment.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pendingCount: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          approvedCount: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } },
          rejectedCount: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } }
        }
      }
    ]);
    const statData = result[0] || { total: 0, pendingCount: 0, approvedCount: 0, rejectedCount: 0 };
    res.json({
      total: statData.total || 0,
      pending: statData.pendingCount || 0,
      approved: statData.approvedCount || 0,
      rejected: statData.rejectedCount || 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Error fetching report summary' });
  }
});

app.get('/api/reports/service-types', authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;
    const matchStage = {};
    if (status && status !== 'all') matchStage.status = status;
    if (startDate || endDate) {
      matchStage.bookingDate = {};
      if (startDate) matchStage.bookingDate.$gte = startDate;
      if (endDate) matchStage.bookingDate.$lte = endDate;
    }
    const result = await Appointment.aggregate([
      { $match: matchStage },
      { $group: { _id: '$serviceType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json(result.map(r => ({ name: r._id, value: r.count })));
  } catch (err) {
    res.status(500).json({ error: err.message || 'Error fetching service type report' });
  }
});

app.get('/api/reports/daily-trends', authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;
    const matchStage = {};
    if (status && status !== 'all') matchStage.status = status;
    if (startDate || endDate) {
      matchStage.bookingDate = {};
      if (startDate) matchStage.bookingDate.$gte = startDate;
      if (endDate) matchStage.bookingDate.$lte = endDate;
    }
    const result = await Appointment.aggregate([
      { $match: matchStage },
      { $group: { _id: '$bookingDate', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    res.json(result.map(r => ({ date: r._id, bookings: r.count })));
  } catch (err) {
    res.status(500).json({ error: err.message || 'Error fetching daily trends' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  console.log('💾 MongoDB: psac_db');
});
