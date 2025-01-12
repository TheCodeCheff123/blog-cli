#!/usr/bin/env node

const fs = require("fs");
const readline = require("readline");

// File to store blog posts
const BLOG_DATA_FILE = "blog_posts.json";

// Read existing blog posts or initialize an empty array
function getBlogPosts() {
    if (fs.existsSync(BLOG_DATA_FILE)) {
        const data = fs.readFileSync(BLOG_DATA_FILE, "utf-8");
        return JSON.parse(data);
    }
    return [];
}

// Save blog posts to file
function saveBlogPosts(posts) {
    fs.writeFileSync(BLOG_DATA_FILE, JSON.stringify(posts, null, 2));
}

// CLI interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function showMenu() {
    console.log(`
Welcome to the Blog CLI!
Choose an option:
1. Add a blog post
2. List all blog posts
3. View a blog post
4. Delete a blog post
5. Exit
    `);

    rl.question("Enter your choice: ", (choice) => {
        switch (choice.trim()) {
            case "1":
                addPost();
                break;
            case "2":
                listPosts();
                break;
            case "3":
                viewPost();
                break;
            case "4":
                deletePost();
                break;
            case "5":
                console.log("Goodbye!");
                rl.close();
                break;
            default:
                console.log("Invalid choice. Please try again.");
                showMenu();
        }
    });
}

function addPost() {
    rl.question("Enter the title of the blog post: ", (title) => {
        rl.question("Enter the content of the blog post: ", (content) => {
            const posts = getBlogPosts();
            posts.push({ id: posts.length + 1, title, content });
            saveBlogPosts(posts);
            console.log("Blog post added successfully!");
            showMenu();
        });
    });
}

function listPosts() {
    const posts = getBlogPosts();
    if (posts.length === 0) {
        console.log("No blog posts found.");
    } else {
        console.log("Blog Posts:");
        posts.forEach((post) => {
            console.log(`${post.id}. ${post.title}`);
        });
    }
    showMenu();
}

function viewPost() {
    const posts = getBlogPosts();
    rl.question("Enter the ID of the blog post to view: ", (id) => {
        const post = posts.find((p) => p.id === parseInt(id));
        if (post) {
            console.log(`\nTitle: ${post.title}\nContent: ${post.content}\n`);
        } else {
            console.log("Blog post not found.");
        }
        showMenu();
    });
}

function deletePost() {
    const posts = getBlogPosts();
    rl.question("Enter the ID of the blog post to delete: ", (id) => {
        const index = posts.findIndex((p) => p.id === parseInt(id));
        if (index !== -1) {
            posts.splice(index, 1);
            saveBlogPosts(posts);
            console.log("Blog post deleted successfully!");
        } else {
            console.log("Blog post not found.");
        }
        showMenu();
    });
}

// Initialize the application
showMenu();