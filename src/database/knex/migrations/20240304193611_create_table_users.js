export function up(knex) {
  return knex.schema.createTable('users', table => {
    table.increments('id').primary()
    table.text('name').notNullable()
    table.text('email').notNullable()
    table.text('password').notNullable()
    table.text('avatar_url')
    table.text('description')
    table.timestamp('created_at').default(knex.fn.now())
    table.timestamp('updated_at').default(knex.fn.now())
  })
}

export function down(knex) {
  return knex.schema.dropTable('users')
}
