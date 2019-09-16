exports.up = async knex => {
    await knex.raw(`create table users(
      id Serial PRIMARY KEY,
      first_name varchar(255),
      last_name varchar(255),
      email varchar(255),
      password varchar(255),
      created TIMESTAMP,
      updated TIMESTAMP
    )`)

    await knex.raw(`create table suggested_vendors(
      id SERIAL PRIMARY KEY,
      name varchar(255),
      address_line_1 varchar(255),
      address_line_2 varchar(255),
      city varchar(255),
      state varchar(255),
      zip varchar(10),
      phone varchar(15),
      created TIMESTAMP,
      updated TIMESTAMP
    )`)

    await knex.raw(`create table vendors(
      id SERIAL PRIMARY KEY,
      suggested_vendor_id integer REFERENCES suggested_vendors(id),
      name varchar(255),
      address_line_1 varchar(255),
      address_line_2 varchar(255),
      city varchar(255),
      state varchar(255),
      zip varchar(10),
      phone varchar(15),
      created TIMESTAMP,
      updated TIMESTAMP
    )`)

    await knex.raw(`create table reviews(
      id SERIAL PRIMARY KEY,
      vendor_id integer REFERENCES vendors(id),
      user_id integer REFERENCES users(id),
      comment TEXT,
      question_1 integer,
      question_2 integer,
      question_3 integer,
      question_4 integer,
      question_5 integer,
      question_6 integer,
      question_7 integer,
      question_8 integer,
      question_9 integer,
      question_10 integer,
      created TIMESTAMP,
      updated TIMESTAMP
    )`)

    await knex.raw(`create table feedback(
      id SERIAL PRIMARY KEY,
      user_email varchar(255),
      suggestion varchar(255),
      url varchar(255),
      created TIMESTAMP,
      updated TIMESTAMP
    )`)
}

exports.down = async knex => {
    await knex.raw(`drop table reviews;`)
    await knex.raw(`drop table vendors;`)
    await knex.raw(`drop table feedback;`)
    await knex.raw(`drop table suggested_vendors;`)
    await knex.raw(`drop table users;`)
}
