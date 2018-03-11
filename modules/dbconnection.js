exports.handle_get = function (req, res, query, pool) {
  pool.getConnection(function(err, connection){
    if (err) {
      setResponseJSON(res, {"code" : 500, "status" : "Error in connecting database" + err});
      return;
    }

    connection.query(query, function(err,rows) {
      connection.release();
      if (!err) {
        setResponseJSON(res, {"code" : 100, "status" : "Successfully completed the query", "data" : rows});
      } else {
        setResponseJSON(res, {"code" : 500, "status" : "Error while executing the query. " + err});
        return;
      }
    });
    connection.on('error', function(err) {
      setResponseJSON(res, {"code" : 500, "status" : "Error in connecting database" + err});
      return;
    });
  });
}

exports.handle_execute = function (req, res, query, pool, values) {
  pool.getConnection(function(err, connection){
    if (err) {
      setResponseJSON(res, {"code" : 500, "status" : "Error in connecting database" + err});
      return;
    }

    if (values) {
      connection.query(query, values, function(err, result) {
        connection.release();
        if (!err) {
          setResponseJSON(res, {"code" : 100, "status" : "Successfully completed the query"});
        } else {
          setResponseJSON(res, {"code" : 500, "status" : "Error while executing the query. " + err});
          return;
        }
      });
    } else {
      connection.query(query, function(err, result){
        connection.release();
        if (!err) {
          setResponseJSON(res, {"code" : 100, "status" : "Successfully completed the query"});
        } else {
          setResponseJSON(res, {"code" : 500, "status" : "Error while executing the query. " + err});
          return;
        }
      });
    }

    connection.on('error', function(err) {
      setResponseJSON(res, {"code" : 500, "status" : "Error in connecting database" + err});
      return;
    });
  });
}

function setResponseJSON (res, o) {
  try {
    res.json(o);
  } catch (e) {}
}
