exports.up = async knex => {
    await knex.raw(
        `ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE (email)`
    )

    await knex.raw(
        `ALTER TABLE reviews ADD CONSTRAINT unique_user_id_and_vendor_id UNIQUE (user_id, vendor_id)`
    )
}

exports.down = async knex => {
    await knex.raw(`ALTER TABLE users DROP CONSTRAINT unique_email;`)
    await knex.raw(
        `ALTER TABLE reviews DROP CONSTRAINT unique_user_id_and_vendor_id;`
    )
}
