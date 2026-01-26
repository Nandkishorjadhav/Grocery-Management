import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost:27017/grocery-management').then(async () => {
  const db = mongoose.connection.db;
  const collections = await db.listCollections().toArray();
  
  console.log('All collections:');
  for (const coll of collections) {
    const count = await db.collection(coll.name).countDocuments();
    console.log(`  ${coll.name}: ${count} documents`);
    
    if (count > 0 && count < 5) {
      const docs = await db.collection(coll.name).find({}).toArray();
      console.log(`    Sample:`, docs.map(d => ({ _id: d._id, name: d.name || d.productName, status: d.status })));
    }
  }
  
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
