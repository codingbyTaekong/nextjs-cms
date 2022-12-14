const db_config = require("../../db_config");
const conn = db_config.init();
const {upload} = require('../../middleware/multer')
exports.getGymData = (req, res) => {
    const {query: { id, name } } = req;
    let select_sql = `
      select * from gym_table
    `
    if (id) {
      select_sql += ` where idx=${id}`
    }
    console.log(name)
    if (name) {
      console.log(name)
      select_sql += ` where gym_name like '%${name}%'`
    }
    conn.query(select_sql, async (err, rows) => {
        if (err) {
          console.log(err);
          return res.status(500).send({ callback: 500, err: err });
        }
        if (rows.length !== 0) {
          return res.send({ callback: 200, context: rows});
        } else {
          return res.status(403).send({ callback: 403, context: "존재하지 않는 투어입니다." });
        }
    })
}

exports.recentReviewGyms = async (req, res) => {
  // console.log("???")
  // select idx, gym_id, review_text, AVG(review_rate) as avg_reate,  Max(created_at) as recented_at from review_table group by gym_id order by recented_at DESC limit 5
  const select_sql = `
    select Max(gym_id) as gym_id, AVG(review_rate) as avg_reate,  Max(created_at) as recented_at from review_table group by gym_id order by recented_at DESC limit 5
  `

  try {
    
    const [recents_reviews_rows] = await conn.promise().query(select_sql);

    if (recents_reviews_rows.length === 0) {
      return res.send({callback : 202, context : [] })
    }
    let select_gym_sql = `
      select * from gym_table
    `
    let selcet_review_sql = `
      select * from review_table
    `
    recents_reviews_rows.map((obj,index) => {
      if (index === 0) {
        select_gym_sql += `where place_id = ${obj.gym_id}`
        selcet_review_sql += `where gym_id = ${obj.gym_id}`
      } else if (index === recents_reviews_rows.length -1) {
        select_gym_sql += ` or place_id = ${obj.gym_id}`
        selcet_review_sql += ` or gym_id = ${obj.gym_id} order by created_at DESC`
      } else {
        select_gym_sql += ` or place_id = ${obj.gym_id}`
        selcet_review_sql += ` or gym_id = ${obj.gym_id}`
      }
    })
    // console.log(selcet_review_sql);
    // console.log(select_gym_sql);
    const [gym_rows] = await conn.promise().query(select_gym_sql);
    const [review_rows] = await conn.promise().query(selcet_review_sql);
    // console.log(gym_rows);
    // console.log(review_rows)
    recents_reviews_rows.map((obj,index) => {
      gym_rows[index].average_rate = Number(obj.avg_reate).toFixed(1);
    })

    review_rows.map((review, index) => {
      const gym_id = review.gym_id;
      gym_rows.map(gym => {
        if (gym.place_id === gym_id) {
          if (!gym.reviews) {
            gym.reviews = [review]
          } else {
            gym.reviews = gym.reviews.concat(review)
          }
        }
      })
    })
    res.send({callback : 200, context : gym_rows })
  } catch (error) {
    console.log(error);
    res.send({callback : 500, context : error })
  }
//   conn.query(select_sql, (err, rows) => {
//     if (err) {
//       console.log(err);
//       return res.status(500).send({ callback: 500, err: err });
//     }
//     if (rows.length !== 0) {
//       let select_gym_sql = `
//         select * from gym_table
//       `
//       let selcet_review_sql = `
//         select * from review_table
//       `
//       rows.map((obj,index) => {
//         if (index === 0) {
//           select_gym_sql += `where idx = ${obj.gym_id}`
//           selcet_review_sql += `where idx = ${obj.idx}`
//         } else {
//           select_gym_sql += ` or ${obj.gym_id}`
//           selcet_review_sql += ` or ${obj.idx}`
//         }
//       })
//       conn.query(select_gym_sql, (err, recent_gyms)=> {
//         rows.map((obj,index) => {
//           recent_gyms[index].average_rate = Number(obj.avg_reate).toFixed(1);
//         })
//         return res.send({ callback: 200, context: recent_gyms});
//       })
//     } else {
//       return res.send({ callback: 200, context: [] });
//     }
// })
}

exports.getGymTextReviews = async (req, res) => {
  try {
    const {query: { id, offset, type } } = req;
    const select_page_count = `select count(*) as max_offset from review_table where gym_id=${id} and review_type='${type}'`
    let select_sql = `
      select * from review_table where gym_id = '${id}' and review_type='${type}' limit 5
    `
    if (offset !== null && offset !== undefined) {
      select_sql += ` offset ${offset}`
    }
    const [max_offset_row] = await conn.promise().query(select_page_count);
    const [reviews_rows] = await conn.promise().query(select_sql);
    res.send({callback : 200, max_offset : Math.floor(max_offset_row[0].max_offset / 5), reviews : reviews_rows})
  } catch (error) {
    res.status(500).send({callback : 500, context : error })
  }
}

exports.postGymReview = async (req, res) => {
  const {text_review, rate, keyword, id, gym_id} = req.body
  const review_type = req.files && req.files.length > 0 ? 'img' : 'text'
  const review_imgs = req.files ? req.files.map(file => `http://${req.headers.host}/uploads/${file.filename}`).join(', ') : null
  const insert_sql = `INSERT INTO review_table (gym_id, review_type, review_rate, review_text, review_writer, review_select, review_imgs) VALUES ('${gym_id}', '${review_type}', '${rate}', '${text_review}', '${id}', '${keyword.join(', ')}', '${review_imgs}')`

  const [result] = await conn.promise().query(insert_sql);
  console.log(result)
  res.status(200).send({callback : 200, insert_id : result.insertId});
}
/**
 * 
 17:33:03	SELECT * FROM  
 ( select * from   bigchoi.review_table where (gym_id, created_at) in 
 (  select gym_id, max(created_at) as created_at from bigchoi.review_table group by gym_id )
  order by created_at desc) t group by t.gym_id 
  LIMIT 0, 1000	Error Code: 1055. Expression #1 of SELECT list is not in GROUP BY clause and contains nonaggregated column 't.idx' which is not functionally dependent on columns in GROUP BY clause; this is incompatible with sql_mode=only_full_group_by	0.00029 sec
 */