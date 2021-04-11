npm install

config/config.json
edit database configuration

npx sequelize-cli db:create

npx sequelize-cli db:migrate

npm start

route
carete product
post : http://localhost:3000/product/create

get all product
get: http://localhost:3000/product

get single product
get: http://localhost:3000/product/{id}

get top 5 most viewed product
get: http://localhost:3000/product/most-viewed

get top user limit most viewed product
get: http://localhost:3000/product/{limit}

delete product
delete : http://localhost:3000/product/{limit}
