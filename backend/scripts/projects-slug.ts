// ### connect to db via terminal
// mongosh "mongodb+srv://<user>:<pass>@portfolio.axihhnv.mongodb.net/portfolio?retryWrites=true&w=majority"

// ### useful commands
// show dbs
// show collections
// db.projects.find()
// db.projects.updateOne({ _id: p._id }, { $set: { slug } });

// ### Run script to generate slugs for projects:

// const coll = db.projects;

// coll.find({ $or: [
//   { slug: { $exists: false } },
//   { slug: null },
//   { slug: '' }
// ]}).forEach(p => {
//   if (!p.title) return;

//   const base = p.title.toLowerCase().trim()
//     .replace(/[^a-z0-9\s-]/g, '')
//     .replace(/\s+/g, '-')
//     .replace(/-+/g, '-');

//   let slug = base;
//   let i = 2;

//   // Avoid collisions with other docs
//   while (true) {
//     const existing = coll.findOne({ slug });
//     if (!existing || existing._id.valueOf() === p._id.valueOf()) break;
//     slug = `${base}-${i++}`;
//   }

//   coll.updateOne({ _id: p._id }, { $set: { slug } });
// });