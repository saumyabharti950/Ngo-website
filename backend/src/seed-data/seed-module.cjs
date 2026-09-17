const dataset = require('./foundation-content.json');

module.exports = function seedModule(module) {
  return {
    async up(queryInterface) {
      const db = queryInterface.sequelize;
      await db.transaction(async transaction => {
        const [users] = await db.query('SELECT id FROM users WHERE deleted_at IS NULL ORDER BY id LIMIT 1', {transaction});
        const author = users[0]?.id || null;
        for (const [index, item] of dataset[module].entries()) {
          const now = new Date();
          const payload = {...item.payload};
          if (payload.programmeSlug) {
            const [programmes] = await db.query('SELECT id FROM contents WHERE module = :module AND slug = :slug AND deleted_at IS NULL', {replacements: {module: 'programmes', slug: payload.programmeSlug}, transaction});
            if (!programmes.length) throw new Error('Seed programmes before impact stories');
            payload.programmeId = programmes[0].id;
            delete payload.programmeSlug;
          }
          let categoryId = null;
          if (module === 'blogs') {
            const categorySlug = item.category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            let [categories] = await db.query('SELECT id FROM blog_categories WHERE slug = :slug', {replacements: {slug: categorySlug}, transaction});
            if (!categories.length) {
              await queryInterface.bulkInsert('blog_categories', [{name: item.category, slug: categorySlug, description: `SIFI Foundation articles on ${item.category.toLowerCase()}.`, status: 'active', created_at: now, updated_at: now}], {transaction});
              [categories] = await db.query('SELECT id FROM blog_categories WHERE slug = :slug', {replacements: {slug: categorySlug}, transaction});
            }
            categoryId = categories[0].id;
          }
          const values = {...item, module, payload: JSON.stringify(payload), tags: JSON.stringify(item.tags), category_id: categoryId, status: 'published', featured: index < 3, sort_order: index + 1, updated_by: author, updated_at: now};
          const [existing] = await db.query('SELECT id FROM contents WHERE module = :module AND slug = :slug', {replacements: {module, slug: item.slug}, transaction});
          if (existing.length) {
            await queryInterface.bulkUpdate('contents', {...values, deleted_at: null}, {id: existing[0].id}, {transaction});
          } else {
            await queryInterface.bulkInsert('contents', [{...values, created_by: author, created_at: now, published_at: now}], {transaction});
          }
        }
      });
    },
    async down(queryInterface, Sequelize) {
      // Only this dataset's module/slug pairs; never clear unrelated content.
      await queryInterface.bulkDelete('contents', {module, slug: {[Sequelize.Op.in]: dataset[module].map(item => item.slug)}}, {});
    }
  };
};
