import mongoose from 'mongoose';

let tmallSchema;
let jdSchema;
const generateTmallSchema = (name) => {
  if (tmallSchema) {
    return tmallSchema;
  }
  const ProductSchema = new mongoose.Schema({
    _id: String,
    name: String,
    brand: String,
    sale: String,
    price: Number,
    date: String,
    platform: String,
  });
  tmallSchema = mongoose.model(name, ProductSchema);
  return tmallSchema;
};

const generateJdSchema = (name) => {
  if (jdSchema) {
    return jdSchema;
  }
  const ProductSchema = new mongoose.Schema({
    _id: String,
    name: String,
    brand: String,
    comment: String,
    price: Number,
    rate: String,
    date: String,
    platform: String,
  });
  jdSchema = mongoose.model(name, ProductSchema);
  return jdSchema;
};

export { generateTmallSchema, generateJdSchema };
