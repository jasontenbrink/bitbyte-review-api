exports.up = async knex => {
    await knex.raw(`
  CREATE OR REPLACE VIEW vendors_with_reviews AS
  SELECT v.name, v.address_line_1, v.address_line_2, v.city, v.email,
    v.state, v.zip, v.phone, v.id as vendor_id, array_agg(comment) as comments,
    avg(question_1) as question_1, avg(question_2) as question_2,
    avg(question_3) as question_3, avg(question_4) as question_4,
    avg(question_5) as question_5, avg(question_6) as question_6,
    avg(question_7) as question_7, avg(question_8) as question_8,
    avg(question_9) as question_9, avg(question_10) as question_10
  FROM reviews r
  RIGHT JOIN vendors v ON v.id = r.vendor_id 
  GROUP BY v.id, v.name, v.address_line_1, v.address_line_2,
    v.city, v.state, v.zip, v.phone, v.email;
`)
}

exports.down = async knex => {
    await knex.raw(`
  CREATE OR REPLACE VIEW vendors_with_reviews AS
  SELECT v.name, v.address_line_1, v.address_line_2, v.city, v.email,
    v.state, v.zip, v.phone, vendor_id, array_agg(comment) as comments,
    avg(question_1) as question_1, avg(question_2) as question_2,
    avg(question_3) as question_3, avg(question_4) as question_4,
    avg(question_5) as question_5, avg(question_6) as question_6,
    avg(question_7) as question_7, avg(question_8) as question_8,
    avg(question_9) as question_9, avg(question_10) as question_10
  FROM reviews r
  JOIN vendors v ON v.id = r.vendor_id 
  GROUP BY vendor_id, v.name, v.address_line_1, v.address_line_2,
    v.city, v.state, v.zip, v.phone, v.email;
`)
}
