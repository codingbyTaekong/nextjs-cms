const db_config = require("../../db_config");
const conn = db_config.init();
exports.getGymData = (req, res) => {
    const {query: { id } } = req;
    let select_sql = `
      select * from gym_table
    `
    if (id) {
      select_sql += ` where idx=${id}`
    }
    conn.query(select_sql, async (err, rows) => {
        if (err) {
          console.log(err);
          return res.status(500).send({ callback: 500, err: err });
        }
        if (rows.length !== 0) {
          return res.send({ callback: 200, context: rows});
        } else {
          return res.send({ callback: 403, context: "존재하지 않는 투어입니다." });
        }
    })
}

exports.recentReviewGyms = (req, res) => {
  // console.log("???")
  // select idx, gym_id, review_text, AVG(review_rate) as avg_reate,  Max(created_at) as recented_at from review_table group by gym_id order by recented_at DESC limit 5
  const select_sql = `
    select * from (select idx, gym_id, review_text, AVG(review_rate) as avg_reate,  Max(created_at) as recented_at from review_table group by gym_id) r order by recented_at DESC
  `
  conn.query(select_sql, async (err, rows) => {
    if (err) {
      console.log(err);
      return res.status(500).send({ callback: 500, err: err });
    }
    console.log(rows);
    if (rows.length !== 0) {
      return res.send({ callback: 200, context: rows});
    } else {
      return res.send({ callback: 403, context: "존재하지 않는 투어입니다." });
    }
})
}
/**
 * 
 17:33:03	SELECT * FROM  
 ( select * from   bigchoi.review_table where (gym_id, created_at) in 
 (  select gym_id, max(created_at) as created_at from bigchoi.review_table group by gym_id )
  order by created_at desc) t group by t.gym_id 
  LIMIT 0, 1000	Error Code: 1055. Expression #1 of SELECT list is not in GROUP BY clause and contains nonaggregated column 't.idx' which is not functionally dependent on columns in GROUP BY clause; this is incompatible with sql_mode=only_full_group_by	0.00029 sec
 */