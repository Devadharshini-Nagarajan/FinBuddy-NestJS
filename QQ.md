Learn more about:
- constraints
- indexing





NestJS API:
- how budget row added?
- budgetcategory added?

---User
GET by id:
CREATE: 
    - create user
    - add default categories
DELETE:


---Categories
GET /categories?includeInactive=false
POST /categories
PUT /categories/:id
DELETE /categories/:id

---- Budgets & Monthly limits
GET /budgets/:monthKey
POST /budgets/:monthKey

---Items (expenses)
GET /items?from=YYYY-MM-DD&to=YYYY-MM-DD&categoryId=&limit=50&offset=0&sort=occurredAt.desc
POST /items
DELETE /items/:id


-- How do u make sure user updates his own record





************************************