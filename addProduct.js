import pool from "./models/db.js";

const addProduct = async (req, res) => {
  const dbRes = await pool.execute(
    `insert into products (name, short_description, long_description, category, price) values ("${req.body.name}", "${req.body.shortDescription}", "${req.body.longDescription}", "${req.body.category}", "${req.body.price}");`,
  );

  const inserted_product_id = dbRes[0].insertId;

  const filesReceived = req.files;

  filesReceived.forEach(async (file, i) => {
    await pool.execute(
      `insert into product_images (product_id, image_url, is_primary) values (${inserted_product_id}, "/uploads/products/${file.originalname}", "${i == 0 ? 1 : 0}");`,
    );
  });
};

export default addProduct;
