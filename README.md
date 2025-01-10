<!-- cmd 1: to make build -->

ng build --output-path=dist/carpool --base-href /travelApp/

<!-- cmd 2: to update and push  -->

npx angular-cli-ghpages --dir=dist/carpool

<!-- for main branch  -->
<!-- for add -->

git add .

<!-- for commit -->

git commit -m "Your commit message"

<!-- for pull -->

git pull origin main

<!-- for push -->

git push
