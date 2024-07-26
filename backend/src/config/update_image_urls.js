const { MongoClient } = require("mongodb");
const uri =
  "mongodb://admin:DALt5z7kaxBKqX1V4O6I@node1-ca7500ced7cd4521.database.cloud.ovh.net,node2-ca7500ced7cd4521.database.cloud.ovh.net,node3-ca7500ced7cd4521.database.cloud.ovh.net/admin?replicaSet=replicaset&tls=true";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function findImageUrls() {
  try {
    await client.connect();
    const database = client.db("mydatabase"); // Remplacez 'mydatabase' par le nom de votre base de données
    const collection = database.collection("users"); // Remplacez 'users' par le nom de votre collection

    const filter = {
      images: { $elemMatch: { $regex: "http://57.129.50.107:7000" } },
    };

    const documents = await collection.find(filter).toArray();
    console.log(`${documents.length} document(s) found`);
    console.log(documents);
  } finally {
    await client.close();
  }
}

findImageUrls().catch(console.dir);
