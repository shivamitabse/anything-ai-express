import pool from "./models/db.js";

export const getProductDetails = async (req, res) => {
  const dbResponse = await pool.execute(
    `select * from products left join product_images on products.id = product_images.product_id where products.id = ${req.params.id}`,
  );

  const primaryImageRecord = await pool.execute(
    `select * from products left join product_images on products.id = product_images.product_id where products.id = ${req.params.id} and product_images.is_primary = 1`,
  );

  const primary_image_url = primaryImageRecord[0][0].image_url;

  const finalResponse = dbResponse[0];

  finalResponse.push({ main_image_url: primary_image_url });

  res.send(finalResponse);
};
