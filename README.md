<!-- cmd 1: to make build -->

ng build --output-path=dist/carpool --base-href /travelApp/

<!-- cmd 2: to update and push  -->

npx angular-cli-ghpages --dir=dist/carpool
