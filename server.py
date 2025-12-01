from fastapi import FastAPI # type: ignore
import pymysql # type: ignore
from pydantic import BaseModel # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore
from dotenv import load_dotenv # type: ignore
import os
import bcrypt # type: ignore
from contextlib import asynccontextmanager
from datetime import datetime



load_dotenv()

DB_HOST = os.getenv("DB_HOST")
DB_PORT = int(os.getenv("DB_PORT", 5432))  # default port 5432 if missing
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASS = os.getenv("DB_PASS")

# establish connection with database
def get_conn():
    timeout = 10
    return pymysql.connect(
    charset="utf8mb4",
    connect_timeout=timeout,
    cursorclass=pymysql.cursors.DictCursor,
    db=DB_NAME,
    host=DB_HOST,
    password=DB_PASS,
    read_timeout=timeout,
    port=DB_PORT,
    user=DB_USER,
    write_timeout=timeout,
)

# ---- Create table once on startup ----
@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- Startup code here ---
    conn = get_conn()
    with conn.cursor() as cur:
        cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            firstName VARCHAR(100),
            lastName VARCHAR(100),
            username VARCHAR(100) PRIMARY KEY,
            email VARCHAR(255) UNIQUE,
            phoneNumber VARCHAR(50) UNIQUE,
            password VARCHAR(255)
        )
        """)
        # create posts table
        cur.execute("""
                    CREATE TABLE IF NOT EXISTS posts (
                        postID INT AUTO_INCREMENT PRIMARY KEY,
                        username VARCHAR(255),
                        location VARCHAR(255),
                        imageURL VARCHAR(255),
                        description TEXT,
                        likesCount INT,
                        date VARCHAR(50)
                    );
                    """)
        
        cur.execute("""
                    CREATE TABLE IF NOT EXISTS comments (
                        commentID INT AUTO_INCREMENT PRIMARY KEY,
                        postID INT NOT NULL,
                        username VARCHAR(255) NOT NULL,
                        date VARCHAR(50) NOT NULL,
                        comment TEXT NOT NULL,
                        FOREIGN KEY (postID) REFERENCES posts(postID) ON DELETE CASCADE
                    );
                    """)
        cur.execute("""
                    CREATE TABLE IF NOT EXISTS follows (
                        followerUsername VARCHAR(255) NOT NULL,
                        followingUsername VARCHAR(255) NOT NULL,
                        PRIMARY KEY(followerUsername, followingUsername),
                        FOREIGN KEY(followerUsername) REFERENCES users(username),
                        FOREIGN KEY(followingUsername) REFERENCES users(username)
                    );
                    """)
        cur.execute("""
                    CREATE TABLE IF NOT EXISTS accounts (
                        username     VARCHAR(100) PRIMARY KEY,
                        biography    VARCHAR(300),
                        profilePic   VARCHAR(255),
                        FOREIGN KEY (username) REFERENCES users(username)
                    );
                    """)
    conn.commit()
    conn.close()
    yield

# api endpoints
app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class signup_form(BaseModel):
    firstName: str
    lastName: str
    username: str
    email: str
    phoneNumber: str
    password: str

class login_form(BaseModel):
    username: str
    password: str

class post_form(BaseModel):
    username: str
    location: str
    imageURL: str
    description: str
    likesCount: int
    date: str

class comment_form(BaseModel):
    postID: int
    username: str
    comment: str
    date: str

class follow_form(BaseModel):
    followerUsername: int
    followingUsername: int

class account_form(BaseModel):
    username: str
    biography: str
    profilePic: str

# route checks if server running
@app.get("/")
def root():
    return {"message": "Server is running!"}

@app.get("/api/post")
def postsFeed():
    today = datetime.now().strftime("%#m/%#d/%Y")
    conn = get_conn()
    current_posts = []
    try: 
        with conn.cursor() as cur:
            cur.execute("SELECT * From posts")
            posts = cur.fetchall()
            for post in posts:
                if post["date"] == today:
                    current_posts.append(post)
            return {'posts': current_posts,
                    'status': "working"}
    finally:
        conn.close()
    

# login route
@app.post("/api/login")
def login(data: login_form):
    conn = get_conn()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT password FROM users WHERE username=%s",
                (data.username,)
            )
            user = cur.fetchone()

        # no user was found
        if not user:
            return {"message": "Username or password is incorrect!"}
        
        # if user found, we want to check the password hash
        pw_hash = user['password']
        if bcrypt.checkpw(data.password.encode("utf-8"), pw_hash.encode("utf-8")):
            return {"message": "Login successful!",
                        "status": "success","username": data.username}
        else:
            return {"message": "Login unsuccessful, wrong password!",
                        "status": "failed"
                        }
    finally:
        conn.close()

# signup route
@app.post("/api/signup")
def signup(data: signup_form):
    conn = get_conn()
    try:
        with conn.cursor() as cur:
            pw_hash = bcrypt.hashpw(data.password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
            
            cur.execute("SELECT * from users where username = %s or email = %s or phoneNumber = %s", (data.username, data.email, data.phoneNumber))
            user = cur.fetchone()
            if user:
                return {"message": f"{data.email} already exists!"}
            else:
                cur.execute("INSERT INTO users (firstName, lastName, username, email, phoneNumber, password) VALUES (%s, %s, %s, %s, %s, %s)", (data.firstName, data.lastName, data.username, data.email, data.phoneNumber, pw_hash))
                conn.commit()   # Always commit for schema changes
                return {"message": f"{data.email} created!"}
    finally:
        conn.close()

# post route
@app.post("/api/post")
def post(data: post_form):
    conn = get_conn()
    today = datetime.now().strftime("%#m/%#d/%Y")
    print(today)
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT COUNT(*) from posts WHERE username= %s and date= %s", (data.username, today))
            num_posts = cur.fetchone()
            # print(num_posts['COUNT(*)'])
            if num_posts['COUNT(*)'] >= 2:
                return {'message': "Maximum number of posts for Today!"}
            
            cur.execute("INSERT INTO posts(username, location, imageURL, description, likesCount, date) VALUES (%s, %s, %s, %s, %s, %s)", (data.username, data.location, data.imageURL, data.description, data.likesCount, data.date))
            conn.commit()
            return{'message': "Post Created!"}
    finally:
        conn.close()

# creating comment route
@app.post("/api/post/{postID}/comments")
def add_comment(postID: int, data: comment_form):
    conn = get_conn()
    today = datetime.now().strftime("%#m/%#d/%Y")
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT COUNT(*) FROM comments WHERE postID=%s and date=%s", (postID, today))
            count = cur.fetchone()['COUNT(*)']
            if count >= 3:
                return {'message': "Max number of comments reach today"}
            cur.execute("INSERT INTO comments(postID, username, comment, date) VALUES(%s, %s, %s, %s)", (postID, data.username, data.comment ,today))
            conn.commit()
            return{'message':"comment made!"}
    finally:
        conn.close()

@app.post("/api/account/{username}")
def update_profile(username: str, data: account_form):
    conn = get_conn()
    print(data)
    try:
        with conn.cursor() as cur:
            cur.execute("INSERT IGNORE INTO accounts(username, biography, profilePic) VALUES(%s, %s, %s)", (username, data.biography, data.profilePic))
            conn.commit()
            return{"status": "update working"}
    finally:
        conn.close()
            

# comments get route to show comments on specific post
@app.get("/api/post/{postID}/comments")
def get_comments(postID: int):
    conn = get_conn()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM comments WHERE postID = %s", (postID,))
            comments = cur.fetchall()
            return {"comments": comments}
    finally:
        conn.close()

@app.get("/api/{username}/search/{searchedUser}")
def find_users(searchedUser: str):
    conn = get_conn()
    search = f"%{searchedUser}%"
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM accounts WHERE username LIKE %s", (search,))
            accounts = cur.fetchall()
            return {"status": "working well",
                    "users": accounts}
    finally:
        conn.close()

@app.get("/api/account/{username}")
def get_account_info(username: str):
    conn = get_conn()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM accounts where username = %s", (username,))
            data = cur.fetchone()
            return {"username": data[0], "profilePic": data[1], "biography":data[2]}
    finally:
        conn.close()


    
  
