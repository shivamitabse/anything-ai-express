import pool from "./models/db.js";

export const getProducts = async (req, res) => {
  const dbResponse = await pool.execute(
    "select products.id, products.name, products.short_description, products.category, products.price, product_images.image_url from products left join product_images on products.id = product_images.product_id where product_images.is_primary = 1;",
  );
  res.send(dbResponse[0]);
};
