const query = require("./database-query");

query.createInstance("ARN","54.254.194.139",require('fs').readFileSync("liam-sing.pem"),"1",{});