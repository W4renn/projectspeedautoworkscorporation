import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://psac:psac2025@cluster0.16lqx5m.mongodb.net/psac_db';

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  imgURL: String,
}, { timestamps: true });

const Service = mongoose.model('Service', serviceSchema);

const services = [
  {
    title: "Engine Repair",
    description: "Top quality engine repair services.",
    imgURL: "/images/services/enginerepair.jpg",
  },
  {
    title: "Oil Change",
    description: "Fast and reliable oil change.",
    imgURL: "/images/services/oilchange.jpg",
  },
  {
    title: "Brake Service",
    description: "Ensure your brakes are safe and smooth.",
    imgURL: "/images/services/brakeservice.jpg",
  },
  {
    title: "Tire Replacement",
    description: "High quality tires and installation.",
    imgURL: "/images/services/tirereplacement.jpg",
  },
  {
    title: "Car Detailing",
    description: "Keep your car spotless inside and out.",
    imgURL: "/images/services/cardetail.jpg",
  },
  {
    title: "PMS",
    description: "Preventive Maintenance Schedule to keep your vehicle in top condition.",
    imgURL: "/images/services/cardetail.jpg",
  },
  {
    title: "Aircon Servicing",
    description: "Comprehensive air conditioning service and repair.",
    imgURL: "/images/services/cardetail.jpg",
  },
  {
    title: "Electrical and Electronics",
    description: "Expert diagnosis and repair of vehicle electrical systems.",
    imgURL: "/images/services/elec.jpg",
  },
  {
    title: "Underchasis",
    description: "Thorough underchassis inspection and repair services.",
    imgURL: "/images/services/cardetail.jpg",
  },
  {
    title: "Scanning and Diagnosing",
    description: "Advanced computer scanning and diagnostic services.",
    imgURL: "/images/services/cardetail.jpg",
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB Connected');

    await Service.deleteMany({});
    console.log('🗑️  Cleared existing services');

    const inserted = await Service.insertMany(services);
    console.log(`✅ Seeded ${inserted.length} services into MongoDB`);

    await mongoose.disconnect();
    console.log('🔌 MongoDB Disconnected');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();

