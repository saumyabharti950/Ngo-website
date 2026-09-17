# Foundation content seed

The supplied UTF-8 organisational profile is preserved in `sifi-foundation-source.txt`. Run `node src/seed-data/build-content.cjs` from `backend` to rebuild `foundation-content.json`.

Three seeders populate the existing `contents` table: 10 programmes, 7 blogs and 5 impact pathways. The 18 areas of work are grouped into ten complementary programmes. All 23 numbered source sections contribute to the blogs; navigation labels and organisation details remain source text, while editorial commands, unverified suggested dates and placeholder beneficiary claims are excluded from public copy. The original file remains available for comparison.

Impact pathways describe intended change, not verified beneficiary achievements. No beneficiary names, counts, budgets, testimonials or measured results are invented. Existing local images are illustrative. Optional media and beneficiary fields without source evidence remain empty.

From `backend`, run `npm run migrate`, then `npm run seed:foundation`. This targeted command avoids re-running the old bootstrap seeder, which inserts roles/users and is not repeatable. On a completely empty migrated database, `npm run seed` runs bootstrap followed by these seeders.

Each module seeds in a transaction and matches rows by module and slug. Rerunning refreshes this dataset without duplicates. The existing education, local-voices blog and women's story demo rows are reused; unrelated content is preserved. Undo deletes only the dataset's module/slug pairs (including reused demo rows), does not restore their previous copy, and retains categories that other articles may use.
