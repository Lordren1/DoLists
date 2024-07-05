import express from "express";  // Import the express module
import bodyParser from "body-parser";  // Import the body-parser module
import pg from "pg";  // Import the pg (node-postgres) module

const app = express();  // Create an instance of express
const port = 3000;  // Set the port number

// Configure the PostgreSQL client
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "DoList",
  password: "Lordren936875",
  port: 5432,
});

db.connect();  // Connect to the PostgreSQL database

app.use(bodyParser.urlencoded({ extended: true }));  // Use body-parser to parse URL-encoded bodies
app.use(express.static("public"));  // Serve static files from the "public" directory

// Placeholder data
let lists = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

// GET route for the root URL
app.get("/", async (req, res) => {
  try {
    // Fetch lists from the database for Today, Week, and Month categories
    const todayResult = await db.query("SELECT * FROM lists WHERE category = 'Today' ORDER BY id ASC");
    const weekResult = await db.query("SELECT * FROM lists WHERE category = 'Week' ORDER BY id ASC");
    const monthResult = await db.query("SELECT * FROM lists WHERE category = 'Month' ORDER BY id ASC");

    const todayLists = todayResult.rows;
    const weekLists = weekResult.rows;
    const monthLists = monthResult.rows;

    // Render the index.ejs template with the lists data
    res.render("index.ejs", {
      todayListTitle: "Today",
      todayListItems: todayLists,
      weekListTitle: "This Week",
      weekListItems: weekLists,
      monthListTitle: "This Month",
      monthListItems: monthLists
    });
  } catch (err) {
    console.log(err);  // Log any errors to the console
  }
});

// POST route for adding a new Week list item
app.post("/addWeek", async (req, res) => {
  const list = req.body.newWeekList;

  if (!list) {
    return res.status(400).send("Title is required");  // Send error response if title is missing
  }

  try {
    // Insert new list item into the database with category 'Week'
    await db.query("INSERT INTO lists (title, category) VALUES ($1, 'Week')", [list]);
    res.redirect("/");  // Redirect to the root URL
  } catch (err) {
    console.log(err);  // Log any errors to the console
    res.status(500).send("Error inserting data");  // Send error response if insertion fails
  }
});

// POST route for adding a new Month list item
app.post("/addMonth", async (req, res) => {
  const list = req.body.newMonthList;

  if (!list) {
    return res.status(400).send("Title is required");  // Send error response if title is missing
  }

  try {
    // Insert new list item into the database with category 'Month'
    await db.query("INSERT INTO lists (title, category) VALUES ($1, 'Month')", [list]);
    res.redirect("/");  // Redirect to the root URL
  } catch (err) {
    console.log(err);  // Log any errors to the console
    res.status(500).send("Error inserting data");  // Send error response if insertion fails
  }
});

// POST route for adding a new list item
app.post("/add", async (req, res) => {
  const list = req.body.newList;
  // lists.push({title: list});  // Uncomment if you want to add to local array instead of database

  try {
    // Insert new list item into the database
    await db.query("INSERT INTO lists (title) VALUES ($1)", [list]);
    res.redirect("/");  // Redirect to the root URL
  } catch (err) {
    console.log(err);  // Log any errors to the console
  }
});

// POST route for editing an existing list item
app.post("/edit", async (req, res) => {
  const list = req.body.updatedListTitle;
  const id = req.body.updatedListId;

  try {
    // Update the list item in the database
    await db.query("UPDATE lists SET title = ($1) WHERE id = $2", [list, id]);
    res.redirect("/");  // Redirect to the root URL
  } catch (err) {
    console.log(err);  // Log any errors to the console
  }
});

// POST route for deleting a list item
app.post("/delete", async (req, res) => {
  const id = req.body.deleteListId;
  try {
    // Delete the list item from the database
    await db.query("DELETE FROM lists WHERE id = $1", [id]);
    res.redirect("/");  // Redirect to the root URL
  } catch (err) {
    console.log(err);  // Log any errors to the console
  }
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
