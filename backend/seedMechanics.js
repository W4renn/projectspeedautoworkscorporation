import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://psac:psac2025@cluster0.16lqx5m.mongodb.net/psac_db';

const mechanicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  desc: { type: String, required: true },
  role: { type: String, required: true },
  imgURL: String,
}, { timestamps: true });
  
const Mechanic = mongoose.model('Mechanic', mechanicSchema);

const mechanics = [
  {
    name: "Chief Technician Raymundo Belmonte",
    desc: "Chief Technician with over 15 years of experience in automotive repair.",
    role: "Chief Technician",
    imgURL: "/images/mechanics/CHIEF M.png",
  },
  {
    name: "Mechanic Jason Agapan",
    desc: "Experienced mechanic with a passion for automotive repair.",
    role: "Mechanic",
    imgURL: "/images/mechanics/M1.png",
  },
  {
    name: "Mechanic Johnrel Belmonte",
    desc: "Dedicated mechanic with a strong background in diagnostics.",
    role: "Mechanic",
    imgURL: "/images/mechanics/M2.png",
  },
  {
    name: "Mechanic Dominic Ray Jeresano",
    desc: "Skilled mechanic with expertise in modern automotive systems.",
    role: "Mechanic",
    imgURL: "/images/mechanics/M3.png",
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB Connected');

    await Mechanic.deleteMany({});
    console.log('🗑️  Cleared existing mechanics');

    const inserted = await Mechanic.insertMany(mechanics);
    console.log(`✅ Seeded ${inserted.length} mechanics into MongoDB`);

    await mongoose.disconnect();
    console.log('🔌 MongoDB Disconnected');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();

