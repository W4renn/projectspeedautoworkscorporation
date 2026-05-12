import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://psac:psac2025@cluster0.16lqx5m.mongodb.net/psac_db';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  imgURL: String,
  category: String,
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

const products = [
  {
    title: "Canroyal 5W-30",
    imgURL: "/images/products/CANROYAL5W-30.png",
    description: "Premium full-synthetic engine oil for modern gasoline (and some light diesel) vehicles.",
    category: "Engine Oil and Oil Filters",
  },
  {
    title: "Canroyal 15W-40",
    imgURL: "/images/products/CANROYAL15W-40.png",
    description: "Heavy-duty engine oil formulated for strong protection, stable performance, and reduced wear under tough conditions.",
    category: "Engine Oil and Oil Filters",
  },
  {
    title: "FORD AIRFILTER",
    imgURL: "/images/products/AIR FILTER/FORD AIR FILTER.png",
    description: "High-efficiency intake filter engineered to deliver cleaner airflow, better combustion, and improved engine performance.",
    category: "Air Filters",
  },
  {
    title: "FORD OIL FILTER",
    imgURL: "/images/products/OIL FILTER/FORD.png",
    description: "Reliable OEM-grade filtration designed to protect your engine from contaminants and ensure smooth, long-lasting performance.",
    category: "Engine Oil and Oil Filters",
  },
  {
    title: "FORD 1 OIL FILTER",
    imgURL: "/images/products/OIL FILTER/FORD1.png",
    description: "Durable high-grade filter built to trap impurities and maintain clean, efficient engine lubrication.",
    category: "Engine Oil and Oil Filters",
  },
  {
    title: "HYUNDAI OIL FILTER",
    imgURL: "/images/products/OIL FILTER/HYUNDAI.png",
    description: "Precision-fit filtration system designed to protect engine components by efficiently capturing dirt and contaminants.",
    category: "Engine Oil and Oil Filters",
  },
  {
    title: "ISUZU OIL FILTER",
    imgURL: "/images/products/OIL FILTER/ISUZU.png",
    description: "Heavy-duty filtration engineered for reliable impurity control and extended engine protection in demanding conditions.",
    category: "Engine Oil and Oil Filters",
  },
  {
    title: "MITSUBISHI OIL FILTER",
    imgURL: "/images/products/OIL FILTER/MITSUBISHI.png",
    description: "High-performance filter designed to deliver clean oil flow, reduce wear, and maintain smooth engine operation.",
    category: "Engine Oil and Oil Filters",
  },
  {
    title: "MITSUBISHI OIL FILTER",
    imgURL: "/images/products/OIL FILTER/MITSUBUSHI.png",
    description: "Authentic Mitsubishi filter designed for superior oil filtration, engine protection, and long-lasting performance.",
    category: "Engine Oil and Oil Filters",
  },
  {
    title: "NISSAN OIL FILTER",
    imgURL: "/images/products/OIL FILTER/NISSAN.png",
    description: "Precision-engineered filter for clean oil circulation, improved engine protection, and dependable performance.",
    category: "Engine Oil and Oil Filters",
  },
  {
    title: "RENKEN OIL FILTER",
    imgURL: "/images/products/OIL FILTER/RENKEN.png",
    description: "Durable and efficient oil filtration designed to protect engines by trapping harmful particles and ensuring clean lubrication.",
    category: "Engine Oil and Oil Filters",
  },
  {
    title: "TOYOTA OIL FILTER",
    imgURL: "/images/products/OIL FILTER/TOYOTA.png",
    description: "Reliable OEM-quality filter that ensures clean oil flow and optimal engine protection for smooth performance.",
    category: "Engine Oil and Oil Filters",
  },
  {
    title: "HONDA AIRFILTER",
    imgURL: "/images/products/AIR FILTER/HONDA AIR FILTER.png",
    description: "High-efficiency filter designed to provide cleaner airflow, better combustion, and enhanced engine performance.",
    category: "Air Filters",
  },
  {
    title: "HONDA FILTER 2",
    imgURL: "/images/products/AIR FILTER/HONDA FILTER 2.png",
    description: "Precision-engineered filter that captures contaminants to keep your engine running smoothly and efficiently.",
    category: "Air Filters",
  },
  {
    title: "HYUNDAI AIRCON FILTER",
    imgURL: "/images/products/AIR FILTER/HYUNDAI AIRCON FILTER.png",
    description: "Efficient cabin filter designed to trap dust, pollen, and pollutants for cleaner, fresher air inside your vehicle.",
    category: "Air Filters",
  },
  {
    title: "HYUNDAI AIRFILTER",
    imgURL: "/images/products/AIR FILTER/HYUNDAI AIRFILTER.png",
    description: "High-performance filter that ensures clean airflow for better combustion and optimal engine efficiency.",
    category: "Air Filters",
  },
  {
    title: "ISUZU AIRFILTER",
    imgURL: "/images/products/AIR FILTER/ISUZU.png",
    description: "Durable filter designed to provide clean airflow, protect the engine, and maintain reliable performance.",
    category: "Air Filters",
  },
  {
    title: "MITSUBISHI L AIRFILTER",
    imgURL: "/images/products/AIR FILTER/MITSUBISHI L.png",
    description: "High-quality air filter engineered for optimal airflow, enhanced combustion, and long-lasting engine protection.",
    category: "Air Filters",
  },
  {
    title: "MITSUBISHI S AIRFILTER",
    imgURL: "/images/products/AIR FILTER/MITSUBISHI S.png",
    description: "Efficient air filter that ensures clean airflow, better engine performance, and prolonged engine life.",
    category: "Air Filters",
  },
  {
    title: "NISSAN AIRFILTER",
    imgURL: "/images/products/AIR FILTER/NISSAN.png",
    description: "Precision air filter designed to provide clean airflow, improve engine efficiency, and protect internal components.",
    category: "Air Filters",
  },
  {
    title: "TOYOTA L AIRFILTER",
    imgURL: "/images/products/AIR FILTER/TOYOTA L.png",
    description: "High-quality filter engineered to deliver clean airflow, enhance combustion, and protect your engine.",
    category: "Air Filters",
  },
  {
    title: "TOYOTA S AIRFILTER",
    imgURL: "/images/products/AIR FILTER/TOYOTA S.png",
    description: "Efficient air filter designed to ensure clean airflow, boost engine performance, and extend engine life.",
    category: "Air Filters",
  },
  {
    title: "VESLEE",
    imgURL: "/images/products/BRAKE CLEANER/VESLEE.png",
    description: "Reliable brake component engineered for strong stopping power, safety, and consistent performance.",
    category: "Brake Parts",
  },
  {
    title: "WURTH",
    imgURL: "/images/products/ENGINE FLUSHING/WURTH.png",
    description: "Powerful formula designed to remove sludge and deposits, restoring engine cleanliness and efficiency.",
    category: "Engine Flushing",
  },
  {
    title: "ECO COOL GREEN",
    imgURL: "/images/products/COOLANT/ECO COOL GREEN.png",
    description: "Premium coolant designed to protect engines from overheating and corrosion while ensuring optimal performance.",
    category: "Coolants",
  },
  {
    title: "ECO COOL PINK",
    imgURL: "/images/products/COOLANT/ECO COOL PINK.png",
    description: "High-performance coolant formulated to prevent corrosion and maintain stable engine temperatures.",
    category: "Coolants",
  },
  {
    title: "PATROL OIL COOLANT",
    imgURL: "/images/products/COOLANT/PATROL OIL COOLANT.png",
    description: "Engine coolant designed to regulate temperature, prevent overheating, and protect engine components.",
    category: "Coolants",
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Clear existing products to avoid duplicates
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    const inserted = await Product.insertMany(products);
    console.log(`✅ Seeded ${inserted.length} products into MongoDB`);

    await mongoose.disconnect();
    console.log('🔌 MongoDB Disconnected');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();

