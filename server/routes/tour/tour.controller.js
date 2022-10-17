const db_config = require("../../db_config");
const conn = db_config.init();
exports.getTourData = (req, res) => {
    const {query: { id } } = req;
    console.log(id);
    const select_sql = `
        select * from tour_table where idx = ${id};
    `
    conn.query(select_sql, async (err, rows) => {
        if (err) {
          console.log(err);
          return res.status(500).send({ callback: 500, err: err });
        }
        console.log(rows);
        if (rows.length !== 0) {
          return res.send({ callback: 200, context: rows[0]});
        } else {
          return res.send({ callback: 403, context: "존재하지 않는 투어입니다." });
        }
      })
}