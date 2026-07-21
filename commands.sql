CREATE TABLE blogs (
    id SERIAL PRIMARY KEY, 
    author text, 
    url text NOT NULL, 
    title text NOT NULL, 
    likes int DEFAULT 0
);

insert into blogs (author, url, title) values ('Some author', 'www.someweb.com','Title 1');

insert into blogs (author, url, title, likes) values ('Some author 2', 'www.someweb2.com','Title 2',5);